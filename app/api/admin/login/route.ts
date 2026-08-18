import { cookies } from "next/headers";
import {
  ADMIN_COOKIE_NAME,
  adminSessionMaxAge,
  createAdminSession,
  verifyAdminCredentials,
} from "@/lib/admin-auth";

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as { username?: string; password?: string };
    const username = payload.username?.trim() ?? "";
    const password = payload.password ?? "";

    if (!(await verifyAdminCredentials(username, password))) {
      return Response.json(
        { error: "Identifiant ou mot de passe incorrect." },
        { status: 401 },
      );
    }

    const cookieStore = await cookies();
    cookieStore.set(ADMIN_COOKIE_NAME, await createAdminSession(username), {
      httpOnly: true,
      sameSite: "strict",
      secure: new URL(request.url).protocol === "https:",
      path: "/",
      maxAge: adminSessionMaxAge,
    });
    return Response.json({ authenticated: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Connexion impossible.";
    return Response.json({ error: message }, { status: 500 });
  }
}
