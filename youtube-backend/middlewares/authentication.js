import jwt from "jsonwebtoken";
import User from "../models/user.js";

const JWT_SECRET = "your_jwt_secret_key"; // use process.env.JWT_SECRET in production

const auth = async (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ error: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    req.user = user; // Attach user to request
    req.userId = user._id;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token is not valid" });
  }
};

export default auth;
