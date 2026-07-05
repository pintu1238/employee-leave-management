import connectToDatabase, { query } from "./db/db.js";
import bcrypt from "bcrypt";

const userRegister = async () => {
  try {
    await connectToDatabase();

    const hashPassword = await bcrypt.hash("admin", 10);
    await query("INSERT INTO users (name, email, password, role) VALUES ($1,$2,$3,$4) ON CONFLICT (email) DO NOTHING", ["Admin", "admin@example.com", hashPassword, "admin"]);
    console.log("Admin user created or already exists.");

    const hashPassword2 = await bcrypt.hash("employee", 10);
    await query("INSERT INTO users (name, email, password, role) VALUES ($1,$2,$3,$4) ON CONFLICT (email) DO NOTHING", ["Employee", "employee@example.com", hashPassword2, "employee"]);
    console.log("Employee user created or already exists.");

    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error);
    process.exit(1);
  }
};

userRegister();