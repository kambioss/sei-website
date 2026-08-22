import Image from "next/image";
import { HeroQuickLinks } from "@/app/hero-quick-links";
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
          <h1>{english ? "Act for sustainable development" : "Agir pour le développement durable"}</h1>
          {knowUs.paragraphs.map((paragraph) => <p className="heroLead" key={paragraph}>{paragraph}</p>)}

          <div className="founderLetter">
            <p className="eyebrow"><span /> {founder.eyebrow}</p>
            <div className="founderPhotoBlock">
              <div className="founderPhoto">
                <Image src={founder.photo} alt={founder.name} fill unoptimized sizes="160px" />
              </div>
              <p className="founderPhotoName">{founder.name}</p>
            </div>
            {founder.quote.map((paragraph) => <p className="founderQuoteText" key={paragraph}>{paragraph}</p>)}
          </div>
        </div>
        <div className="heroVisualColumn">
          <div className="heroVisual">
            <Image src={knowUs.image} alt={english ? "Act for sustainable development" : "Agir pour le développement durable"} fill unoptimized sizes="(max-width: 980px) 100vw, 42vw" />
            <div className="imageShade" />
            <p className="imageCaption">{hero.imageCaption}</p>
          </div>
          <HeroQuickLinks
            moreLabel={english ? "Learn more" : "En savoir plus"}
            items={[
              { id: "notre-histoire", href: `/notre-histoire?lang=${locale}`, icon: "history", label: history.title, heading: history.heading, text: history.statement },
              { id: "nos-valeurs", href: `/nos-valeurs?lang=${locale}`, icon: "values", label: values.title, heading: values.heading, text: values.statement },
              { id: "notre-vision", href: `/notre-vision?lang=${locale}`, icon: "vision", label: vision.title, heading: vision.heading, text: vision.statement },
            ]}
          />
        </div>
      </section>
    </main>
  );
}
