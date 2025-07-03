const jwt = require('jsonwebtoken');
const authMiddleware = (req, res, next) => {
  const authHeader = req.header("Authorization");

  console.log("Authorization Header:", authHeader); // ✅ Add this

  if (!authHeader)
    return res.status(401).json({ msg: "No token, authorization denied" });

  const token = authHeader.split(" ")[1]; 
  console.log("Extracted Token:", token); // ✅ Add this too

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log("Decoded Token:", decoded); // ✅ Add this for confirmation
    next();
  } catch (err) {
    console.error("JWT Error:", err.message);
    res.status(401).json({ msg: "Token is not valid" });
  }
};

const isMentor = (req, res, next) => {
  if (req.user.role !== "mentor") {
    return res.status(403).json({ message: "Access denied. Mentor only." });
  }
  next();
};

module.exports = {
  authMiddleware,
  isMentor,
};
 