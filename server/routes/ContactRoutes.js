const express = require("express");
const {
  searchContacts,
  getContactsForDMList,
  getAllContacts
} = require("../controllers/ContactController");
const { verifyToken } = require("../middlewares/AuthMiddlewares");
const router = express.Router();
router.post("/search", verifyToken, searchContacts);
router.get("/get-contact-for-dm", verifyToken, getContactsForDMList);
router.get("/get-all-contacts", verifyToken, getAllContacts);
module.exports = router;
