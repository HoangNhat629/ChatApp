const Message = require("../models/MessageModel");
const { renameSync, mkdirSync } = require("fs");
const getMessages = async (req, res) => {
  try {
    const user1 = req.user._id;
    const user2 = req.body.id;
    if (!user1 || !user2) {
      return res.status(400).send("User ID is required");
    }
    const messagesList = await Message.find({
      $or: [
        { sender: user1, recipient: user2 },
        { sender: user2, recipient: user1 },
      ],
    }).sort({ timestamps: 1 });
    const decryptedMessages = messagesList.map((message) => {
      if (message.messageType === "text") {
        message.content = message.decryptContent();
      } else if (message.messageType === "file") {
        message.fileURL = message.decryptFileURL();
      }
      return message;
    });
    return res.status(200).json({ messages: decryptedMessages });
  } catch (e) {
    return res
      .status(500)
      .send({ msg: "Internal Server Error", error: e.message });
  }
};
const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("No files uploaded.");
    }
    const date = Date.now();
    let fileDir = `upload/files/${date}`;
    let fileName = `${fileDir}/${req.file.originalname}`;
    mkdirSync(fileDir, { recursive: true });
    renameSync(req.file.path, fileName);
    return res.status(200).json({ filePath: fileName });
  } catch (e) {
    return res
      .status(500)
      .send({ msg: "Internal Server Error", error: e.message });
  }
};
module.exports = {
  getMessages,
  uploadFile,
};
