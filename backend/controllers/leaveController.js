import { query } from "../db/db.js";

const getLeaves = async (req, res) => {
  try {
    const status = req.query.status;
    const search = req.query.search;
    const user = req.user;
    let sql = `SELECT l.id, l.user_id, l.leave_type, l.reason, l.department, l.start_date, l.end_date, l.days, l.status, l.created_at, u.name as user_name, u.email FROM leaves l LEFT JOIN users u ON u.id = l.user_id`;
    const params = [];
    const filters = [];

    if (user.role !== 'admin') {
      filters.push(`l.user_id = $${params.length + 1}`);
      params.push(user.id);
    }

    if (status) {
      filters.push(`l.status = $${params.length + 1}`);
      params.push(status);
    }
    if (search) {
      filters.push(`(CAST(l.user_id AS TEXT) ILIKE $${params.length + 1} OR u.name ILIKE $${params.length + 1} OR l.leave_type ILIKE $${params.length + 1})`);
      params.push(`%${search}%`);
    }

    if (filters.length) {
      sql += ` WHERE ${filters.join(' AND ')}`;
    }

    sql += ` ORDER BY l.created_at DESC`;
    const rows = await query(sql, params);
    return res.status(200).json({ success: true, leaves: rows.rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: 'Failed to fetch leaves' });
  }
};

const getLeaveSummary = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Access denied' });
    }

    const totalEmployeesRes = await query("SELECT COUNT(*) FROM users WHERE role = $1", ["employee"]);
    const totalDepartmentsRes = await query("SELECT COUNT(*) FROM departments");
    const totalLeavesRes = await query("SELECT COUNT(*) FROM leaves");
    const approvedLeavesRes = await query("SELECT COUNT(*) FROM leaves WHERE status = 'Approved'");
    const pendingLeavesRes = await query("SELECT COUNT(*) FROM leaves WHERE status = 'Pending'");
    const rejectedLeavesRes = await query("SELECT COUNT(*) FROM leaves WHERE status = 'Rejected'");

    return res.status(200).json({
      success: true,
      summary: {
        totalEmployees: parseInt(totalEmployeesRes.rows[0].count, 10),
        totalDepartments: parseInt(totalDepartmentsRes.rows[0].count, 10),
        totalLeaves: parseInt(totalLeavesRes.rows[0].count, 10),
        approvedLeaves: parseInt(approvedLeavesRes.rows[0].count, 10),
        pendingLeaves: parseInt(pendingLeavesRes.rows[0].count, 10),
        rejectedLeaves: parseInt(rejectedLeavesRes.rows[0].count, 10),
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: 'Failed to fetch leave summary' });
  }
};

const getLeaveById = async (req, res) => {
  try {
    const id = req.params.id;
    const rows = await query("SELECT l.*, u.name as user_name, u.email, u.profile_image as \"profileImage\" FROM leaves l LEFT JOIN users u ON u.id = l.user_id WHERE l.id = $1", [id]);
    const leave = rows.rows[0];
    if (!leave) return res.status(404).json({ success: false, error: 'Leave not found' });

    if (req.user.role !== 'admin' && leave.user_id !== req.user.id) {
      return res.status(403).json({ success: false, error: 'Access denied' });
    }

    return res.status(200).json({ success: true, leave });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: 'Failed to fetch leave' });
  }
};

const createLeave = async (req, res) => {
  try {
    const { leave_type, reason, start_date, end_date } = req.body;
    const user = req.user;

    if (!leave_type || !start_date || !end_date) {
      return res.status(400).json({ success: false, error: 'Leave type, start date and end date are required' });
    }

    const start = new Date(start_date);
    const end = new Date(end_date);
    if (isNaN(start) || isNaN(end) || end < start) {
      return res.status(400).json({ success: false, error: 'Invalid date range' });
    }

    const dayCount = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    const result = await query(
      `INSERT INTO leaves (user_id, leave_type, reason, department, start_date, end_date, days, status) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [user.id, leave_type, reason || '', user.department || null, start_date, end_date, dayCount, 'Pending']
    );

    return res.status(201).json({ success: true, leave: result.rows[0] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: 'Failed to create leave' });
  }
};

const updateLeaveStatus = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Access denied' });
    }

    const { id } = req.params;
    const { status } = req.body;
    const allowed = ['Pending', 'Approved', 'Rejected'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid leave status' });
    }
    const result = await query("UPDATE leaves SET status = $1 WHERE id = $2 RETURNING *", [status, id]);
    if (!result.rows[0]) return res.status(404).json({ success: false, error: 'Leave not found' });
    return res.status(200).json({ success: true, leave: result.rows[0] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: 'Failed to update leave status' });
  }
};

export { getLeaves, getLeaveSummary, getLeaveById, createLeave, updateLeaveStatus };
