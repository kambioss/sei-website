import { ExpandableList } from "@/app/expandable-list";
import { PageInteractions } from "@/app/page-interactions";
import { PublicHeader } from "@/app/public-header";
import { getSiteContent, normaliseLocale } from "@/lib/site-content";

export const dynamic = "force-dynamic";

export default async function SavoirFairePage({ searchParams }: { searchParams: Promise<{ lang?: string }> }) {
  const query = await searchParams;
  const locale = normaliseLocale(query.lang);
  const english = locale === "en";
  const content = await getSiteContent(locale);
  const { approach, capabilities, agenda2030 } = content;

  return (
    <main className="savoirFairePage">
      <PageInteractions backToTopLabel={english ? "Back to top" : "Retour en haut"} />
      <PublicHeader
        locale={locale}
        active="approche"
        ctaLabel={content.hero.primaryAction}
        languageHrefFr="/savoir-faire?lang=fr"
        languageHrefEn="/savoir-faire?lang=en"
      />

      <section className="approachSection" id="approche">
        <div className="sectionShell">
          <div className="approachIntro">
            <p className="eyebrow light"><span /> {approach.eyebrow}</p>
            <h2>{approach.title}</h2>
          </div>
          <p className="approachText">{approach.text}</p>

          <div className="savoirFaireList">
            <ExpandableList items={capabilities.items} sectionNumber="3" ariaLabel={approach.eyebrow} />
          </div>

          <div className="agenda2030Block">
            <h3>{agenda2030.title}</h3>
            <p>{agenda2030.text}</p>
          </div>
        </div>
      </section>
    </main>
  );
}
