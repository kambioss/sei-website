import { env } from "cloudflare:workers";
import { cookies } from "next/headers";

export const ADMIN_COOKIE_NAME = "sei_admin_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 8;

type SessionPayload = {
  username: string;
  expiresAt: number;
};

function setting(name: string): string {
  const cloudflareValue = env[name];
  if (typeof cloudflareValue === "string" && cloudflareValue) return cloudflareValue;
  if (typeof process !== "undefined") return process.env[name] ?? "";
  return "";
}

async function digest(value: string): Promise<Uint8Array> {
  const bytes = new TextEncoder().encode(value);
  return new Uint8Array(await crypto.subtle.digest("SHA-256", bytes));
}

async function sameSecret(left: string, right: string): Promise<boolean> {
  const [leftDigest, rightDigest] = await Promise.all([digest(left), digest(right)]);
  let difference = 0;
  for (let index = 0; index < leftDigest.length; index += 1) {
    difference |= leftDigest[index] ^ rightDigest[index];
  }
  return difference === 0;
}

function encode(value: string): string {
  return btoa(value)
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replace(/=+$/, "");
}

function decode(value: string): string {
  const base64 = value.replaceAll("-", "+").replaceAll("_", "/");
  return atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, "="));
}

async function sign(payload: string): Promise<string> {
  const secret = setting("SITE_ADMIN_SESSION_SECRET");
  if (!secret) throw new Error("SITE_ADMIN_SESSION_SECRET n’est pas configuré.");
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  return encode(String.fromCharCode(...new Uint8Array(signature)));
}

export async function verifyAdminCredentials(
  username: string,
  password: string,
): Promise<boolean> {
  const expectedUsername = setting("SITE_ADMIN_USERNAME");
  const expectedPassword = setting("SITE_ADMIN_PASSWORD");
  if (!expectedUsername || !expectedPassword) return false;

  const [usernameMatches, passwordMatches] = await Promise.all([
    sameSecret(username, expectedUsername),
    sameSecret(password, expectedPassword),
  ]);
  return usernameMatches && passwordMatches;
}

export async function createAdminSession(username: string): Promise<string> {
  const payload: SessionPayload = {
    username,
    expiresAt: Date.now() + SESSION_DURATION_SECONDS * 1000,
  };
  const encodedPayload = encode(JSON.stringify(payload));
  return encodedPayload + "." + (await sign(encodedPayload));
}

export async function readAdminSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const [payload, signature] = token.split(".");
    if (!payload || !signature || !(await sameSecret(signature, await sign(payload)))) return null;
    const session = JSON.parse(decode(payload)) as SessionPayload;
    if (!session.username || session.expiresAt <= Date.now()) return null;
    return session;
  } catch {
    return null;
  }
}

export const adminSessionMaxAge = SESSION_DURATION_SECONDS;
