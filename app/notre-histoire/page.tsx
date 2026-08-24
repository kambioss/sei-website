import Image from "next/image";
import { PageInteractions } from "@/app/page-interactions";
import { PublicHeader } from "@/app/public-header";
import { SiteFooter } from "@/app/site-footer";
import { getFooterLinkGroups } from "@/lib/footer-links";
import { getSiteContent, normaliseLocale } from "@/lib/site-content";

export const dynamic = "force-dynamic";

export default async function HistoryPage({ searchParams }: { searchParams: Promise<{ lang?: string }> }) {
  const query = await searchParams;
  const locale = normaliseLocale(query.lang);
  const english = locale === "en";
  const content = await getSiteContent(locale);
  const { brand, identity, hero } = content;
  const { history, values, vision } = identity;

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

      <section id="notre-histoire" className="hero sectionShell">
        <div className="heroVisual">
          <Image src={history.image} alt={history.heading} fill unoptimized priority sizes="100vw" />
          <div className="imageShade" />
          <div className="heroCopy">
            <p className="eyebrow"><span /> {history.title}</p>
            <h1>{history.heading}</h1>
            <p className="heroStatement">{history.statement}</p>
          </div>
        </div>
      </section>

      <section className="historySection sectionShell">
        <div className="historyTimeline">
          {history.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </div>
      </section>

      <section className="valuesSection sectionShell" id="nos-valeurs">
        <div className="sectionIntro">
          <div>
            <p className="eyebrow"><span /> {values.title}</p>
            <h2>{values.heading}</h2>
          </div>
          <p>{values.statement}</p>
        </div>
        <div className="valuesGrid">
          {values.pillars.map((pillar, index) => (
            <div className="valueCard" key={pillar}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{pillar}</strong>
            </div>
          ))}
        </div>
        <p className="valuesText">{values.text}</p>
      </section>

      <section className="aboutFeature reverse sectionShell" id="notre-vision">
        <div className="aboutFeatureCopy">
          <p className="eyebrow"><span /> {vision.title}</p>
          <h2>{vision.heading}</h2>
          <p className="aboutFeatureStatement">{vision.statement}</p>
          <p>{vision.text}</p>
        </div>
        <div className="aboutFeatureMedia">
          <Image src={vision.image} alt={vision.title} fill unoptimized sizes="(max-width: 900px) 100vw, 46vw" />
        </div>
      </section>

      <SiteFooter
        brandName={brand.name}
        descriptor={brand.descriptor}
        linkGroups={getFooterLinkGroups(locale, content)}
      />
    </main>
  );
}
