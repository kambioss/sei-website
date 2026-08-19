import Image from "next/image";
import Link from "next/link";
import { ContactForm } from "@/app/contact-form";
import { PageInteractions } from "@/app/page-interactions";
import { PublicHeader } from "@/app/public-header";
import { OrganizationSlider } from "@/app/organization-slider";
import { PROJECTS_NEWS_ENABLED } from "@/lib/feature-flags";
import { getPublishedNews } from "@/lib/news";
import { getSiteContent, normaliseLocale } from "@/lib/site-content";

export const dynamic = "force-dynamic";

const ui = {
  fr: {
    navigation: "Navigation principale",
    cabinet: "Le cabinet",
    expertise: "Expertises",
    approach: "Approche",
    news: "Actualités",
    menu: "Menu",
    strengths: "Forces de SEI",
    audiences: "Nous accompagnons",
    audienceLabel: "Publics accompagnés",
    ambition: "Notre ambition",
    interventions: "Nos interventions",
    impact: "Impact recherché",
    directContact: "Contact direct",
    galleryTitle: "Le capital naturel au cœur de notre engagement.",
    galleryCaptions: ["Terres et biodiversité", "Résilience des paysages", "Territoires en transition"],
    newsEyebrow: "Nos actualités",
    latestNewsTitle: "Notre dernière activité",
    newsTitle: "Projets, idées et nouvelles du terrain.",
    newsIntro: "Suivez les activités de SEI, ses partenariats et ses contributions à la transformation durable des territoires.",
    noNews: "Les premières actualités seront publiées prochainement.",
    read: "Lire l’actualité",
    allNews: "Voir toutes les actualités",
    footerTagline: "Conseil · Stratégie · Impact",
    conversation: "Démarrer une conversation",
  },
  en: {
    navigation: "Main navigation",
    cabinet: "About us",
    expertise: "Expertise",
    approach: "Approach",
    news: "News",
    menu: "Menu",
    strengths: "SEI strengths",
    audiences: "We support",
    audienceLabel: "Organisations we support",
    ambition: "Our ambition",
    interventions: "Our services",
    impact: "Expected impact",
    directContact: "Direct contact",
    galleryTitle: "Natural capital at the heart of our commitment.",
    galleryCaptions: ["Land and biodiversity", "Landscape resilience", "Territories in transition"],
    newsEyebrow: "Our news",
    latestNewsTitle: "Our latest activity",
    newsTitle: "Projects, ideas and news from the field.",
    newsIntro: "Follow SEI’s activities, partnerships and contributions to the sustainable transformation of territories.",
    noNews: "Our first news stories will be published soon.",
    read: "Read the story",
    allNews: "View all news",
    footerTagline: "Consulting · Strategy · Impact",
    conversation: "Start a conversation",
  },
};

const territoryImages = [
  "/images/beautiful-scenery-lone-tree-middle-empty-field-grey-cloudy-sky.jpg",
  "/images/extra-long-shot-peaceful-landscape-with-trees.jpg",
  "/images/sei-territoires.webp",
];

type HomeProps = {
  searchParams: Promise<{ lang?: string }>;
};

