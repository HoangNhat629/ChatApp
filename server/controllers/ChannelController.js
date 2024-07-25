const User = require("../models/AuthModel");
const Channel = require("../models/ChannelModel");
const createChannel = async (req, res) => {
  try {
    const { name, members } = req.body;
    const admin = await User.findById(req.user._id);
    if (!admin) {
      return res.status(401).send("User not authorized");
    }
    const valiMembers = await User.find({ _id: { $in: members } });
    if (valiMembers.length !== members.length) {
      return res.status(400).send("Invalid member id");
    }
    const newChannel = new Channel({
      name,
      members,
      admin: req.user._id,
    });
    await newChannel.save();
    return res.status(200).json({ channel: newChannel });
  } catch (e) {
    return res
      .status(500)
      .send({ msg: "Internal Server Error", error: e.message });
  }
};
const getUserChannels = async (req, res) => {
  try {
    const channels = await Channel.find({
      $or: [{ admin: req.user._id }, { members: req.user._id }],
    }).sort({ updatedAt: -1 });
    return res.status(200).json({ channels });
  } catch (e) {
    return res
      .status(500)
      .send({ msg: "Internal Server Error", error: e.message });
  }
};
const getChannelMessages = async (req, res) => {
  try {
    const { channelId } = req.params;
    const channel = await Channel.findById(channelId).populate({
      path: "messages",
      populate: {
        path: "sender",
        select: "firstName lastName email _id image color",
      },
    });
    if (!channel) {
      return res.status(404).send("Channel not found");
    }
    const messages = channel.messages;
    return res.status(200).json({ messages });
  } catch (e) {
    return res
      .status(500)
      .send({ msg: "Internal Server Error", error: e.message });
  }
};
module.exports = {
  createChannel,
  getUserChannels,
  getChannelMessages,
};
