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

      <section id="nous-connaitre" className="hero sectionShell">
        <div className="heroCopy">
          <p className="eyebrow"><span /> {english ? "Get to know us" : "Nous connaître"}</p>
          <h1>{hero.statement}</h1>
          {knowUs.paragraphs.map((paragraph) => <p className="heroLead" key={paragraph}>{paragraph}</p>)}
        </div>
        <div className="heroVisual">
          <Image src={knowUs.image} alt={hero.statement} fill unoptimized sizes="(max-width: 980px) 100vw, 42vw" />
          <div className="imageShade" />
          <p className="imageCaption">{knowUs.imageCaption}</p>
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
        <article className="founderCard">
          <div className="founderCardImage">
            <Image src={founder.photo} alt={founder.name} fill unoptimized sizes="(max-width: 800px) 100vw, 45vw" />
          </div>
          <div className="founderCardCopy">
            <p className="eyebrow"><span /> {founder.eyebrow}</p>
            <h2>{founder.name}</h2>
            <p className="founderRole">{founder.role}</p>
            {founder.quote.map((paragraph) => <p className="founderQuoteText" key={paragraph}>{paragraph}</p>)}
          </div>
        </article>
      </section>
    </main>
  );
}
