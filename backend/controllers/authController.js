import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { query } from "../db/db.js";

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await query("SELECT * FROM users WHERE email = $1", [email]);
    const user = result.rows[0];

    if (!user) return res.status(404).json({ success: false, error: "User Not Found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(404).json({ success: false, error: "Wrong Password" });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_KEY, { expiresIn: "10d" });

    res.status(200).json({
      success: true,
      token,
      user: {
        _id: user.id,
        name: user.name,
        email: user.email,
        department: user.department,
        role: user.role,
      },
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

const register = async (req, res) => {
  try {
    const { name, email, password, department } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, error: "Name, email and password are required" });
    }

    const existing = await query("SELECT id FROM users WHERE email = $1", [email]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ success: false, error: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await query(
      "INSERT INTO users (name, email, password, role, department) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [name, email, hashedPassword, "employee", department || null]
    );
    const user = result.rows[0];

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_KEY, { expiresIn: "10d" });

    res.status(201).json({
      success: true,
      token,
      user: {
        _id: user.id,
        name: user.name,
        email: user.email,
        department: user.department,
        role: user.role,
      },
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

const verify = (req, res) => {
  return res.status(200).json({ success: true, user: req.user });
};

export { login, verify, register };