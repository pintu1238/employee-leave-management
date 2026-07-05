import connectToDatabase, { query } from "./db/db.js";

const seed = async () => {
  try {
    await connectToDatabase();

    // pick some employee ids
    const res = await query("SELECT id FROM users WHERE role = $1 LIMIT 10", ["employee"]);
    const ids = res.rows.map(r => r.id);
    if (ids.length === 0) {
      console.log('No employees found to seed leaves');
      process.exit(0);
    }

    const leaveTypes = ['Sick Leave','Casual Leave','Annual Leave'];
    const statuses = ['Pending','Approved','Rejected'];
    for (let i = 0; i < 8; i++) {
      const user_id = ids[i % ids.length];
      const leave_type = leaveTypes[i % leaveTypes.length];
      const reason = `${leave_type.toLowerCase()} reason`;
      const days = (i % 5) + 1;
      const status = statuses[i % statuses.length];
      const start = new Date();
      const end = new Date();
      end.setDate(start.getDate() + days);
      await query("INSERT INTO leaves (user_id, leave_type, reason, department, start_date, end_date, days, status) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)", [user_id, leave_type, reason, null, start.toISOString().slice(0,10), end.toISOString().slice(0,10), days, status]);
    }

    console.log('Seeded leaves');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
