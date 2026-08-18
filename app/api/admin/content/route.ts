import { readAdminSession } from "@/lib/admin-auth";
import { getDb } from "@/db";
import { siteContent } from "@/db/schema";
import { normaliseLocale, parseSiteContent } from "@/lib/site-content";

export async function PUT(request: Request) {
  const session = await readAdminSession();
  if (!session) {
    return Response.json({ error: "Connexion requise." }, { status: 401 });
  }

  try {
    const payload = (await request.json()) as { locale?: string; content?: unknown };
    const locale = normaliseLocale(payload.locale);
    const content = parseSiteContent(payload.content, locale);
    const key = "main:" + locale;
    const now = new Date().toISOString();
    const db = getDb();
    await db
      .insert(siteContent)
      .values({
        key,
        content: JSON.stringify(content),
        updatedAt: now,
        updatedBy: session.username,
      })
      .onConflictDoUpdate({
        target: siteContent.key,
        set: {
          content: JSON.stringify(content),
          updatedAt: now,
          updatedBy: session.username,
        },
      });

    return Response.json({ saved: true, updatedAt: now });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Impossible d’enregistrer le contenu.";
    return Response.json({ error: message }, { status: 400 });
  }
}
