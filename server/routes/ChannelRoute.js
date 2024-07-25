const express = require("express");
const {
  createChannel,
  getUserChannels,
  getChannelMessages,
} = require("../controllers/ChannelController");
const { verifyToken } = require("../middlewares/AuthMiddlewares");
const router = express.Router();
router.post("/create-channel", verifyToken, createChannel);
router.get("/get-user-channel", verifyToken, getUserChannels);
router.get("/get-channel-messages/:channelId", verifyToken, getChannelMessages);
module.exports = router;
