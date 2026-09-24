"use server";

import { db } from "@/prisma/db";
import { revalidatePath } from "next/cache";
import { avatarColors } from "@/lib/data";
import { render } from '@react-email/render';
import { Resend } from 'resend';
import WelcomeEmail from "@/components/emails/WelcomeEmail";
import bcrypt from "bcryptjs"

const resend = new Resend(process.env.RESEND_API_KEY);

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

  // Send welcome email asynchronously so it doesn't block
  resend.emails.send({
    from: "Reality Flex 3.0 <hello@derealityspec.com>",
    to: referrer.email,
    subject: "Welcome to the Reality Flex 3.0 Referral Program!",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a1a;">
        <h2 style="color: #0b1a30;">Welcome, ${referrer.name.split(' ')[0]}!</h2>
        <p>You are now an official advocate for <strong>Reality Flex 3.0</strong>.</p>
        <p>Help others start their land ownership journey and get rewarded for every successful subscription.</p>
        
        <div style="background: #f4f7fb; padding: 20px; border-radius: 8px; margin: 24px 0; text-align: center;">
          <p style="margin: 0; font-size: 14px; color: #666; text-transform: uppercase;">Your Personal Referral Link</p>
          <p style="margin: 8px 0 0 0; font-size: 18px; font-weight: bold; color: #0b1a30;">
            https://realityflex.vercel.app/?ref=${referrer.code}
          </p>
        </div>

        <p><strong>Your Rewards:</strong></p>
        <ul>
          <li><strong>1 Referral:</strong> ₦20,000 Cash Reward</li>
          <li><strong>3 Referrals:</strong> ₦70,000 Cash Reward + ₦20,000 Shopping Experience</li>
          <li><strong>5 Referrals:</strong> ₦125,000 Cash Reward + ₦40,000 Shopping Experience</li>
        </ul>

        <p>Thank you for partnering with us.</p>
        <p>Best regards,<br/>De Reality Spec Ltd.</p>
      </div>
    `
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