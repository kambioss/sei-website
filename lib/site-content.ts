import { eq } from "drizzle-orm";
import defaultContent from "@/content/site-content.json";
import defaultContentEn from "@/content/site-content-en.json";
import { siteContent } from "@/db/schema";

export type SiteContent = typeof defaultContent;
export const fallbackSiteContent: SiteContent = defaultContent;
export type Locale = "fr" | "en";

const fallbackByLocale: Record<Locale, SiteContent> = {
  fr: defaultContent,
  en: defaultContentEn,
};

export function normaliseLocale(value: string | undefined): Locale {
  return value === "en" ? "en" : "fr";
}

export async function getSiteContent(locale: Locale = "fr"): Promise<SiteContent> {
  try {
    // Chargement différé : le rendu Node et les environnements sans binding D1
    // utilisent le contenu intégré sans tenter de résoudre cloudflare:workers.
    const { getDb } = await import("@/db");
    const db = getDb();
    const [row] = await db
      .select({ content: siteContent.content })
      .from(siteContent)
      .where(eq(siteContent.key, "main:" + locale))
      .limit(1);

    if (!row) return fallbackByLocale[locale];
    return parseSiteContent(row.content, locale);
  } catch (error) {
    console.warn("Contenu D1 indisponible, utilisation du contenu intégré.", error);
    return fallbackByLocale[locale];
  }
}

export function parseSiteContent(value: unknown, locale: Locale = "fr"): SiteContent {
  const parsed = typeof value === "string" ? JSON.parse(value) : value;
  const migrated = mergeMissingContent(fallbackByLocale[locale], parsed);
  assertSameShape(fallbackByLocale[locale], migrated, "contenu");
  return migrated as SiteContent;
}

function mergeMissingContent(template: unknown, value: unknown): unknown {
  if (value === undefined || value === null) return structuredClone(template);
  if (Array.isArray(template)) return value;
  if (template && typeof template === "object") {
    const source = value && typeof value === "object" ? value as Record<string, unknown> : {};
    return Object.fromEntries(
      Object.entries(template as Record<string, unknown>).map(([key, childTemplate]) => [
        key,
        mergeMissingContent(childTemplate, source[key]),
      ]),
    );
  }
  return value;
}

function assertSameShape(template: unknown, value: unknown, path: string): void {
  if (typeof template === "string") {
    if (typeof value !== "string") throw new Error(path + " doit être un texte.");
    return;
  }

  if (typeof template === "boolean") {
    if (typeof value !== "boolean") throw new Error(path + " doit être activé ou désactivé.");
    return;
  }

  if (Array.isArray(template)) {
    if (!Array.isArray(value) || value.length !== template.length) {
      throw new Error(path + " doit contenir " + template.length + " éléments.");
    }
    value.forEach((item, index) => {
      const itemTemplate = template[Math.min(index, template.length - 1)];
      assertSameShape(itemTemplate, item, path + "[" + index + "]");
    });
    return;
  }

  if (!template || typeof template !== "object" || !value || typeof value !== "object") {
    throw new Error(path + " a un format invalide.");
  }

  for (const key of Object.keys(template)) {
    assertSameShape(
      (template as Record<string, unknown>)[key],
      (value as Record<string, unknown>)[key],
      path + "." + key,
    );
  }
}
