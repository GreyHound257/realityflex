import { Pool } from '@neondatabase/serverless';
import 'dotenv/config';

async function migrate() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  
  const sql = "" +
  "CREATE TABLE IF NOT EXISTS \"public\".\"Lead\" (" +
    "\"id\" TEXT NOT NULL," +
    "\"name\" TEXT NOT NULL," +
    "\"email\" TEXT NOT NULL," +
    "\"code\" TEXT NOT NULL," +
    "\"referredBy\" TEXT," +
    "\"status\" TEXT NOT NULL DEFAULT 'registered'," +
    "\"color\" TEXT NOT NULL," +
    "\"date\" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP," +
    "CONSTRAINT \"Lead_pkey\" PRIMARY KEY (\"id\")" +
  ");" +
  "CREATE UNIQUE INDEX IF NOT EXISTS \"Lead_email_key\" ON \"public\".\"Lead\"(\"email\");" +
  "CREATE UNIQUE INDEX IF NOT EXISTS \"Lead_code_key\" ON \"public\".\"Lead\"(\"code\");" +
  "CREATE TABLE IF NOT EXISTS \"public\".\"Activity\" (" +
    "\"id\" TEXT NOT NULL," +
    "\"type\" TEXT NOT NULL," +
    "\"name\" TEXT NOT NULL," +
    "\"detail\" TEXT NOT NULL," +
    "\"time\" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP," +
    "CONSTRAINT \"Activity_pkey\" PRIMARY KEY (\"id\")" +
  ");";
  
  try {
    console.log("Running migration over WebSockets...");
    await pool.query(sql);
    console.log("Migration successful!");
  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    await pool.end();
  }
}

migrate().catch(console.error);
