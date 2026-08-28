import Link from "next/link";
import type { Locale } from "@/lib/site-content";

export type FooterLink = { href: string; label: string };
export type FooterLinkGroup = { title: string; links: FooterLink[] };

export function SiteFooter({
  brandName,
  descriptor,
  linkGroups,
  locale,
}: {
  brandName: string;
  descriptor: string;
  linkGroups: FooterLinkGroup[];
  locale: Locale;
}) {
  const english = locale === "en";
  return (
    <footer className="siteFooter">
      <div className="sectionShell footerCallout">
        <div>
          <p>{english ? "From ambition to impact" : "De l’ambition à l’impact"}</p>
          <h2>{english ? "Let’s build resilient territories together." : "Construisons ensemble des territoires résilients."}</h2>
        </div>
        <Link href={`/?lang=${locale}#contact`}>
          {english ? "Discuss your project" : "Parlons de votre projet"} <span aria-hidden="true">↗</span>
        </Link>
      </div>
      <div className="sectionShell footerTop">
        <div className="footerBrand">
          <p className="footerLegalTitle">{english ? "Legal information" : "Informations légales"}</p>
          <ul className="footerLegal">
            <li>{english ? "Legal form" : "Forme juridique"} : <b>SUARL</b></li>
            <li>RC/JORT : <b>202484600</b></li>
            <li>MF : <b>1880009N</b></li>
          </ul>
          <p className="footerDescriptor">{descriptor}</p>
          <p className="footerTagline">{english ? "Expertise rooted in African territories." : "Une expertise ancrée dans les territoires africains."}</p>
        </div>
        <nav className="footerNav" aria-label="Footer">
          {linkGroups.map((group) => (
            <div className="footerNavGroup" key={group.title}>
              <h3>{group.title}</h3>
              <ul>
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
        <div className="footerContact">
          <p>{english ? "Contact" : "Nous contacter"}</p>
          <a href="mailto:contact@se-impact.com">contact@se-impact.com</a>
          <span>Tunis · {english ? "Africa & international assignments" : "Afrique & missions internationales"}</span>
        </div>
      </div>
      <div className="sectionShell footerBottom">
        <p>© {new Date().getFullYear()} {brandName}</p>
        <p>{english ? "Sustainable solutions. Measurable impact." : "Solutions durables. Impact mesurable."}</p>
      </div>
    </footer>
  );
}
