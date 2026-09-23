import { db } from "./src/prisma/db"

async function run() {
  const admins = await db.orm.public.Admin.select('id', 'email', 'password').all()
  console.log(admins)
}

run()
