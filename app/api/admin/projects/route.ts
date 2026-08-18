import { eq } from "drizzle-orm";
import { readAdminSession } from "@/lib/admin-auth";
import { getDb } from "@/db";
import { projects } from "@/db/schema";

type ProjectPayload = {
  id?: number;
  slug?: string;
  titleFr?: string;
  titleEn?: string;
  excerptFr?: string;
  excerptEn?: string;
  bodyFr?: string;
  bodyEn?: string;
  coverImageUrl?: string;
  coverAltFr?: string;
  coverAltEn?: string;
  publishedAt?: string;
  isPublished?: boolean;
};

function slugify(value: string): string {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 80);
}

function required(value: string | undefined, label: string): string {
  const clean = value?.trim() ?? "";
  if (!clean) throw new Error(label + " est obligatoire.");
  return clean;
}

export async function POST(request: Request) {
  if (!(await readAdminSession())) return Response.json({ error: "Connexion requise." }, { status: 401 });

  try {
    const payload = (await request.json()) as ProjectPayload;
    const now = new Date().toISOString();
    const values = {
      slug: slugify(payload.slug || payload.titleFr || payload.titleEn || "") || "projet-" + Date.now(),
      titleFr: required(payload.titleFr, "Le titre français"),
      titleEn: required(payload.titleEn, "Le titre anglais"),
      excerptFr: required(payload.excerptFr, "Le résumé français"),
      excerptEn: required(payload.excerptEn, "Le résumé anglais"),
      bodyFr: required(payload.bodyFr, "La description française"),
      bodyEn: required(payload.bodyEn, "La description anglaise"),
      coverImageUrl: required(payload.coverImageUrl, "L’image de couverture"),
      coverAltFr: required(payload.coverAltFr, "La description française de l’image"),
      coverAltEn: required(payload.coverAltEn, "La description anglaise de l’image"),
      publishedAt: payload.publishedAt || now,
      isPublished: payload.isPublished ?? true,
      updatedAt: now,
    };
    const db = getDb();
    let projectId = payload.id;
    if (projectId) {
      await db.update(projects).set(values).where(eq(projects.id, projectId));
    } else {
      const [created] = await db.insert(projects).values({ ...values, createdAt: now }).returning({ id: projects.id });
      projectId = created.id;
    }
    return Response.json({ saved: true, id: projectId, ...values });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Impossible d’enregistrer le projet." }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  if (!(await readAdminSession())) return Response.json({ error: "Connexion requise." }, { status: 401 });
  const id = Number(new URL(request.url).searchParams.get("id"));
  if (!Number.isInteger(id) || id <= 0) return Response.json({ error: "Identifiant invalide." }, { status: 400 });
  await getDb().delete(projects).where(eq(projects.id, id));
  return Response.json({ deleted: true });
}
