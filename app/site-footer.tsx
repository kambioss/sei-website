import Link from "next/link";
import type { Locale } from "@/lib/site-content";

export type FooterLink = { href: string; label: string; newTab?: boolean };
export type FooterLinkGroup = { title: string; links: FooterLink[] };

export function SiteFooter({
  brandName,
  address,
  linkGroups,
  locale,
}: {
  brandName: string;
  address: string;
  linkGroups: FooterLinkGroup[];
  locale: Locale;
}) {
  const english = locale === "en";
  return (
    <footer className="siteFooter">
      <div className="sectionShell footerTop">
        <div className="footerBrand">
          <div className="footerLegalCard">
            <p className="footerLegalTitle">{english ? "Legal information" : "Informations légales"}</p>
            <dl className="footerLegalList">
              <div>
                <dt>{english ? "Legal form" : "Forme juridique"}</dt>
                <dd>SUARL</dd>
              </div>
              <div>
                <dt>RC/JORT</dt>
                <dd>202484600</dd>
              </div>
              <div>
                <dt>MF</dt>
                <dd>1880009N</dd>
              </div>
            </dl>
          </div>
        </div>
        <nav className="footerNav" aria-label="Footer">
          {linkGroups.map((group) => (
            <div className="footerNavGroup" key={group.title}>
              <h3>{group.title}</h3>
              <ul>
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} target={link.newTab ? "_blank" : undefined} rel={link.newTab ? "noopener noreferrer" : undefined}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
        <div className="footerContact">
          <p>{english ? "Address" : "Adresse"}</p>
          <a href="mailto:contact@se-impact.com">contact@se-impact.com</a>
          <span>{address}</span>
          <span>{english ? "Africa & international assignments" : "Afrique & missions internationales"}</span>
        </div>
      </div>
      <div className="sectionShell footerBottom">
        <p>© {new Date().getFullYear()} {brandName}. {english ? "All rights reserved." : "Tous droits réservés."}</p>
      </div>
    </footer>
  );
}
