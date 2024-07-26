const mongoose = require("mongoose");
const crypto = require("crypto");
const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    messageType: {
      type: String,
      enum: ["text", "file"],
      required: true,
    },
    content: {
      type: String,
      required: function () {
        return this.messageType === "text";
      },
    },
    fileURL: {
      type: String,
      required: function () {
        return this.messageType === "file";
      },
    },
    timestamps: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const iv = crypto.randomBytes(16);
function encrypt(text) {
  let cipher = crypto.createCipheriv(
    process.env.ALGORITHM,
    Buffer.from(process.env.SECRETKEY),
    iv
  );
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString("hex") + ":" + encrypted.toString("hex");
}

function decrypt(text) {
  let textParts = text.split(":");
  let iv = Buffer.from(textParts.shift(), "hex");
  let encryptedText = Buffer.from(textParts.join(":"), "hex");
  let decipher = crypto.createDecipheriv(
    process.env.ALGORITHM,
    Buffer.from(process.env.SECRETKEY),
    iv
  );
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}
messageSchema.pre("save", function (next) {
  if (this.messageType === "text" && this.content) {
    this.content = encrypt(this.content);
  }
  if (this.messageType === "file" && this.fileURL) {
    this.fileURL = encrypt(this.fileURL);
  }
  next();
});

// Instance method to decrypt content
messageSchema.methods.decryptContent = function () {
  if (this.messageType === "text" && this.content) {
    return decrypt(this.content);
  }
  return null;
};

// Instance method to decrypt fileURL
messageSchema.methods.decryptFileURL = function () {
  if (this.messageType === "file" && this.fileURL) {
    return decrypt(this.fileURL);
  }
  return null;
};
module.exports = mongoose.model("Message", messageSchema);
