import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protect = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token =
    authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : req.headers["x-auth-token"]; // fallback if client still sends this header

  if (!token) {
    return res.status(401).json({ message: "No token provided, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user; // full Mongoose doc, so req.user.role / .save() work downstream
    next();
  } catch (error) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

export default protect;
