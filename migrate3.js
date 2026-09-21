import { Pool } from "@neondatabase/serverless";
import "dotenv/config";

async function migrate() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  
  const sql = `
  DROP TABLE IF EXISTS "public"."Lead" CASCADE;
  DROP TABLE IF EXISTS "public"."Activity" CASCADE;
  DROP TABLE IF EXISTS "public"."lead" CASCADE;
  DROP TABLE IF EXISTS "public"."activity" CASCADE;

  CREATE TABLE "public"."lead" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "referredBy" TEXT,
    "status" TEXT NOT NULL DEFAULT 'registered',
    "color" TEXT NOT NULL,
    "date" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "lead_pkey" PRIMARY KEY ("id")
  );
  
  CREATE UNIQUE INDEX "lead_email_key" ON "public"."lead"("email");
  CREATE UNIQUE INDEX "lead_code_key" ON "public"."lead"("code");

  CREATE TABLE "public"."activity" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "detail" TEXT NOT NULL,
    "time" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "activity_pkey" PRIMARY KEY ("id")
  );
  `;
  
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
