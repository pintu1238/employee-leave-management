import jwt from "jsonwebtoken";
import { query } from "../db/db.js";

const verifyUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) return res.status(401).json({ success: false, error: "Token not provided" });

    const decoded = jwt.verify(token, process.env.JWT_KEY);
    if (!decoded) return res.status(404).json({ success: false, error: "token not valid" });

    const result = await query("SELECT id, name, email, role, profile_image, department FROM users WHERE id = $1", [decoded.id]);
    const user = result.rows[0];
    if (!user) return res.status(404).json({ success: false, error: "User not found" });

    req.user = user;
    next();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: "server error" });
  }
};

export default verifyUser;