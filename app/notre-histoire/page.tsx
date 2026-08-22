import { PageInteractions } from "@/app/page-interactions";
import { PublicHeader } from "@/app/public-header";
import { getSiteContent, normaliseLocale } from "@/lib/site-content";

export const dynamic = "force-dynamic";

export default async function HistoryPage({ searchParams }: { searchParams: Promise<{ lang?: string }> }) {
  const query = await searchParams;
  const locale = normaliseLocale(query.lang);
  const english = locale === "en";
  const content = await getSiteContent(locale);
  const { identity, hero } = content;
  const { history } = identity;

  return (
    <main className="aboutPage">
      <PageInteractions backToTopLabel={english ? "Back to top" : "Retour en haut"} />
      <PublicHeader
        locale={locale}
        active="sei"
        ctaLabel={hero.primaryAction}
        languageHrefFr="/notre-histoire?lang=fr"
        languageHrefEn="/notre-histoire?lang=en"
      />

      <section className="historySection sectionShell">
        <div className="historyIntro">
          <p className="eyebrow"><span /> {history.title}</p>
          <h1>{history.heading}</h1>
          <p className="aboutFeatureStatement">{history.statement}</p>
        </div>
        <div className="historyColumns">
          {history.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </div>
      </section>
    </main>
  );
}
