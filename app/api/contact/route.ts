import { env } from "cloudflare:workers";
import { sendSmtpMessage } from "@/lib/smtp";
import { CONTACT_EMAIL } from "@/lib/site-content";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ContactPayload = {
  locale?: "fr" | "en";
  mission?: string;
  name?: string;
  email?: string;
  organisation?: string;
  message?: string;
  website?: string;
};

function text(value: unknown, maxLength: number): string {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

async function rateLimited(request: Request): Promise<boolean> {
  const storage = env.MEDIA;
  if (!storage) return false;
  const address = request.headers.get("cf-connecting-ip");
  if (!address) return false;
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(address));
  const key = "contact-rate:" + Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
  if (await storage.get(key)) return true;
  await storage.put(key, "1", { expirationTtl: 60 });
  return false;
}

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => null)) as ContactPayload | null;
  const english = payload?.locale === "en";
  const errorMessage = english
    ? "Your message could not be sent. Please try again or email us directly."
    : "Votre message n’a pas pu être envoyé. Réessayez ou écrivez-nous directement.";

  if (!payload) return Response.json({ error: errorMessage }, { status: 400 });
  if (text(payload.website, 200)) return Response.json({ sent: true });

  const mission = text(payload.mission, 180);
  const name = text(payload.name, 120);
  const senderEmail = text(payload.email, 254).toLowerCase();
  const organisation = text(payload.organisation, 180);
  const message = text(payload.message, 6000);

  if (!mission || !name || !EMAIL_PATTERN.test(senderEmail) || !message) {
    return Response.json({ error: errorMessage }, { status: 400 });
  }

  if (await rateLimited(request)) {
    return Response.json(
      { error: english ? "Please wait a minute before sending another message." : "Patientez une minute avant d’envoyer un autre message." },
      { status: 429 },
    );
  }

  const password = env.CONTACT_SMTP_PASSWORD;
  if (typeof password !== "string" || !password) {
    console.error("CONTACT_SMTP_PASSWORD is not configured.");
    return Response.json({ error: errorMessage }, { status: 503 });
  }

  const body = [
    `Name / Nom: ${name}`,
    `Email: ${senderEmail}`,
    `Organisation: ${organisation || "—"}`,
    `Request / Besoin: ${mission}`,
    "",
    "Message:",
    message,
  ].join("\n");

  try {
    await sendSmtpMessage(password, {
      from: CONTACT_EMAIL,
      to: CONTACT_EMAIL,
      replyTo: senderEmail,
      replyName: name,
      subject: `[SEI website] ${mission}`,
      text: body,
    });
    return Response.json({ sent: true });
  } catch (error) {
    console.error("Contact email delivery failed.", error);
    return Response.json({ error: errorMessage }, { status: 502 });
  }
}
