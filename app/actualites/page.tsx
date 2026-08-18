import Image from "next/image";
import Link from "next/link";
import { PageInteractions } from "@/app/page-interactions";
import { PublicHeader } from "@/app/public-header";
import { getPublishedNews } from "@/lib/news";
import { getSiteContent, normaliseLocale } from "@/lib/site-content";

export const dynamic = "force-dynamic";

type NewsPageProps = {
  searchParams: Promise<{ lang?: string }>;
};

const copy = {
  fr: {
    eyebrow: "Actualités SEI",
    title: "Toutes nos actualités",
    intro: "Découvrez les projets, partenariats, analyses et nouvelles du terrain publiés par Social & Eco Impact.",
    home: "Retour à l’accueil",
    read: "Lire l’actualité",
    empty: "Les premières actualités seront publiées prochainement.",
    backToTop: "Retour en haut",
  },
  en: {
    eyebrow: "SEI news",
    title: "All our news",
    intro: "Discover projects, partnerships, insights and field updates published by Social & Eco Impact.",
    home: "Back to home",
    read: "Read the story",
    empty: "Our first news stories will be published soon.",
    backToTop: "Back to top",
  },
} as const;

export default async function NewsPage({ searchParams }: NewsPageProps) {
  const query = await searchParams;
  const locale = normaliseLocale(query.lang);
  const ui = copy[locale];
  const [content, articles] = await Promise.all([
    getSiteContent(locale),
    getPublishedNews(locale),
  ]);

  return (
    <main className="newsArchivePage">
      <PageInteractions backToTopLabel={ui.backToTop} />
      <PublicHeader
        locale={locale}
        active="actualites"
        ctaLabel={content.hero.primaryAction}
        languageHrefFr="/actualites?lang=fr"
        languageHrefEn="/actualites?lang=en"
      />

      <section className="newsArchive sectionShell">
        <div className="newsArchiveIntro">
          <p className="eyebrow"><span /> {ui.eyebrow}</p>
          <h1>{ui.title}</h1>
          <p>{ui.intro}</p>
        </div>
        {articles.length ? (
          <div className="newsGrid newsArchiveGrid">
            {articles.map((article) => (
              <article className="newsCard" key={article.id}>
                <Link className="newsCardImage" href={"/actualites/" + article.slug + "?lang=" + locale}>
                  <Image src={article.coverImageUrl} alt={article.coverAlt} fill unoptimized sizes="(max-width: 800px) 100vw, 33vw" />
                </Link>
                <div className="newsCardCopy">
                  <time dateTime={article.publishedAt}>{new Intl.DateTimeFormat(locale === "en" ? "en-GB" : "fr-FR", { dateStyle: "long" }).format(new Date(article.publishedAt))}</time>
                  <h2><Link href={"/actualites/" + article.slug + "?lang=" + locale}>{article.title}</Link></h2>
                  <p>{article.excerpt}</p>
                  <Link href={"/actualites/" + article.slug + "?lang=" + locale}>{ui.read} <span aria-hidden="true">→</span></Link>
                </div>
              </article>
            ))}
          </div>
        ) : <p className="newsEmpty">{ui.empty}</p>}
      </section>
    </main>
  );
}
