import { PageInteractions } from "@/app/page-interactions";
import { PublicHeader } from "@/app/public-header";
import { getSiteContent, normaliseLocale } from "@/lib/site-content";

export const dynamic = "force-dynamic";

export default async function AboutPage({ searchParams }: { searchParams: Promise<{ lang?: string }> }) {
  const query = await searchParams;
  const locale = normaliseLocale(query.lang);
  const english = locale === "en";
  const content = await getSiteContent(locale);
  const { identity } = content;

  return (
    <main className="aboutPage">
      <PageInteractions backToTopLabel={english ? "Back to top" : "Retour en haut"} />
      <PublicHeader
        locale={locale}
        active="sei"
        ctaLabel={content.hero.primaryAction}
        languageHrefFr="/qui-sommes-nous?lang=fr"
        languageHrefEn="/qui-sommes-nous?lang=en"
      />

      <section className="aboutSection sectionShell">
        <div className="aboutTitle">
          <p className="eyebrow"><span /> {identity.eyebrow}</p>
          <h2>{identity.title}</h2>
        </div>
        <div className="aboutCopy">
          {identity.paragraphs.map((paragraph, index) => <p className={index === 0 ? "aboutLead" : undefined} key={paragraph}>{paragraph}</p>)}
          <blockquote><span>{english ? "Our ambition" : "Notre ambition"}</span>{identity.ambition}</blockquote>

          <div className="identityBlock">
            <h3>{identity.history.title}</h3>
            {identity.history.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>

          <div className="identityBlock">
            <h3>{identity.values.title}</h3>
            <p>{identity.values.text}</p>
          </div>

          <div className="identityBlock">
            <h3>{identity.vision.title}</h3>
            <p>{identity.vision.text}</p>
          </div>
        </div>
      </section>
    </main>
  );
}
