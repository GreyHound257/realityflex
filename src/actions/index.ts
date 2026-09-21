"use server";

import { db } from "@/prisma/db";
import { revalidatePath } from "next/cache";
import { avatarColors } from "@/lib/data";
import { Resend } from "resend";
import WelcomeEmail from "@/components/emails/WelcomeEmail";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function checkEmailExists(email: string) {
  const existing = await db.orm.public.Lead.where({ email: email.trim().toLowerCase() }).first();
  return !!existing;
}

export async function lookupReferralCode(code: string) {
  if (!code) return null;
  const lead = await db.orm.public.Lead.where({ code: code.trim().toUpperCase() }).first();
  return lead ? { name: lead.name, code: lead.code } : null;
}

export async function registerLead(name: string, email: string, referredBy: string | null) {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  
  // Need to ensure unique code
  while (true) {
    const random = crypto.getRandomValues(new Uint8Array(4));
    code = "RF3-" + Array.from(random).map(n => alphabet[n % alphabet.length]).join("");
    const existing = await db.orm.public.Lead.where({ code }).first();
    if (!existing) {
      break;
    }
  }

  const color = avatarColors[Math.floor(Math.random() * avatarColors.length)];

  const lead = await db.orm.public.Lead.create({
    name: name.trim(),
    email: email.trim().toLowerCase(),
    code,
    referredBy,
    status: "registered",
    color,
  });

  const confirmLink = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/confirm?code=${code}`
  
  try {
    await resend.emails.send({
      from: 'De Reality Spec <onboarding@resend.dev>', // Replace with verified domain when ready
      to: [lead.email],
      subject: 'Welcome to De Reality Spec',
      react: WelcomeEmail({ name: lead.name, code: lead.code, confirmLink }),
    });
  } catch (err) {
    console.error("Failed to send welcome email:", err);
  }
  
  revalidatePath("/admin/dashboard");
  return lead;
}

export async function verifyLead(id: string, verified: boolean) {
  const updated = await db.orm.public.Lead.where({ id }).update({
    status: verified ? "verified" : "pending"
  });

  const lead = Array.isArray(updated) ? updated[0] : updated;
  if (!lead) return;

  await db.orm.public.Activity.create({
    type: verified ? "verification" : "update",
    name: lead.name,
    detail: verified ? "Payment has been verified" : "Payment verification was removed",
  });

  revalidatePath("/admin/dashboard");
}
