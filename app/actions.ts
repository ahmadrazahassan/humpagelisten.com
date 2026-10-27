"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { emailContactMessage, rateLimited, sendConfirmation } from "@/lib/mail";
import { site } from "@/lib/site";

type FormState = { ok: boolean; message: string; values?: Record<string, string>; at?: number } | null;

function fail(message: string, data: FormData): FormState {
  const values: Record<string, string> = {};
  for (const k of ["name", "email", "topic", "message"]) {
    const v = data.get(k);
    if (typeof v === "string") values[k] = v;
  }
  return { ok: false, message, values, at: Date.now() };
}

async function origin() {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  if (!host) return site.url;
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

async function clientIp() {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
}

const subscribeSchema = z.object({ email: z.email(), consent: z.literal("on") });

export async function subscribe(_prev: FormState, data: FormData): Promise<FormState> {
  const done = { ok: true, message: "Thank you. Check your inbox and tap the link to confirm your subscription." };
  if (data.get("company")) return done;
  const parsed = subscribeSchema.safeParse({ email: data.get("email"), consent: data.get("consent") });
  if (!parsed.success) return fail("Please enter a valid email and tick the consent box.", data);

  const ip = await clientIp();
  if (rateLimited(`nl:${ip}`, 5, 60 * 60 * 1000)) return fail("Too many attempts. Please try again in an hour.", data);

  try {
    await sendConfirmation(parsed.data.email, await origin());
    return done;
  } catch (e) {
    console.error("[newsletter]", e);
    return fail("Something went wrong on our side. Please try again later.", data);
  }
}

const contactSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.email(),
  topic: z.enum(["question", "correction", "partnership", "privacy_request"]),
  message: z.string().trim().min(10).max(5000),
  consent: z.literal("on"),
});

export async function sendContact(_prev: FormState, data: FormData): Promise<FormState> {
  const done = { ok: true, message: "Thanks, your message is on its way. I reply within three working days." };
  if (data.get("company")) return done;
  const parsed = contactSchema.safeParse(Object.fromEntries(data));
  if (!parsed.success) return fail("Please fill in every field (message at least 10 characters) and tick the consent box.", data);

  const ip = await clientIp();
  if (rateLimited(`contact:${ip}`, 3, 60 * 60 * 1000)) return fail("Too many messages. Please try again in an hour.", data);

  try {
    await emailContactMessage({ ...parsed.data, ip });
    return done;
  } catch (e) {
    console.error("[contact]", e);
    return fail(`Your message could not be sent. Please email ${site.email} directly.`, data);
  }
}
