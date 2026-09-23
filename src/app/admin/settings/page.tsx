import { db } from "@/prisma/db";
import SettingsClient from "./SettingsClient";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("admin_session")?.value;

  if (!sessionId) redirect("/admin/login");

  const session = await db.orm.public.Session.where({ id: sessionId }).first();
  if (!session || (session.expiresAt as any).epochMilliseconds < Date.now()) redirect("/admin/login");

  const admin = await db.orm.public.Admin.where({ id: session.adminId }).first();
  if (!admin) redirect("/admin/login");

  const allActivities = await db.orm.public.Activity.where({});
  const activities = (Array.isArray(allActivities) ? allActivities : [])
    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    .slice(0, 5);

  return <SettingsClient admin={admin} activities={activities} />;
}