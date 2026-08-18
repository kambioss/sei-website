import { desc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { projects } from "@/db/schema";
import type { Locale } from "@/lib/site-content";

export type AdminProject = {
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
};

export type PublicProject = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  coverImageUrl: string;
  coverAlt: string;
  publishedAt: string;
};

function localiseProject(project: AdminProject, locale: Locale): PublicProject {
  const english = locale === "en";
  return {
    id: project.id,
    slug: project.slug,
    title: english ? project.titleEn : project.titleFr,
    excerpt: english ? project.excerptEn : project.excerptFr,
    body: english ? project.bodyEn : project.bodyFr,
    coverImageUrl: project.coverImageUrl,
    coverAlt: english ? project.coverAltEn : project.coverAltFr,
    publishedAt: project.publishedAt,
  };
}

export async function getAllProjects(): Promise<AdminProject[]> {
  try {
    return await getDb().select().from(projects).orderBy(desc(projects.publishedAt));
  } catch (error) {
    console.warn("Projets indisponibles.", error);
    return [];
  }
}

export async function getPublishedProjects(locale: Locale): Promise<PublicProject[]> {
  return (await getAllProjects()).filter((project) => project.isPublished).map((project) => localiseProject(project, locale));
}

export async function getPublishedProjectBySlug(slug: string, locale: Locale): Promise<PublicProject | null> {
  try {
    const [project] = await getDb().select().from(projects).where(eq(projects.slug, slug)).limit(1);
    if (!project || !project.isPublished) return null;
    return localiseProject(project, locale);
  } catch {
    return null;
  }
}
