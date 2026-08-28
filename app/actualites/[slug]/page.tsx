import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { GallerySlider } from "@/app/actualites/[slug]/gallery-slider";
import { PublicHeader } from "@/app/public-header";
import { SiteFooter } from "@/app/site-footer";
import { PROJECTS_NEWS_ENABLED } from "@/lib/feature-flags";
import { getFooterLinkGroups } from "@/lib/footer-links";
import { getPublishedNewsBySlug } from "@/lib/news";
import { getSiteContent, normaliseLocale } from "@/lib/site-content";

export const dynamic = "force-dynamic";

type ArticlePageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ lang?: string }>;
};

export default async function ArticlePage({ params, searchParams }: ArticlePageProps) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const locale = normaliseLocale(query.lang);
  if (!PROJECTS_NEWS_ENABLED) redirect(`/?lang=${locale}`);
  const [article, content] = await Promise.all([getPublishedNewsBySlug(slug, locale), getSiteContent(locale)]);
  if (!article) notFound();
  const english = locale === "en";

  return (
    <main className="articlePage" lang={locale}>
      <PublicHeader
        locale={locale}
        active="actualites"
        ctaLabel={content.hero.primaryAction}
        languageHrefFr={"/actualites/" + slug + "?lang=fr"}
        languageHrefEn={"/actualites/" + slug + "?lang=en"}
      />
      <article>
        <div className="articleHero">
          <Image src={article.coverImageUrl} alt={article.coverAlt} fill priority unoptimized sizes="100vw" />
          <div className="articleHeroShade" />
          <div className="sectionShell articleHeroCopy">
            <Link href={"/actualites?lang=" + locale}>← {english ? "Back to news" : "Retour aux actualités"}</Link>
            <time dateTime={article.publishedAt}>{new Intl.DateTimeFormat(english ? "en-GB" : "fr-FR", { dateStyle: "long" }).format(new Date(article.publishedAt))}</time>
            <h1>{article.title}</h1>
            <p>{article.excerpt}</p>
          </div>
        </div>
        <div className="articleBody sectionShell">
          <GallerySlider
            images={article.gallery}
            galleryLabel={english ? "Article gallery" : "Galerie de l’article"}
            previousLabel={english ? "Previous image" : "Image précédente"}
            nextLabel={english ? "Next image" : "Image suivante"}
          />
          {article.body.split(/\n{2,}/).map((paragraph, index) => <p key={index}>{paragraph}</p>)}
        </div>
      </article>

      <SiteFooter
        brandName={content.brand.name}
        address={content.contact.address}
        linkGroups={getFooterLinkGroups(locale, content)}
        locale={locale}
      />
    </main>
  );
}
