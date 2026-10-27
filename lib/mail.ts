import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

// No database. Resend does everything: it emails contact messages to the owner, sends the
// newsletter confirmation email, and stores confirmed subscribers as Resend contacts.

const TOPICS: Record<string, string> = {
  question: "Question",
  correction: "Correction",
  partnership: "Partnership",
  privacy_request: "Privacy request",
};

const FROM = () => process.env.EMAIL_FROM ?? "HumPage Listen <onboarding@resend.dev>";

async function resend(path: string, body: object) {
  return fetch(`https://api.resend.com${path}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

async function sendEmail(email: { to: string; subject: string; text: string; html?: string; replyTo?: string }) {
  const res = await resend("/emails", {
    from: FROM(),
    to: [email.to],
    subject: email.subject,
    text: email.text,
    ...(email.html ? { html: email.html } : {}),
    ...(email.replyTo ? { reply_to: email.replyTo } : {}),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
}

export async function emailContactMessage(m: { name: string; email: string; topic: string; message: string; ip: string }) {
  const to = process.env.CONTACT_TO_EMAIL;
  if (!process.env.RESEND_API_KEY || !to) throw new Error("RESEND_API_KEY or CONTACT_TO_EMAIL is missing");
  await sendEmail({
    to,
    replyTo: m.email,
    subject: `[HumPage Listen] ${TOPICS[m.topic] ?? "Message"} from ${m.name}`,
    text: `${m.message}\n\n---\nName: ${m.name}\nEmail: ${m.email}\nTopic: ${TOPICS[m.topic]}\nSent: ${new Date().toISOString()}\nIP: ${m.ip}`,
  });
}

// Double opt in without storage: the confirm link carries the email, an expiry and an HMAC signature.

const CONFIRM_DAYS = 3;

function secret() {
  const s = process.env.NEWSLETTER_SECRET ?? process.env.RESEND_API_KEY;
  if (!s) throw new Error("RESEND_API_KEY is missing");
  return s;
}

function sign(email: string, exp: number) {
  return createHmac("sha256", secret()).update(`${email.toLowerCase()}|${exp}`).digest("base64url");
}

export async function sendConfirmation(email: string, origin: string) {
  if (!process.env.RESEND_API_KEY) throw new Error("RESEND_API_KEY is missing");
  const exp = Date.now() + CONFIRM_DAYS * 24 * 60 * 60 * 1000;
  const params = new URLSearchParams({ e: Buffer.from(email).toString("base64url"), x: String(exp), t: sign(email, exp) });
  const link = `${origin}/newsletter/confirm?${params}`;
  await sendEmail({
    to: email,
    subject: "Confirm your HumPage Listen subscription",
    text: `Hi,\n\nTap the link below to confirm you want the monthly HumPage Listen newsletter:\n${link}\n\nIf you did not ask for this, ignore this email and you will not hear from us again. The link works for ${CONFIRM_DAYS} days.\n\nHumPage Listen`,
    html: `<div style="font-family:Inter,Arial,sans-serif;background:#f1f1f1;padding:32px"><div style="max-width:480px;margin:0 auto;background:#fff;border-radius:24px;padding:32px;color:#141414"><p style="font-size:20px;margin:0 0 12px">One tap to confirm</p><p style="color:#5c5c5c;line-height:1.6;margin:0 0 24px">Confirm you want the monthly HumPage Listen newsletter: new reviews, price changes and the deals worth a credit.</p><a href="${link}" style="display:inline-block;background:#14E25B;color:#0B3D1C;text-decoration:none;padding:12px 22px;border-radius:999px;font-weight:600">Confirm my subscription</a><p style="color:#5c5c5c;font-size:13px;line-height:1.6;margin:24px 0 0">If you did not ask for this, ignore this email and you will not hear from us again. The link works for ${CONFIRM_DAYS} days.</p></div></div>`,
  });
}

export function verifyConfirmation(e: string, x: string, t: string): string | null {
  try {
    const email = Buffer.from(e, "base64url").toString("utf8");
    const exp = Number(x);
    if (!email.includes("@") || !Number.isFinite(exp) || exp < Date.now()) return null;
    const expected = Buffer.from(sign(email, exp));
    const given = Buffer.from(t);
    if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;
    return email;
  } catch {
    return null;
  }
}

export async function addContact(email: string) {
  const segment = process.env.RESEND_SEGMENT_ID;
  const res = await resend("/contacts", {
    email,
    unsubscribed: false,
    ...(segment ? { segments: [{ id: segment }] } : {}),
  });
  if (res.ok) return;
  const body = await res.text();
  // Someone confirming twice is fine.
  if (res.status === 409 || /already exists/i.test(body)) return;
  throw new Error(`Resend contacts ${res.status}: ${body}`);
}

// Small in memory limiter against form spam. Resets when the server restarts, which is fine without a database.
const hits = new Map<string, number[]>();

export function rateLimited(key: string, max: number, windowMs: number) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > max;
}
