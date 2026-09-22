"use server";

import { db } from "@/prisma/db";
import { revalidatePath } from "next/cache";
import { avatarColors } from "@/lib/data";
import { render } from '@react-email/render';
import WelcomeEmail from "@/components/emails/WelcomeEmail";

export async function checkEmailExists(email: string) {
  const existing = await db.orm.public.Buyer.where({ email: email.trim().toLowerCase() }).first();
  return !!existing;
}

export async function lookupReferralCode(code: string) {
  if (!code) return null;
  const referrer = await db.orm.public.Referrer.where({ code: code.trim().toUpperCase() }).first();
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