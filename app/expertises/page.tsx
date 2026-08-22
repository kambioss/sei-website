import Image from "next/image";
import { ExpandableList } from "@/app/expandable-list";
import { PageInteractions } from "@/app/page-interactions";
import { PublicHeader } from "@/app/public-header";
import { getSiteContent, normaliseLocale } from "@/lib/site-content";

export const dynamic = "force-dynamic";

export default async function ExpertisesPage({ searchParams }: { searchParams: Promise<{ lang?: string }> }) {
  const query = await searchParams;
  const locale = normaliseLocale(query.lang);
  const english = locale === "en";
  const content = await getSiteContent(locale);
  const { expertiseIntro, expertises } = content;

  return (
    <main className="expertisesPage">
      <PageInteractions backToTopLabel={english ? "Back to top" : "Retour en haut"} />
      <PublicHeader
        locale={locale}
        active="expertises"
        ctaLabel={content.hero.primaryAction}
        languageHrefFr="/expertises?lang=fr"
        languageHrefEn="/expertises?lang=en"
      />

      <section className="expertiseSection sectionShell" id="expertises">
        <div className="sectionIntro">
          <div><p className="eyebrow"><span /> {expertiseIntro.eyebrow}</p><h2>{expertiseIntro.title}</h2></div>
          <p>{expertiseIntro.text}</p>
        </div>

        <h3 className="expertiseSectionTitle">{expertiseIntro.sectionTitle}</h3>

        <div className="expertiseGrid">
          {expertises.map((card) => (
            <article className={"expertiseCard " + card.tone} key={card.number}>
              <div className="cardTop"><span>{card.number}</span><i /></div>
              <div className="expertiseCardImage">
                <Image src={card.imageSrc} alt={card.title} fill unoptimized sizes="(max-width: 900px) 100vw, 33vw" />
              </div>
              <h3>{card.title}</h3>
              <p className="cardBody">{card.summary}</p>
              <h4>{english ? "Our interventions" : "Nos interventions"}</h4>
              <ExpandableList items={card.interventions} sectionNumber="2" ariaLabel={card.title} />
              <div className="impactBox"><strong>{english ? "Intended impact" : "Impact recherché"}</strong><p>{card.impact}</p></div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
