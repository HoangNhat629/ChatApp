const express = require("express");
const {
  signUp,
  login,
  getUserInfo,
  updateUserInfo,
  uploadProfileImage,
  deleteProfileImage,
  logOut
} = require("../controllers/AuthController");
const { verifyToken } = require("../middlewares/AuthMiddlewares");
const multer  = require('multer');
const router = express.Router();
const upload = multer({ dest: "upload/profile/" });
router.post("/signup", signUp);
router.post("/login", login);
router.get("/user-info", verifyToken, getUserInfo);
router.post("/update-profile", verifyToken, updateUserInfo);
router.post(
  "/add-profile-image",
  verifyToken,
  upload.single("profile-image"),
  uploadProfileImage
);
router.delete("/delete-profile-image", verifyToken, deleteProfileImage);
router.post("/logout", logOut);
module.exports = router;
