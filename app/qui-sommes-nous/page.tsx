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
  const { identity, founder, hero, expertiseIntro, expertises, approach, capabilities } = content;
  const { knowUs, history, values, vision } = identity;
  const interventionsLabel = english ? "Our services" : "Nos interventions";
  const impactLabel = english ? "Expected impact" : "Impact recherché";

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

      <section className="expertiseSection sectionShell" id="expertises">
        <div className="sectionIntro">
          <div>
            <p className="eyebrow"><span /> {expertiseIntro.eyebrow}</p>
            <h2>{expertiseIntro.title}</h2>
          </div>
          <p>{expertiseIntro.text}</p>
        </div>
        <div className="expertiseGrid">
          {expertises.map((card) => (
            <article className={"expertiseCard " + card.tone} key={card.number}>
              <div className="cardTop"><span>{card.number}</span><i /></div>
              <h3>{card.title}</h3>
              <p className="cardBody">{card.summary}</p>
              <h4>{interventionsLabel}</h4>
              <ul className="interventionList">
                {card.interventions.map((item) => <li key={item}>{item}</li>)}
              </ul>
              <div className="impactBox">
                <strong>{impactLabel}</strong>
                <p>{card.impact}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="capabilitiesSection">
        <div className="sectionShell capabilitiesGrid">
          <div>
            <h2>{capabilities.title}</h2>
            <p className="capabilitiesLead">{capabilities.lead}</p>
          </div>
          <ul>
            {capabilities.items.filter((item) => item.title.trim().length > 0).map((item, index) => (
              <li key={item.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="approachSection" id="approche">
        <div className="sectionShell">
          <div className="approachIntro">
            <p className="eyebrow light"><span /> {approach.eyebrow}</p>
            <h2>{approach.title}</h2>
          </div>
          <div className="approachGrid">
            {approach.items.map((step, index) => (
              <article key={step.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
