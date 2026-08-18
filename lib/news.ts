import { desc, eq, inArray } from "drizzle-orm";
import { getDb } from "@/db";
import { newsArticles, newsImages } from "@/db/schema";
import type { Locale } from "@/lib/site-content";

export type NewsGalleryImage = {
  id?: number;
  url: string;
  altFr: string;
  altEn: string;
  position: number;
};

export type AdminNewsArticle = {
  id: number;
  slug: string;
  titleFr: string;
  titleEn: string;
  excerptFr: string;
  excerptEn: string;
  bodyFr: string;
  bodyEn: string;
  coverImageUrl: string;
  coverAltFr: string;
  coverAltEn: string;
  publishedAt: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  gallery: NewsGalleryImage[];
};

export type PublicNewsArticle = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  coverImageUrl: string;
  coverAlt: string;
  publishedAt: string;
  gallery: Array<{ url: string; alt: string }>;
};

export async function getAllNewsArticles(): Promise<AdminNewsArticle[]> {
  try {
    const db = getDb();
    const articles = await db.select().from(newsArticles).orderBy(desc(newsArticles.publishedAt));
    if (!articles.length) return [];
    const images = await db
      .select()
      .from(newsImages)
      .where(inArray(newsImages.articleId, articles.map((article) => article.id)))
      .orderBy(newsImages.position);

    return articles.map((article) => ({
      ...article,
      gallery: images.filter((image) => image.articleId === article.id),
    }));
  } catch (error) {
    console.warn("Actualités indisponibles.", error);
    return [];
  }
}

function localiseArticle(article: AdminNewsArticle, locale: Locale): PublicNewsArticle {
  const english = locale === "en";
  return {
    id: article.id,
    slug: article.slug,
    title: english ? article.titleEn : article.titleFr,
    excerpt: english ? article.excerptEn : article.excerptFr,
    body: english ? article.bodyEn : article.bodyFr,
    coverImageUrl: article.coverImageUrl,
    coverAlt: english ? article.coverAltEn : article.coverAltFr,
    publishedAt: article.publishedAt,
    gallery: article.gallery.map((image) => ({
      url: image.url,
      alt: english ? image.altEn : image.altFr,
    })),
  };
}

export async function getPublishedNews(locale: Locale): Promise<PublicNewsArticle[]> {
  const articles = await getAllNewsArticles();
  return articles
    .filter((article) => article.isPublished)
    .map((article) => localiseArticle(article, locale));
}

export async function getPublishedNewsBySlug(
  slug: string,
  locale: Locale,
): Promise<PublicNewsArticle | null> {
  try {
    const db = getDb();
    const [article] = await db
      .select()
      .from(newsArticles)
      .where(eq(newsArticles.slug, slug))
      .limit(1);
    if (!article || !article.isPublished) return null;
    const gallery = await db
      .select()
      .from(newsImages)
      .where(eq(newsImages.articleId, article.id))
      .orderBy(newsImages.position);
    return localiseArticle({ ...article, gallery }, locale);
  } catch {
    return null;
  }
}
