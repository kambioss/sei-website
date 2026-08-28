import Image from "next/image";
import { DomainCards } from "@/app/domain-cards";
import { PageInteractions } from "@/app/page-interactions";
import { PublicHeader } from "@/app/public-header";
import { SiteFooter } from "@/app/site-footer";
import { getFooterLinkGroups } from "@/lib/footer-links";
import { getSiteContent, normaliseLocale } from "@/lib/site-content";

export const dynamic = "force-dynamic";

const domainImages = [
  "/images/beautiful-scenery-lone-tree-middle-empty-field-grey-cloudy-sky.jpg",
  "/images/extra-long-shot-peaceful-landscape-with-trees.jpg",
  "/images/sei-territoires.webp",
];

const oddLogos = [
  { number: 2, left: "-142.5%", top: "-129.2%" },
  { number: 5, left: "-475.4%", top: "-129.2%" },
  { number: 13, left: "-30.6%", top: "-351.4%" },
  { number: 14, left: "-142.5%", top: "-351.4%" },
  { number: 15, left: "-252.9%", top: "-351.4%" },
  { number: 16, left: "-364.7%", top: "-351.4%" },
  { number: 17, left: "-475.4%", top: "-351.4%" },
];

export default async function Home({ searchParams }: { searchParams: Promise<{ lang?: string }> }) {
  const query = await searchParams;
  const locale = normaliseLocale(query.lang);
  const english = locale === "en";
  const content = await getSiteContent(locale);
  const { brand, identity, hero, expertiseIntro, expertises, approach, contact } = content;
  const { knowUs } = identity;
  const impactLabel = english ? "Expected impact" : "Impact recherché";
  const approachCardItems = english
    ? [
        "Needs assessment, design and delivery of training, development of guides and practical tools, knowledge capture and dissemination, stakeholder awareness-raising, and institutional and technical capacity building.",
        "Design and organisation of international conferences.",
        "Facilitation of stakeholder consultation workshops, communication, and capitalisation of results.",
      ]
    : [
        "Diagnostic des besoins, conception et animation de formations, élaboration de guides et d’outils pratiques, capitalisation et diffusion des connaissances, sensibilisation des acteurs et renforcement des capacités institutionnelles et techniques.",
        "Conception et organisation de conférences internationales.",
        "Conduite d’ateliers de consultation des parties prenantes, communication et capitalisation des résultats.",
      ];

  return (
    <main className="homePage" lang={locale}>
      <PageInteractions />
      <PublicHeader
        locale={locale}
        active="sei"
        ctaLabel={hero.primaryAction}
        languageHrefFr="/?lang=fr"
        languageHrefEn="/?lang=en"
      />

      <section id="nous-connaitre" className="hero sectionShell">
        <div className="heroCopy heroIntro">
          <p className="eyebrow"><span /> {english ? "Who we are" : "Qui sommes-nous"}</p>
          {knowUs.paragraphs.map((paragraph) => <p className="heroLead" key={paragraph}>{paragraph}</p>)}
        </div>
        <div className="heroVisualColumn">
          <div className="heroVisual">
            <Image className="heroVisualMain" src={knowUs.image} alt={english ? "Act for sustainable development" : "Agir pour le développement durable"} fill unoptimized sizes="(max-width: 980px) 100vw, 42vw" />
            <div className="imageShade" />
            <p className="imageCaption">{hero.imageCaption}</p>
          </div>
        </div>
      </section>

      <section className="expertiseSection sectionShell" id="expertises">
        <div className="sectionIntro">
          <div>
            <p className="eyebrow"><span /> {expertiseIntro.eyebrow}</p>
            <h2 className="expertiseIntroTitle">{expertiseIntro.title}</h2>
          </div>
        </div>
        <DomainCards
          english={english}
          items={domainImages.map((src, index) => ({
            src,
            title: expertises[index].title,
            summary: expertises[index].summary,
            interventions: expertises[index].interventions,
            impact: expertises[index].impact,
            impactLabel,
            tone: expertises[index].tone,
          }))}
        />
      </section>

      <section className="approachSection" id="approche">
        <div className="sectionShell">
          <div className="approachIntro">
            <p className="eyebrow"><span /> {approach.eyebrow}</p>
            <h2>{approach.title}</h2>
          </div>
          <p className="approachLead">{approach.lead}</p>
          <div className="approachGrid">
            <article>
              <ul>
                {approachCardItems.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </article>
          </div>
          <div className="approachClosing">
            <h3>{approach.closingTitle}</h3>
            <p>{approach.closingText}</p>
            <div className="oddLogoGrid" aria-label={english ? "Selected Sustainable Development Goals" : "Objectifs de développement durable sélectionnés"}>
              {oddLogos.map((logo) => (
                <div className="oddLogo" key={logo.number}>
                  <Image
                    className="oddLogoSprite"
                    src="/images/objectifs-developpement-durable.png"
                    alt={(english ? "SDG " : "ODD ") + logo.number}
                    width={2482}
                    height={1755}
                    style={{ left: logo.left, top: logo.top }}
                    unoptimized
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <SiteFooter
        brandName={brand.name}
        address={contact.address}
        linkGroups={getFooterLinkGroups(locale, content)}
        locale={locale}
      />
    </main>
  );
}
