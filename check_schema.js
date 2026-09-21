import { Pool } from "@neondatabase/serverless";
import "dotenv/config";
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
pool.query(`SELECT table_name FROM information_schema.tables WHERE table_schema='public';`)
  .then(res => { console.log(res.rows); pool.end(); })
  .catch(console.error);
