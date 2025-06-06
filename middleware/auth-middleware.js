import jwt from "jsonwebtoken";
import {User} from "../models/user-model.js";

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      req.user = await User.findById(decoded.userId).select("-password");

      next(); 
    } catch (error) {
      console.error("Authorization error:", error);
      res.status(401).json({ msg: "Unauthorized" });
    }
  }

  if (!token) {
    res.status(401).json({ msg: "No token, authorization denied" });
  }
};