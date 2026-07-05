import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import pkg from "pg";

const { Pool } = pkg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env"), override: true });

let pool;

const connectToDatabase = async () => {
  try {
    const config = {
      host: process.env.PGHOST || "localhost",
      port: process.env.PGPORT ? parseInt(process.env.PGPORT, 10) : 5432,
      user: process.env.PGUSER || "postgres",
      password: process.env.PGPASSWORD || "postgres",
      database: process.env.PGDATABASE || "employee",
    };

    pool = new Pool(config);

    // test connection
    await pool.query("SELECT NOW()");

    // create users table if not exists
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL,
        profile_image TEXT,
        department TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // create departments table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS departments (
        id SERIAL PRIMARY KEY,
        dep_name TEXT NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // create leaves table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS leaves (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        leave_type TEXT,
        reason TEXT,
        department TEXT,
        start_date DATE,
        end_date DATE,
        days INTEGER,
        status TEXT DEFAULT 'Pending',
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    console.log("Connected to PostgreSQL");
  } catch (err) {
    console.error("Postgres connection failed:", err.message || err);
    // if database does not exist, try to create it using the default 'postgres' database
    if (err.code === '3D000') {
      try {
        const adminConfig = {
          host: process.env.PGHOST || "localhost",
          port: process.env.PGPORT ? parseInt(process.env.PGPORT, 10) : 5432,
          user: process.env.PGUSER || "postgres",
          password: process.env.PGPASSWORD || "postgres",
          database: 'postgres',
        };
        const adminPool = new Pool(adminConfig);
        const targetDb = process.env.PGDATABASE || 'employee';
        await adminPool.query(`CREATE DATABASE ${targetDb}`);
        await adminPool.end();
        console.log(`Created database ${targetDb}, retrying connection...`);
        // retry original connection
        pool = new Pool(config);
        await pool.query("SELECT NOW()");
      } catch (createErr) {
        console.error('Failed to create database:', createErr.message || createErr);
        throw createErr;
      }
    } else {
      throw err;
    }
  }
};

const query = (text, params) => {
  if (!pool) throw new Error("Database not initialized. Call connectToDatabase first.");
  return pool.query(text, params);
};

export default connectToDatabase;
export { query };