const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  let token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    if (token.startsWith("Bearer ")) {
      token = token.slice(7); // Extract token after "Bearer "
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
    req.user = { id: decoded.userId, name: decoded.name }; // Store user ID and name

    next();
  } catch (err) {
    console.error("JWT Verification Error:", err.message);
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};
