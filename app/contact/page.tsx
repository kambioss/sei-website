import { ContactForm } from "@/app/contact-form";
import { PageInteractions } from "@/app/page-interactions";
import { PublicHeader } from "@/app/public-header";
import { SiteFooter } from "@/app/site-footer";
import { getFooterLinkGroups } from "@/lib/footer-links";
import { getSiteContent, normaliseLocale } from "@/lib/site-content";

export const dynamic = "force-dynamic";

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ lang?: string }> }) {
  const query = await searchParams;
  const locale = normaliseLocale(query.lang);
  const content = await getSiteContent(locale);

  return (
    <main className="contactPage" lang={locale}>
      <PageInteractions />
      <PublicHeader
        locale={locale}
        ctaLabel={content.hero.primaryAction}
        languageHrefFr="/contact?lang=fr"
        languageHrefEn="/contact?lang=en"
      />
      <section className="contactPageSection sectionShell">
        <ContactForm
          expertiseOptions={content.expertises.map((item) => item.title)}
          locale={locale}
        />
      </section>
      <SiteFooter
        brandName={content.brand.name}
        address={content.contact.address}
        linkGroups={getFooterLinkGroups(locale, content)}
        locale={locale}
      />
    </main>
  );
}
