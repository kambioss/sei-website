import Image from "next/image";
import { PageInteractions } from "@/app/page-interactions";
import { PublicHeader } from "@/app/public-header";
import { SiteFooter } from "@/app/site-footer";
import { getFooterLinkGroups } from "@/lib/footer-links";
import { getSiteContent, normaliseLocale } from "@/lib/site-content";

export const dynamic = "force-dynamic";

export default async function ValuesPage({ searchParams }: { searchParams: Promise<{ lang?: string }> }) {
  const query = await searchParams;
  const locale = normaliseLocale(query.lang);
  const english = locale === "en";
  const content = await getSiteContent(locale);
  const { brand, identity, hero, contact } = content;
  const { values } = identity;

  return (
    <main className="aboutPage">
      <PageInteractions backToTopLabel={english ? "Back to top" : "Retour en haut"} />
      <PublicHeader
        locale={locale}
        active="sei"
        ctaLabel={hero.primaryAction}
        languageHrefFr="/nos-valeurs?lang=fr"
        languageHrefEn="/nos-valeurs?lang=en"
      />

      <section id="nos-valeurs" className="hero sectionShell">
        <div className="heroVisual">
          <Image src={values.image} alt={values.heading} fill unoptimized priority sizes="(max-width: 1240px) 100vw, 1240px" />
          <div className="imageShade" />
          <div className="heroCopy">
            <p className="eyebrow"><span /> {values.title}</p>
            <h1>{values.heading}</h1>
            <p className="heroStatement">{values.statement}</p>
          </div>
        </div>
      </section>

      <section className="valuesSection sectionShell">
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

      <SiteFooter
        brandName={brand.name}
        descriptor={brand.descriptor}
        email={contact.email}
        address={contact.address}
        location={contact.location}
        linkGroups={getFooterLinkGroups(locale, content)}
      />
    </main>
  );
}
