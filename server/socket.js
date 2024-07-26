const { Server } = require("socket.io");
const Message = require("./models/MessageModel");
const Channel = require("./models/ChannelModel");
const setupSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.ORIGIN,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });
  const userSocketMap = new Map();
  const disconnect = (socket) => {
    console.log(`User disconnected with socket: ${socket.id}`);
    for (const [userId, socketId] of userSocketMap.entries()) {
      if (socketId === socket.id) {
        userSocketMap.delete(userId);
        break;
      }
    }
  };
  const sendMessage = async (message) => {
    try {
      const senderSocketId = userSocketMap.get(message.sender);
      const recipientSocketId = userSocketMap.get(message.recipient);
      const createdMessage = await Message.create(message);

      const messageData = await Message.findById(createdMessage._id)
        .populate("sender", "id email firstName lastName image color")
        .populate("recipient", "id email firstName lastName image color");
      if (messageData.messageType === "text" && messageData.content) {
        messageData.content = messageData.decryptContent();
      } else if (messageData.messageType === "file" && messageData.fileURL) {
        messageData.fileURL = messageData.decryptFileURL();
      }
      if (recipientSocketId) {
        io.to(recipientSocketId).emit("recieveMessage", messageData);
      }
      if (senderSocketId) {
        io.to(senderSocketId).emit("recieveMessage", messageData);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };
  const sendChannelMessage = async (message) => {
    try {
      const { content, sender, channelId, messageType, fileURL } = message;
      const createdMessage = await Message.create({
        sender,
        recipient: null,
        content,
        messageType,
        timestamps: new Date(),
        fileURL,
      });
      const messageData = await Message.findById(createdMessage._id)
        .populate("sender", "id email firstName lastName image color")
        .exec();
      await Channel.findByIdAndUpdate(channelId, {
        $push: { messages: createdMessage._id },
      });
      if (messageData.messageType === "text" && messageData.content) {
        messageData.content = messageData.decryptContent();
      } else if (messageData.messageType === "file" && messageData.fileURL) {
        messageData.fileURL = messageData.decryptFileURL();
      }
      const channel = await Channel.findById(channelId).populate("members");
      const finalData = { ...messageData._doc, channelId: channel._id };
      if (channel && channel.members) {
        channel.members.forEach((member) => {
          const memberSocketId = userSocketMap.get(member._id.toString());
          if (memberSocketId) {
            io.to(memberSocketId).emit("recieve-channel-message", finalData);
          }
        });
        const adminSocketId = userSocketMap.get(channel.admin._id.toString());
        if (adminSocketId) {
          io.to(adminSocketId).emit("recieve-channel-message", finalData);
        }
      }
    } catch (error) {
      console.error("Error sending channel message:", error);
    }
  };

  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    if (userId) {
      userSocketMap.set(userId, socket.id);
      console.log(`User ${userId} connected: with socket: ${socket.id}`);
    } else {
      console.log("Invalid user connected");
    }
    socket.on("sendMessage", sendMessage);
    socket.on("send-channel-message", sendChannelMessage);
    socket.on("disconnect", () => disconnect(socket));
  });
};
module.exports = { setupSocket };
