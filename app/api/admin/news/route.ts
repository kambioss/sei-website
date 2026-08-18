import { eq } from "drizzle-orm";
import { readAdminSession } from "@/lib/admin-auth";
import { getDb } from "@/db";
import { newsArticles, newsImages } from "@/db/schema";
import type { NewsGalleryImage } from "@/lib/news";

type NewsPayload = {
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
  gallery?: NewsGalleryImage[];
};

function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

function required(value: string | undefined, label: string): string {
  const clean = value?.trim() ?? "";
  if (!clean) throw new Error(label + " est obligatoire.");
  return clean;
}

export async function POST(request: Request) {
  const session = await readAdminSession();
  if (!session) return Response.json({ error: "Connexion requise." }, { status: 401 });

  try {
    const payload = (await request.json()) as NewsPayload;
    const now = new Date().toISOString();
    const values = {
      slug: slugify(payload.slug || payload.titleFr || payload.titleEn || "") || "actualite-" + Date.now(),
      titleFr: required(payload.titleFr, "Le titre français"),
      titleEn: required(payload.titleEn, "Le titre anglais"),
      excerptFr: required(payload.excerptFr, "Le résumé français"),
      excerptEn: required(payload.excerptEn, "Le résumé anglais"),
      bodyFr: required(payload.bodyFr, "Le contenu français"),
      bodyEn: required(payload.bodyEn, "Le contenu anglais"),
      coverImageUrl: required(payload.coverImageUrl, "L’image de couverture"),
      coverAltFr: required(payload.coverAltFr, "La description française de la couverture"),
      coverAltEn: required(payload.coverAltEn, "La description anglaise de la couverture"),
      publishedAt: payload.publishedAt || now,
      isPublished: payload.isPublished ?? true,
      updatedAt: now,
    };
    const db = getDb();
    let articleId = payload.id;

    if (articleId) {
      await db.update(newsArticles).set(values).where(eq(newsArticles.id, articleId));
      await db.delete(newsImages).where(eq(newsImages.articleId, articleId));
    } else {
      const [created] = await db
        .insert(newsArticles)
        .values({ ...values, createdAt: now })
        .returning({ id: newsArticles.id });
      articleId = created.id;
    }

    const gallery = (payload.gallery ?? []).map((image, index) => ({
      articleId,
      url: required(image.url, "L’image de galerie"),
      altFr: image.altFr?.trim() || values.titleFr,
      altEn: image.altEn?.trim() || values.titleEn,
      position: index,
    }));
    if (gallery.length) await db.insert(newsImages).values(gallery);

    return Response.json({ saved: true, id: articleId, ...values, gallery });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Impossible d’enregistrer l’actualité.";
    return Response.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  if (!(await readAdminSession())) {
    return Response.json({ error: "Connexion requise." }, { status: 401 });
  }
  const id = Number(new URL(request.url).searchParams.get("id"));
  if (!Number.isInteger(id) || id <= 0) {
    return Response.json({ error: "Identifiant invalide." }, { status: 400 });
  }
  const db = getDb();
  await db.delete(newsArticles).where(eq(newsArticles.id, id));
  return Response.json({ deleted: true });
}
