import pg from 'pg';
const { Pool } = pg;
import dotenv from 'dotenv';
dotenv.config();

const URI = process.env.SUPABASE_URL;

const pool = new Pool({
  connectionString: URI,
});

const checkDatabaseConnection = async () => {
  try {
    await pool.query('SELECT NOW()');
    console.log('Connected to the PostgreSQL database.');
  } catch (err) {
    console.error('Failed to connect to the PostgreSQL database:', err);
  }
};

export { checkDatabaseConnection, pool };
