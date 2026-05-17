const jwt = require("jsonwebtoken");

/**
 * Authentication Middleware
 * Verifies JWT token and attaches user to request
 */
const auth = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ message: "No token, authorization denied" });
    }

    const jwtSecret = process.env.JWT_SECRET || "smart-events-secret-key-2026";
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

/**
 * Check if user is organizer
 */
const isOrganizer = (req, res, next) => {
  if (req.user.role !== "organizer") {
    return res
      .status(403)
      .json({ message: "Only organizers can perform this action" });
  }
  next();
};

module.exports = { auth, isOrganizer };
