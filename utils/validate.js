/** utils/validate.js */

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.signToken = (id) => {
  return jwt.sign({ userId: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_SECRET_EXPIRATION,
  });
};

// Generate hashed password
exports.hashedPassword = async (userPassword) => {
  return await bcrypt.hash(userPassword, 12);
};

// validate hashed password
exports.validatePassword = async (clientPassword, databasePassword) => {
  return await bcrypt.compare(clientPassword, databasePassword);
};

// Gets the token, compare and verify with the secret_key and update the user access
exports.authenticateToken = (req, res, next) => {
  // grab the authorization header
  const authHeader = req.headers["authorization"];

  const token = authHeader && authHeader.split(" ")[1]; // Extract the token from the header

  if (!token) {
    return res.status(401).json({ message: "Access Denied" });
  }

  // verifies the token from secret_key
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res
        .status(403)
        .json({ message: "Invalid token or Expired token" });
    }

    req.user = user;

    next();
  });
};

exports.authenticateTokenFromGoogle = token => {
    return jwt.decode(token);
}