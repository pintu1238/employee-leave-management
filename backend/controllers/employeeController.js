import { query } from "../db/db.js";

const getEmployees = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;

    const totalRes = await query("SELECT COUNT(*) FROM users WHERE role = $1", ["employee"]);
    const total = parseInt(totalRes.rows[0].count, 10);

    const offset = (page - 1) * limit;
    const rows = await query(
      `SELECT id as _id, name, email, profile_image as "profileImage", department, created_at as "createdAt" FROM users WHERE role = $1 ORDER BY created_at DESC OFFSET $2 LIMIT $3`,
      ["employee", offset, limit]
    );

    return res.status(200).json({ success: true, total, page, limit, employees: rows.rows });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Failed to fetch employees" });
  }
};

export { getEmployees };
