import { query } from "../db/db.js";

const addDepartment = async (req, res) => {
  try {
    const { dep_name, description } = req.body;
    const result = await query("INSERT INTO departments (dep_name, description) VALUES ($1, $2) RETURNING *", [dep_name, description]);
    return res.status(201).json({ success: true, department: result.rows[0] });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "add department server error" });
  }
};

const getDepartments = async (req, res) => {
  try {
    const search = req.query.search || "";
    let sql = `SELECT * FROM departments`;
    const params = [];
    if (search) {
      params.push(`%${search}%`);
      sql += ` WHERE dep_name ILIKE $1 OR description ILIKE $1`;
    }
    sql += ` ORDER BY created_at DESC`;

    let result = await query(sql, params);

    if (result.rows.length === 0) {
      const userDeps = await query(
        `SELECT DISTINCT department FROM users WHERE department IS NOT NULL AND department <> ''`
      );
      const departmentNames = userDeps.rows.map((row) => row.department).filter(Boolean);

      if (departmentNames.length > 0) {
        await query(
          `INSERT INTO departments (dep_name)
           SELECT DISTINCT department
           FROM users
           WHERE department IS NOT NULL AND department <> ''
             AND NOT EXISTS (
               SELECT 1 FROM departments d WHERE d.dep_name = users.department
             )`
        );
        result = await query(sql, params);
      }
    }

    return res.status(200).json({ success: true, departments: result.rows });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "fetch departments server error" });
  }
};

const updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const { dep_name, description } = req.body;
    const result = await query(
      "UPDATE departments SET dep_name = $1, description = $2 WHERE id = $3 RETURNING *",
      [dep_name, description, id]
    );
    if (!result.rows[0]) return res.status(404).json({ success: false, error: "Department not found" });
    return res.status(200).json({ success: true, department: result.rows[0] });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "update department server error" });
  }
};

const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    await query("DELETE FROM departments WHERE id = $1", [id]);
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "delete department server error" });
  }
};

export { addDepartment, getDepartments, updateDepartment, deleteDepartment };