import connectToDatabase, { query } from "./db/db.js";
import bcrypt from "bcrypt";

const departments = [
  "Logistics",
  "Database",
  "IT",
  "HR",
  "Finance",
  "Marketing",
  "Sales",
  "Support",
];

const firstNames = [
  "Aisha","Bilal","Chen","Diego","Elena","Farah","Gopal","Hana","Ibrahim","Jamal",
  "Kiran","Lina","Marta","Naveed","Omar","Priya","Quinn","Rashid","Sara","Tariq",
  "Uma","Vikram","Waleed","Xiao","Yara","Zain"
];

const lastNames = [
  "Ahmed","Khan","Patel","Singh","Gonzalez","Smith","Brown","Davis","Lopez","Müller",
  "Rossi","Silva","Garcia","Martinez","Hernandez","Wilson","Anderson","Thomas","Taylor","Moore"
];

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

const seed = async () => {
  try {
    await connectToDatabase();

    // Ensure at least 200 employees exist; if more, we'll still normalize their fields
    const totalRes = await query("SELECT COUNT(*) FROM users WHERE role = $1", ["employee"]);
    const existingCount = parseInt(totalRes.rows[0].count, 10);
    if (existingCount < 200) {
      for (let i = 1; i <= 200; i++) {
        const email = `employee${i}@example.com`;
        const name = `${pick(firstNames)} ${pick(lastNames)}`;
        const password = await bcrypt.hash("employee", 10);
        const department = pick(departments);
        const imgId = (i % 70) + 1; // pravatar supports many ids
        const profileImage = `https://i.pravatar.cc/150?img=${imgId}`;
        await query(
          "INSERT INTO users (name, email, password, role, department, profile_image) VALUES ($1,$2,$3,$4,$5,$6) ON CONFLICT (email) DO NOTHING",
          [name, email, password, "employee", department, profileImage]
        );
      }
      console.log("Inserted 200 employees");
    }

    // Update existing employees to ensure they have department and profileImage and randomized names
    const employeesRes = await query("SELECT id FROM users WHERE role = $1", ["employee"]);
    const employees = employeesRes.rows;
    for (let i = 0; i < employees.length; i++) {
      const emp = employees[i];
      const name = `${pick(firstNames)} ${pick(lastNames)}`;
      const department = pick(departments);
      const imgId = (i % 70) + 1;
      const profileImage = `https://i.pravatar.cc/150?img=${imgId}`;
      await query("UPDATE users SET name=$1, department=$2, profile_image=$3 WHERE id=$4", [name, department, profileImage, emp.id]);
    }

    console.log("Employees normalized with names, departments and profile images.");

    await query(`
      INSERT INTO departments (dep_name)
      SELECT DISTINCT department
      FROM users
      WHERE department IS NOT NULL AND department <> ''
        AND NOT EXISTS (
          SELECT 1 FROM departments d WHERE d.dep_name = users.department
        )
    `);

    console.log("Departments table synced from employee departments.");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();
