"use server";

import { db } from "@/prisma/db";
import { revalidatePath } from "next/cache";
import { avatarColors } from "@/lib/data";
import { render } from '@react-email/render';
import WelcomeEmail from "@/components/emails/WelcomeEmail";
import ReferrerEmail from "@/components/emails/ReferrerEmail";
import bcrypt from "bcryptjs"
import { cookies } from "next/headers";

async function requireAdmin() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("admin_session")?.value;
  if (!sessionId) throw new Error("Unauthorized");
  const session = await db.orm.public.Session.where({ id: sessionId }).include("admin").first();
  if (!session || (session.expiresAt as any).epochMilliseconds < Date.now()) throw new Error("Unauthorized");
  return session.admin;
}


export async function checkEmailExists(email: string) {
  const existing = await db.orm.public.Buyer.where({ email: email.trim().toLowerCase() }).first();
  return !!existing;
}

export async function lookupReferralCode(code: string) {
  if (!code) return null;
  const normalized = code.trim().toUpperCase();
  
  let referrer = await db.orm.public.Referrer.where({ code: normalized }).first();
  
  if (!referrer && !normalized.startsWith("RF3-")) {
    referrer = await db.orm.public.Referrer.where({ code: `RF3-${normalized}` }).first();
  }
  
  if (!referrer && normalized.startsWith("RF3-")) {
    referrer = await db.orm.public.Referrer.where({ code: normalized.replace("RF3-", "") }).first();
  }

  return referrer ? { name: referrer.name, code: referrer.code } : null;
}

export async function createReferrer(name: string, email: string, phone: string) {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  
  // Guarantee unique code
  while (true) {
    const random = crypto.getRandomValues(new Uint8Array(4));
    code = "RF3-" + Array.from(random).map(n => alphabet[n % alphabet.length]).join("");
    const existing = await db.orm.public.Referrer.where({ code }).first();
    if (!existing) {
      break;
    }
  }

  const referrer = await db.orm.public.Referrer.create({
    name: name.trim(),
    email: email.trim().toLowerCase(),
    phone: phone.trim(),
    code,
  });

  revalidatePath("/admin/dashboard");

  // Send welcome email asynchronously so it doesn't block
  const emailHtml = await render(<ReferrerEmail name={referrer.name} code={referrer.code} />);
    
    fetch("https://hook.eu1.make.com/i5gacsofvt3c83piv8u7uqokhtrfhli1", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: referrer.email,
        subject: "Welcome to the Reality Flex 3.0 Referral Program!",
        htmlContent: emailHtml,
      })
    }).catch(console.error);

  return referrer;
}

export async function registerBuyer(name: string, email: string, phone: string, referredBy: string | null) {
  const color = avatarColors[Math.floor(Math.random() * avatarColors.length)];

  const buyer = await db.orm.public.Buyer.create({
    name: name.trim(),
    email: email.trim().toLowerCase(),
    phone: phone.trim(),
    referredBy,
    status: "registered",
    color,
  });

  const brochureLink = "https://your-hosted-link.com/actual-brochure.pdf"; // Replace with your real PDF URL

  const emailHtml = await render(
    <WelcomeEmail name={buyer.name} brochureLink={brochureLink} />
  );

  try {
    // POST to Make.com Webhook
    await fetch('https://hook.eu1.make.com/i5gacsofvt3c83piv8u7uqokhtrfhli1', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: buyer.email,
        subject: 'Welcome to De Reality Spec Ltd.',
        htmlContent: emailHtml,
      }),
    });
  } catch (err) {
    console.error("Failed to send welcome email via Make.com:", err);
  }
  
  revalidatePath("/admin/dashboard");
  return buyer;
}

export async function verifyBuyer(id: string, verified: boolean) {
  await requireAdmin();
  const updated = await db.orm.public.Buyer.where({ id }).update({
    status: verified ? "verified" : "pending"
  });

  const buyer = Array.isArray(updated) ? updated[0] : updated;
  if (!buyer) return;

  await db.orm.public.Activity.create({
    type: verified ? "verification" : "update",
    name: buyer.name,
    detail: verified ? "Payment has been verified" : "Payment verification was removed",
  });

  revalidatePath("/admin/dashboard");
}

export async function updateAdminSettings(adminId: string, formData: FormData) {
  const currentAdmin = await requireAdmin();
  if (currentAdmin.id !== adminId) throw new Error("Unauthorized");
  if (!adminId) return;
  
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const newPassword = formData.get("newPassword") as string;

  const updateData: { name?: string; email?: string; password?: string } = {};
  if (name) updateData.name = name;
  if (email) updateData.email = email;

  if (newPassword && newPassword.trim().length > 0) {
    updateData.password = await bcrypt.hash(newPassword, 10);
  }

  await db.orm.public.Admin.where({ id: adminId }).update(updateData);

  await db.orm.public.Activity.create({
    type: "update",
    name: name || "Admin",
    detail: "Admin profile settings were updated",
  });

  revalidatePath("/admin/settings");
}





