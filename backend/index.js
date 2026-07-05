import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectToDatabase from "./db/db.js";
import authRouter from "./routes/auth.js";
import departmentRouter from "./routes/department.js"
import employeeRouter from "./routes/employee.js";
import leaveRouter from "./routes/leave.js";
import authMiddleware from "./middleware/authMiddleware.js";
import { query } from "./db/db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, ".env"), override: true });

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/department", departmentRouter);
app.use("/api/employee", employeeRouter);
app.use("/api/leave", leaveRouter);

app.get('/_debug', (req, res) => res.status(200).send('debug-ok'));

// Inline fallback employee list (paginated) in case router isn't picked up
app.get('/api/employee-fallback', authMiddleware, async (req, res) => {
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
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: 'fallback failed' });
  }
});




await connectToDatabase();

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});