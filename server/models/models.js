import pg from "pg";
const { Pool } = pg;
import dotenv from "dotenv";
dotenv.config();
// TODO ^ this is bad don't do it- figure out a diff way to fix this

const URI = process.env.SUPABASE_URL;
// const URI = 'postgresql://postgres.iqkixujjfkgdgfuwgwvy:codesmith@aws-0-us-east-1.pooler.supabase.com:6543/postgres'
// console.log(URI)

const pool = new Pool({
  connectionString: URI,
});

const checkDatabaseConnection = async () => {
  try {
    await pool.query("SELECT NOW()");
    console.log("Connected to the PostgreSQL database.");
  } catch (err) {
    console.error("Failed to connect to the PostgreSQL database:", err);
  }
};

export { checkDatabaseConnection, pool };