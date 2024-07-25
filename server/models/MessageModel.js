const mongoose = require("mongoose");
const crypto = require("crypto");
const messageSchema = new mongoose.Schema(
    {
      sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      }, 
      recipient:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false,
      },
      messageType:{
        type: String,
        enum: ["text", "file"],
        required: true,
      },
      content: {
        type: String,
        required: function() {
            return this.messageType === "text";
        },
      },
      fileURL: {
        type: String,
        required: function() {
            return this.messageType === "file";
        },
      },
      timestamps:{
        type: Date,
        default: Date.now
      }
    },
    {
      timestamps: true,
    }
  );

  module.exports = mongoose.model("Message", messageSchema);
  