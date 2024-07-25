const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/AuthModel"); // Ensure you require your User model

const verifyToken = asyncHandler(async (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(401).send("You are not authenticated");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    const user = await User.findById(decoded?.userId.id);

    if (!user) {
      return res.status(401).send("User not found, please login again");
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).send("Token expired, please login again");
    }
    return res.status(401).send("Not authorized, please login again");
  }
});

module.exports = {
  verifyToken,
};
