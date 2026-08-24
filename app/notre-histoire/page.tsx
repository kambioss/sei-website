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
  const { brand, identity, hero, contact } = content;
  const { history } = identity;

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
          <Image src={history.image} alt={history.heading} fill unoptimized priority sizes="(max-width: 1240px) 100vw, 1240px" />
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
