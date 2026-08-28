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
  const content = await getSiteContent(locale);
  const { brand, identity, founder, hero } = content;
  const { history, values, vision } = identity;

  return (
    <main className="aboutPage" lang={locale}>
      <PageInteractions />
      <PublicHeader
        locale={locale}
        active="sei"
        ctaLabel={hero.primaryAction}
        languageHrefFr="/notre-histoire?lang=fr"
        languageHrefEn="/notre-histoire?lang=en"
      />

      <section id="notre-histoire" className="hero sectionShell">
        <div className="heroVisual">
          <video src="/images/histoire.mp4" autoPlay loop muted playsInline />
          <div className="imageShade" />
          <div className="heroCopy">
            <p className="eyebrow"><span /> {history.title}</p>
            <h1>{history.heading}</h1>
          </div>
        </div>
        <div className="historyIntro">
          {history.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </div>
      </section>

      <div className="valuesVisionGrid sectionShell">
        <section className="valuesSection" id="nos-valeurs">
          <div className="sectionIntro">
            <p className="eyebrow">{values.title}</p>
          </div>
          <p className="valuesText">{values.text}</p>
        </section>

        <section className="visionSection" id="notre-vision">
          <div className="aboutFeatureCopy">
            <p className="eyebrow">{vision.title}</p>
            <p className="aboutFeatureStatement">{vision.statement}</p>
            <p>{vision.text}</p>
          </div>
        </section>
      </div>

      <section className="founderSection sectionShell">
        <div className="founderLetter">
          <p className="eyebrow">{founder.eyebrow}</p>
          <div className="founderPhotoBlock">
            <div className="founderPhoto">
              <Image src={founder.photo} alt={founder.name} fill unoptimized sizes="160px" />
            </div>
            <p className="founderPhotoName">{founder.name}</p>
          </div>
          <div className="founderQuote">
            {founder.quote.map((paragraph) => <p className="founderQuoteText" key={paragraph}>{paragraph}</p>)}
          </div>
        </div>
      </section>

      <SiteFooter
        brandName={brand.name}
        address={content.contact.address}
        linkGroups={getFooterLinkGroups(locale, content)}
        locale={locale}
      />
    </main>
  );
}
