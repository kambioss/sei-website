import Image from "next/image";
import { PageInteractions } from "@/app/page-interactions";
import { PublicHeader } from "@/app/public-header";
import { SiteFooter } from "@/app/site-footer";
import { getFooterLinkGroups } from "@/lib/footer-links";
import { getSiteContent, normaliseLocale } from "@/lib/site-content";

export const dynamic = "force-dynamic";

export default async function VisionPage({ searchParams }: { searchParams: Promise<{ lang?: string }> }) {
  const query = await searchParams;
  const locale = normaliseLocale(query.lang);
  const english = locale === "en";
  const content = await getSiteContent(locale);
  const { brand, identity, hero, contact } = content;
  const { vision } = identity;

  return (
    <main className="aboutPage">
      <PageInteractions backToTopLabel={english ? "Back to top" : "Retour en haut"} />
      <PublicHeader
        locale={locale}
        active="sei"
        ctaLabel={hero.primaryAction}
        languageHrefFr="/notre-vision?lang=fr"
        languageHrefEn="/notre-vision?lang=en"
      />

      <section className="aboutFeature reverse sectionShell">
        <div className="aboutFeatureCopy">
          <p className="eyebrow"><span /> {vision.title}</p>
          <h1>{vision.heading}</h1>
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
        email={contact.email}
        address={contact.address}
        location={contact.location}
        linkGroups={getFooterLinkGroups(locale, content)}
      />
    </main>
  );
}
