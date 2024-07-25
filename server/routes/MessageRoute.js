const express = require("express");
const { getMessages, uploadFile } = require("../controllers/MessageController");
const { verifyToken } = require("../middlewares/AuthMiddlewares");
const multer = require("multer");
const upload = multer({ dest: "upload/files/" });
const router = express.Router();
router.post("/get-messages", verifyToken, getMessages);
router.post("/upload-file", verifyToken, upload.single("file"), uploadFile);
module.exports = router;