export default async function Home({ searchParams }: HomeProps) {
  const query = await searchParams;
  const locale = normaliseLocale(query.lang);
  const copy = ui[locale];
  const [content, articles] = await Promise.all([
    getSiteContent(locale),
    PROJECTS_NEWS_ENABLED ? getPublishedNews(locale) : Promise.resolve([]),
  ]);
  const { brand, hero, audiences, identity, expertiseIntro, expertises, approach, capabilities, trustedOrganizations, valueAdded, contact } = content;
  const anchor = (id: string) => "/?lang=" + locale + "#" + id;

  return (
    <main>
      <PageInteractions backToTopLabel={locale === "en" ? "Back to top" : "Retour en haut"} />
      <PublicHeader locale={locale} ctaLabel={hero.primaryAction} languageHrefFr="/?lang=fr" languageHrefEn="/?lang=en" />

      <section className="hero sectionShell" id="accueil">
        <div className="heroCopy">
          <p className="eyebrow"><span /> {brand.descriptor}</p>
          <h1>{hero.title}</h1>
          <p className="heroStatement">{hero.statement}</p>
          <p className="heroLead">{hero.lead}</p>
          <div className="heroActions">
            <Link className="button buttonPrimary" href={anchor("contact")}>{hero.primaryAction} <span aria-hidden="true">→</span></Link>
            <Link className="button buttonGhost" href={anchor("expertises")}>{hero.secondaryAction}</Link>
          </div>
          <div className="heroProof" aria-label={copy.strengths}>
            {hero.proofs.map((proof, index) => (
              <span className="proofItem" key={proof}>{proof}{index < hero.proofs.length - 1 && <i aria-hidden="true" />}</span>
            ))}
          </div>
        </div>
        <div className="heroVisual">
          <Image
            src="/images/natural-landscape-with-sunrise-trees.jpg"
            unoptimized
            alt={locale === "en" ? "African landscape at sunrise" : "Paysage africain au lever du soleil"}
            fill
            priority
            sizes="(max-width: 980px) 100vw, 42vw"
          />
          <div className="imageShade" />
          <p className="imageCaption">{hero.imageCaption}</p>
        </div>
      </section>

      <section className="audienceBand" aria-label={copy.audienceLabel}>
        <p>{copy.audiences}</p>
        <div>
          {audiences.map((audience, index) => (
            <span className="audienceItem" key={audience}>{audience}{index < audiences.length - 1 && <i aria-hidden="true" />}</span>
          ))}
        </div>
      </section>

      <section className="aboutSection sectionShell" id="sei">
        <div className="aboutTitle">
          <p className="eyebrow"><span /> {identity.eyebrow}</p>
          <h2>{identity.title}</h2>
          <figure className="aboutTitleMedia">
            <Image
              src="/images/visite_terrain.jpeg"
              alt={locale === "en" ? "SEI team on a field visit" : "L’équipe SEI en visite de terrain"}
              fill
              unoptimized
              sizes="(max-width: 900px) 100vw, 40vw"
            />
          </figure>
        </div>
        <div className="aboutCopy">
          {identity.paragraphs.map((paragraph, index) => <p className={index === 0 ? "aboutLead" : undefined} key={paragraph}>{paragraph}</p>)}
          <blockquote><span>{copy.ambition}</span>{identity.ambition}</blockquote>
        </div>
      </section>

      <section className="territoryGallery sectionShell" aria-label={copy.galleryTitle}>
        <div className="territoryGalleryIntro">
          <h2>{copy.galleryTitle}</h2>
        </div>
        <div className="territoryGalleryGrid">
          {territoryImages.map((src, index) => (
            <figure key={src}>
              <Image src={src} alt={copy.galleryCaptions[index]} fill unoptimized sizes="(max-width: 680px) 100vw, 50vw" />
              <figcaption>{copy.galleryCaptions[index]}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="expertiseSection sectionShell" id="expertises">
        <div className="sectionIntro">
          <div><p className="eyebrow"><span /> {expertiseIntro.eyebrow}</p><h2>{expertiseIntro.title}</h2></div>
          <p>{expertiseIntro.text}</p>
        </div>
        <div className="expertiseGrid">
          {expertises.map((card) => (
            <article className={"expertiseCard " + card.tone} key={card.number}>
              <div className="cardTop"><span>{card.number}</span><i /></div>
              <h3>{card.title}</h3>
              <p className="cardBody">{card.summary}</p>
              <h4>{copy.interventions}</h4>
              <ul className="interventionList">{card.interventions.map((item) => <li key={item}>{item}</li>)}</ul>
              <div className="impactBox"><strong>{copy.impact}</strong><p>{card.impact}</p></div>
            </article>
          ))}
        </div>
      </section>

      <section className="capabilitiesSection">
        <div className="sectionShell capabilitiesGrid">
          <div><p className="eyebrow light"><span /> {capabilities.eyebrow}</p><h2>{capabilities.title}</h2><p className="capabilitiesLead">{capabilities.lead}</p></div>
          <ul>
            {capabilities.items.map((item, index) => (
              <li key={item.title}><span>{String(index + 1).padStart(2, "0")}</span><div><strong>{item.title}</strong><p>{item.text}</p></div></li>
            ))}
          </ul>
        </div>
      </section>

      <section className="approachSection" id="approche">
        <div className="sectionShell">
          <div className="approachIntro"><p className="eyebrow light"><span /> {approach.eyebrow}</p><h2>{approach.title}</h2></div>
          <div className="approachGrid">
            {approach.items.map((step, index) => (
              <article key={step.title}><span>{String(index + 1).padStart(2, "0")}</span><h3>{step.title}</h3><p>{step.text}</p></article>
            ))}
          </div>
        </div>
      </section>

      {PROJECTS_NEWS_ENABLED && (
        <section className="newsSection" id="actualites">
          <div className="sectionShell newsSectionInner">
            <div className="sectionIntro">
              <div><p className="eyebrow"><span /> {copy.newsEyebrow}</p><h2>{copy.latestNewsTitle}</h2></div>
              <p>{copy.newsIntro}</p>
            </div>
            {articles.length ? (
              <div className="latestNewsBlock">
                <div className="newsGrid latestNewsGrid">
                  {articles.slice(0, 1).map((article) => (
                    <article className="newsCard" key={article.id}>
                      <Link className="newsCardImage" href={"/actualites/" + article.slug + "?lang=" + locale}>
                        <Image src={article.coverImageUrl} alt={article.coverAlt} fill unoptimized sizes="(max-width: 800px) 100vw, 58vw" />
                      </Link>
                      <div className="newsCardCopy">
                        <time dateTime={article.publishedAt}>{new Intl.DateTimeFormat(locale === "en" ? "en-GB" : "fr-FR", { dateStyle: "long" }).format(new Date(article.publishedAt))}</time>
                        <h3><Link href={"/actualites/" + article.slug + "?lang=" + locale}>{article.title}</Link></h3>
                        <p>{article.excerpt}</p>
                        <Link href={"/actualites/" + article.slug + "?lang=" + locale}>{copy.read} <span aria-hidden="true">→</span></Link>
                      </div>
                    </article>
                  ))}
                </div>
                <Link className="newsArchiveLink" href={"/actualites?lang=" + locale}>{copy.allNews} <span aria-hidden="true">→</span></Link>
              </div>
            ) : <p className="newsEmpty">{copy.noNews}</p>}
          </div>
        </section>
      )}
      <section className="midCta sectionShell">
        <div><p>{valueAdded.label}</p><h2>{valueAdded.text}</h2></div>
        <Link className="roundArrow" href={anchor("contact")} aria-label={copy.conversation}><span aria-hidden="true">↘</span></Link>
      </section>

      {trustedOrganizations.enabled && (
        <section className="organizationsSection" id="organisations">
          <div className="sectionShell organizationsInner">
            <div className="organizationsIntro">
              <p className="eyebrow"><span /> {trustedOrganizations.eyebrow}</p>
              <h2>{trustedOrganizations.title}</h2>
              <p>{trustedOrganizations.intro}</p>
            </div>
            <OrganizationSlider
              items={trustedOrganizations.items}
              previousLabel={locale === "en" ? "Previous organization" : "Organisation précédente"}
              nextLabel={locale === "en" ? "Next organization" : "Organisation suivante"}
              visitLabel={locale === "en" ? "Visit website" : "Visiter le site"}
            />
          </div>
        </section>
      )}

      <section className="contactSection sectionShell" id="contact">
        <div className="contactCopy">
          <p className="eyebrow"><span /> {contact.eyebrow}</p>
          <h2>{contact.title}</h2>
          <p>{contact.intro}</p>
          <div className="directContact"><span>{copy.directContact}</span><a href={"mailto:" + contact.email}>{contact.email}</a><small>{contact.location}</small></div>
        </div>
        <ContactForm email={contact.email} expertiseOptions={expertises.map((item) => item.title)} locale={locale} />
      </section>

      <footer className="siteFooter">
        <div className="sectionShell footerInner">
          <div className="footerBrand"><span className="brandLogoFrame"><Image src="/images/Logo_SEImpact-01.png" alt={brand.name} fill unoptimized sizes="150px" /></span><small>{copy.footerTagline}</small></div>
          <div className="footerLinks">
            <Link href={anchor("sei")}>{copy.cabinet}</Link>
            <Link href={anchor("expertises")}>{copy.expertise}</Link>
            <Link href={anchor("approche")}>{copy.approach}</Link>
            {PROJECTS_NEWS_ENABLED && <Link href={`/projets?lang=${locale}`}>{locale === "en" ? "Projects" : "Projets"}</Link>}
            {PROJECTS_NEWS_ENABLED && <Link href={"/actualites?lang=" + locale}>{copy.news}</Link>}
            <Link href={anchor("contact")}>Contact</Link>
          </div>
          <p>© {new Date().getFullYear()} {brand.name}</p>
        </div>
      </footer>
    </main>
  );
}
