import Image from "next/image";
import { ContactForm } from "@/app/contact-form";
import { DomainCards } from "@/app/domain-cards";
import { PageInteractions } from "@/app/page-interactions";
import { PublicHeader } from "@/app/public-header";
import { SiteFooter } from "@/app/site-footer";
import { PROJECTS_NEWS_ENABLED } from "@/lib/feature-flags";
import { getSiteContent, normaliseLocale } from "@/lib/site-content";

export const dynamic = "force-dynamic";

const domainImages = [
  "/images/beautiful-scenery-lone-tree-middle-empty-field-grey-cloudy-sky.jpg",
  "/images/extra-long-shot-peaceful-landscape-with-trees.jpg",
  "/images/sei-territoires.webp",
];

const approachIcons = [
  <svg key="capacity" width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M12 6.5c-1.8-1.3-4.2-1.8-6.5-1.3v12c2.3-.5 4.7 0 6.5 1.3 1.8-1.3 4.2-1.8 6.5-1.3v-12c-2.3-.5-4.7 0-6.5 1.3Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    <path d="M12 6.5v12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>,
  <svg key="events" width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="9" y="3" width="6" height="10" rx="3" stroke="currentColor" strokeWidth="1.6" />
    <path d="M5.5 11a6.5 6.5 0 0 0 13 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M12 17.5V21M8.5 21h7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>,
];

export default async function Home({ searchParams }: { searchParams: Promise<{ lang?: string }> }) {
  const query = await searchParams;
  const locale = normaliseLocale(query.lang);
  const english = locale === "en";
  const content = await getSiteContent(locale);
  const { brand, identity, founder, hero, expertiseIntro, expertises, approach, capabilities, contact } = content;
  const { knowUs, history, values, vision } = identity;
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

      <section className="capabilitiesSection">
        <div className="sectionShell capabilitiesGrid">
          <div>
            <h2>{capabilities.title}</h2>
            <p className="capabilitiesLead">{capabilities.lead}</p>
          </div>
          <ul>
            {capabilities.items.filter((item) => item.title.trim().length > 0).map((item, index) => (
              <li key={item.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="approachSection" id="approche">
        <div className="sectionShell">
          <div className="approachIntro">
            <p className="eyebrow light"><span /> {approach.eyebrow}</p>
            <h2>{approach.title}</h2>
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
        tagline={english ? "Consulting · Strategy · Impact" : "Conseil · Stratégie · Impact"}
        links={[
          { href: `/?lang=${locale}`, label: english ? "About us" : "Le cabinet" },
          { href: `/?lang=${locale}#expertises`, label: english ? "Expertise" : "Expertises" },
          { href: `/?lang=${locale}#approche`, label: english ? "Approach" : "Approche" },
          { href: `/notre-histoire?lang=${locale}`, label: history.title },
          { href: `/nos-valeurs?lang=${locale}`, label: values.title },
          { href: `/notre-vision?lang=${locale}`, label: vision.title },
          ...(PROJECTS_NEWS_ENABLED
            ? [{ href: `/actualites?lang=${locale}`, label: english ? "News" : "Actualités" }]
            : []),
          { href: `/?lang=${locale}#contact`, label: "Contact" },
        ]}
      />
    </main>
  );
}
