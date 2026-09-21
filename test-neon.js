import { Pool } from '@neondatabase/serverless';
import 'dotenv/config';

async function run() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  try {
    const result = await pool.query('SELECT 1 as "num"');
    console.log("Success:", result.rows[0]);
  } catch (err) {
    console.error("Failed:", err.message);
  } finally {
    await pool.end();
  }
}
run().catch(console.error);
