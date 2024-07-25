const jwt = require("jsonwebtoken");
maxAge = 3 * 24 * 60 * 60 * 1000;
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_KEY, {
    expiresIn: maxAge,
  });
};

module.exports = { generateToken };
