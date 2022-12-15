const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/**
 * Generates Hash of a password string
 */
exports.encryptPassword = async (password) => bcrypt.hashSync(password, 10);

/**
 * Compare the password using bcryptjs algo
 */
exports.comparePassword = async (password, hash) =>
  await bcrypt.compare(password, hash);

/**
 * Generates JWT Token
 */
exports.generateToken = async (payload) => {
  const token = await jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  return token;
};

/**
 * decode JWT token
 */
exports.decode = async (token) => {
  return jwt.decode(token, process.env.JWT_SECRET);
};
