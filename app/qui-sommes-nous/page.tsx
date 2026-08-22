import Image from "next/image";
import { AboutTabs } from "@/app/about-tabs";
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

      <section className="aboutHero sectionShell">
        <p className="eyebrow"><span /> {identity.eyebrow}</p>
        <h1>{identity.title}</h1>
        <p className="lede">{identity.ambition}</p>
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

      <section className="aboutTabsSection sectionShell">
        <AboutTabs
          knowUs={identity.knowUs}
          history={identity.history}
          values={identity.values}
          vision={identity.vision}
          ambition={identity.ambition}
          ambitionLabel={english ? "Our ambition" : "Notre ambition"}
        />
      </section>
    </main>
  );
}
