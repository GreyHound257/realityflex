"use server";

import { db } from "@/prisma/db"
import { hashPassword, verifyPassword } from "@/lib/auth"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export async function checkNeedsSetup() {
  const count = await db.orm.public.Admin.aggregate(a => ({ total: a.count() }))
  return count.total === 0
}

export async function setupAdmin(formData: FormData) {
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const isSetup = await checkNeedsSetup()
  if (!isSetup) {
    return { error: "Admin already exists." }
  }

  const hashedPassword = await hashPassword(password)
  const admin = await db.orm.public.Admin.create({
    name: name.trim(),
    email: email.trim().toLowerCase(),
    password: hashedPassword
  })

  await createSession(admin.id)
  redirect('/admin/dashboard')
}

export async function login(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const admin = await db.orm.public.Admin.where({ email: email.trim().toLowerCase() }).first()
  if (!admin) {
    return { error: "Invalid email or password." }
  }

  const isValid = await verifyPassword(password, admin.password)
  if (!isValid) {
    return { error: "Invalid email or password." }
  }

  await createSession(admin.id)
  redirect('/admin/dashboard')
}

export async function logout() {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get('admin_session')?.value
  if (sessionId) {
    await db.orm.public.Session.where({ id: sessionId }).delete()
    cookieStore.delete('admin_session')
  }
  redirect('/admin/login')
}

async function createSession(adminId: string) {
  // Session expires in 7 days
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  
  const session = await db.orm.public.Session.create({
    adminId,
    expiresAt: expiresAt.toISOString(),
  })

  const cookieStore = await cookies()
  cookieStore.set('admin_session', session.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: expiresAt
  })
}
