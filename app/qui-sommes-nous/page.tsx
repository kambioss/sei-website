import Image from "next/image";
import { PageInteractions } from "@/app/page-interactions";
import { PublicHeader } from "@/app/public-header";
import { getSiteContent, normaliseLocale } from "@/lib/site-content";

export const dynamic = "force-dynamic";

export default async function AboutPage({ searchParams }: { searchParams: Promise<{ lang?: string }> }) {
  const query = await searchParams;
  const locale = normaliseLocale(query.lang);
  const english = locale === "en";
  const content = await getSiteContent(locale);
  const { identity, founder, hero } = content;
  const { knowUs, history, values, vision } = identity;

  return (
    <main className="aboutPage">
      <PageInteractions backToTopLabel={english ? "Back to top" : "Retour en haut"} />
      <PublicHeader
        locale={locale}
        active="sei"
        ctaLabel={hero.primaryAction}
        languageHrefFr="/qui-sommes-nous?lang=fr"
        languageHrefEn="/qui-sommes-nous?lang=en"
      />

      <section id="nous-connaitre" className="aboutFeature sectionShell">
        <div className="aboutFeatureCopy">
          <p className="eyebrow"><span /> {knowUs.title}</p>
          <h2>{knowUs.heading}</h2>
          <p className="aboutFeatureStatement">{knowUs.statement}</p>
          {knowUs.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </div>
        <div className="aboutFeatureMedia">
          <Image src={knowUs.image} alt={knowUs.title} fill unoptimized sizes="(max-width: 900px) 100vw, 46vw" />
        </div>
      </section>

      <section id="notre-histoire" className="aboutFeature reverse sectionShell">
        <div className="aboutFeatureCopy">
          <p className="eyebrow"><span /> {history.title}</p>
          <h2>{history.heading}</h2>
          <p className="aboutFeatureStatement">{history.statement}</p>
          <div className="historyTimeline">
            {history.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
        </div>
        <div className="aboutFeatureMedia">
          <Image src={history.image} alt={history.title} fill unoptimized sizes="(max-width: 900px) 100vw, 46vw" />
        </div>
      </section>

      <section id="nos-valeurs" className="aboutFeature sectionShell">
        <div className="aboutFeatureCopy">
          <p className="eyebrow"><span /> {values.title}</p>
          <h2>{values.heading}</h2>
          <p className="aboutFeatureStatement">{values.statement}</p>
          <div className="valuesGrid">
            {values.pillars.map((pillar, index) => (
              <div className="valueCard" key={pillar}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{pillar}</strong>
              </div>
            ))}
          </div>
          <p>{values.text}</p>
        </div>
        <div className="aboutFeatureMedia">
          <Image src={values.image} alt={values.title} fill unoptimized sizes="(max-width: 900px) 100vw, 46vw" />
        </div>
      </section>

      <section id="notre-vision" className="aboutFeature reverse sectionShell">
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

      <section className="founderSection sectionShell">
        <div className="founderCard">
          <p className="eyebrow"><span /> {founder.eyebrow}</p>
          {founder.quote.map((paragraph) => <p className="founderQuoteText" key={paragraph}>{paragraph}</p>)}
          <div className="founderPerson">
            <span className="founderAvatar"><Image src={founder.photo} alt={founder.name} fill unoptimized sizes="56px" /></span>
            <div className="founderPersonCopy">
              <strong>{founder.name}</strong>
              <span>{founder.role}</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
