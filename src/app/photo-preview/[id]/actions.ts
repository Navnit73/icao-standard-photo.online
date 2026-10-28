"use server";

import { getCountry } from "@/config/countries";
import { photos } from "@/lib/server/db";
import { sendPhotoEmail } from "@/lib/server/mailer";

export type SendState = { status: "idle" | "sent" | "error"; message?: string; email?: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MAX_EMAILS_PER_PHOTO = 5;

export async function sendPhoto(id: string, _prev: SendState, formData: FormData): Promise<SendState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!EMAIL_RE.test(email) || email.length > 254) {
    return { status: "error", message: "Please enter a valid email address.", email };
  }

  const collection = await photos();
  const photo = await collection.findOne({ _id: id });
  if (!photo) return { status: "error", message: "This photo has expired. Please create a new one.", email };
  if (photo.emailCount >= MAX_EMAILS_PER_PHOTO) {
    return { status: "error", message: "This photo has already been sent several times. Check your inbox and spam folder.", email };
  }

  try {
    await sendPhotoEmail({
      to: email,
      photoUrl: photo.imageUrl,
      countryName: getCountry(photo.countryCode)?.name ?? photo.countryCode,
      dimensions: photo.dimensions,
    });
  } catch (e) {
    console.error("Sending photo email failed", e);
    return { status: "error", message: "We couldn't send the email. Please try again in a moment.", email };
  }

  await collection.updateOne({ _id: id }, { $inc: { emailCount: 1 }, $push: { emails: { email, sentAt: new Date() } } });
  return { status: "sent", email };
}
