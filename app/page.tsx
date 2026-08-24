import Image from "next/image";
import { ContactForm } from "@/app/contact-form";
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

const approachIcons = [
  <svg key="capacity" width="30" height="30" viewBox="0 0 32 32" fill="none" aria-hidden="true">
    <path d="M16 9c-2.6-1.7-5.8-2.3-9-1.8v15.2c3.2-.5 6.4.1 9 1.8 2.6-1.7 5.8-2.3 9-1.8V7.2c-3.2-.5-6.4.1-9 1.8Z" fill="var(--forest)" />
    <path d="M16 9v15.2" stroke="white" strokeWidth="1.2" strokeLinecap="round" opacity=".4" />
    <path d="M23 4.3c2 .4 3.3 2.3 2.9 4.3-.3 1.5-1.4 2.6-2.8 3 .6-1.8.2-3.9-1.2-5.3.3-.9.8-1.6 1.1-2Z" fill="var(--ochre)" />
    <circle cx="26.6" cy="12.6" r="1.6" fill="var(--teal)" />
    <path d="M24.7 10.6l1.1 1.2" stroke="var(--teal)" strokeWidth="1" strokeLinecap="round" />
  </svg>,
  <svg key="events" width="30" height="30" viewBox="0 0 32 32" fill="none" aria-hidden="true">
    <circle cx="14" cy="16" r="8.5" fill="var(--forest)" />
    <path d="M14 7.5c2.3 2.3 2.3 14.7 0 17M8.2 16h11.6M9 11h10M9 21h10" stroke="white" strokeWidth="1" strokeLinecap="round" opacity=".4" />
    <rect x="20" y="5" width="10" height="7" rx="3.5" fill="var(--ochre)" />
    <path d="M22 11.2 21 14 24.2 11.5Z" fill="var(--ochre)" />
    <rect x="2" y="21" width="8" height="6" rx="3" fill="var(--teal)" />
    <path d="M3.4 26.5 3 28.5 5.6 26.7Z" fill="var(--teal)" />
  </svg>,
];

export default async function Home({ searchParams }: { searchParams: Promise<{ lang?: string }> }) {
  const query = await searchParams;
  const locale = normaliseLocale(query.lang);
  const english = locale === "en";
  const content = await getSiteContent(locale);
  const { brand, identity, founder, hero, expertiseIntro, expertises, approach, contact } = content;
  const { knowUs } = identity;
  const impactLabel = english ? "Expected impact" : "Impact recherché";
  const domainGalleryHeading = english
    ? "Natural capital and territorial resilience at the heart of our interventions"
    : "Le capital naturel et la résilience des territoires au cœur de nos interventions";

  return (
    <main className="homePage">
      <PageInteractions backToTopLabel={english ? "Back to top" : "Retour en haut"} />
      <PublicHeader
        locale={locale}
        active="sei"
        ctaLabel={hero.primaryAction}
        languageHrefFr="/?lang=fr"
        languageHrefEn="/?lang=en"
      />

      <section id="nous-connaitre" className="hero sectionShell">
        <div className="heroCopy heroIntro">
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
        <h3 className="domainGalleryHeading">{domainGalleryHeading}</h3>
        <DomainCards
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
            <p className="approachSubtitle">{expertiseIntro.title}</p>
            <p className="approachLead">{approach.lead}</p>
          </div>
          <div className="approachGrid">
            {approach.items.map((step, index) => (
              <article key={step.title}>
                <span className="approachIcon">{approachIcons[index]}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </article>
            ))}
          </div>
          <div className="approachClosing">
            <h3>{approach.closingTitle}</h3>
            <p>{approach.closingText}</p>
            <Image
              className="approachClosingImage"
              src="/images/objectifs-developpement-durable.png"
              alt={english ? "United Nations Sustainable Development Goals" : "Objectifs de développement durable des Nations unies"}
              width={2482}
              height={1755}
              unoptimized
            />
          </div>
        </div>
      </section>

      <section className="contactSection sectionShell" id="contact">
        <div className="contactCopy">
          <p className="eyebrow">
            <span /> {contact.eyebrow}
          </p>
          <h2>{contact.title}</h2>
          <p>{contact.intro}</p>
          <div className="directContact">
            <span>{english ? "Direct contact" : "Contact direct"}</span>
            <a href={"mailto:" + contact.email}>{contact.email}</a>
            <small>{contact.address}</small>
            <small>{contact.location}</small>
          </div>
        </div>
        <ContactForm
          email={contact.email}
          expertiseOptions={expertises.map((item) => item.title)}
          locale={locale}
        />
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
