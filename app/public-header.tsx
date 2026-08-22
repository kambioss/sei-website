import Image from "next/image";
import Link from "next/link";
import { PROJECTS_NEWS_ENABLED } from "@/lib/feature-flags";
import type { Locale } from "@/lib/site-content";

export type PublicNavSection = "sei" | "expertises" | "approche" | "projets" | "actualites";

type PublicHeaderProps = {
  locale: Locale;
  active?: PublicNavSection;
  ctaLabel: string;
  languageHrefFr: string;
  languageHrefEn: string;
};

export function PublicHeader({ locale, active, ctaLabel, languageHrefFr, languageHrefEn }: PublicHeaderProps) {
  const english = locale === "en";
  const homeAnchor = (id: string) => `/?lang=${locale}#${id}`;
  const aboutAnchor = (id: string) => `/qui-sommes-nous?lang=${locale}#${id}`;
  const aboutSubItems = [
    { id: "nous-connaitre", label: english ? "Get to know us" : "Nous connaître" },
    { id: "notre-histoire", label: english ? "Our history" : "Notre histoire" },
    { id: "nos-valeurs", label: english ? "Our values" : "Nos valeurs" },
    { id: "notre-vision", label: english ? "Our vision" : "Notre vision" },
  ];
  const links: Array<{ section: PublicNavSection; label: string; href: string }> = [
    { section: "sei", label: english ? "Who we are" : "Qui sommes-nous", href: `/qui-sommes-nous?lang=${locale}` },
    { section: "expertises", label: english ? "Our expertise" : "Notre expertise", href: homeAnchor("expertises") },
    { section: "approche", label: english ? "Knowledge" : "Notre savoir-faire", href: homeAnchor("approche") },
    ...(PROJECTS_NEWS_ENABLED
      ? [
          { section: "projets" as const, label: english ? "Projects" : "Projets", href: `/projets?lang=${locale}` },
          { section: "actualites" as const, label: english ? "News" : "Actualités", href: `/actualites?lang=${locale}` },
        ]
      : []),
  ];

  return (
    <header className="siteHeader">
      <Link className="brand" href={homeAnchor("accueil")} aria-label="Social & Eco Impact">
        <span className="brandLogoFrame"><Image src="/images/Logo_SEImpact-01.png" alt="" fill priority unoptimized sizes="160px" /></span>
        <span className="brandName">
          <span className="brandNameTop">Social &amp; Eco</span>
          <span className="brandNameBottom">
            {"Impact".split("").map((letter, index) => (
              <span key={index}>{letter}</span>
            ))}
          </span>
        </span>
      </Link>
      <nav className="desktopNav" aria-label={english ? "Main navigation" : "Navigation principale"}>
        {links.map((link) =>
          link.section === "sei" ? (
            <div className="navItem" key={link.section}>
              <Link
                className={active === link.section ? "active" : undefined}
                data-nav-section={link.section}
                aria-current={active === link.section ? "page" : undefined}
                href={link.href}
              >
                {link.label}
              </Link>
              <div className="navDropdown">
                {aboutSubItems.map((item) => (
                  <Link key={item.id} href={aboutAnchor(item.id)}>{item.label}</Link>
                ))}
              </div>
            </div>
          ) : (
            <Link
              key={link.section}
              className={active === link.section ? "active" : undefined}
              data-nav-section={link.section}
              aria-current={active === link.section ? "page" : undefined}
              href={link.href}
            >
              {link.label}
            </Link>
          ),
        )}
        <div className="languageSwitch">
          <Link className={locale === "fr" ? "active" : ""} href={languageHrefFr}>FR</Link>
          <Link className={locale === "en" ? "active" : ""} href={languageHrefEn}>EN</Link>
        </div>
        <Link className="navCta" href={homeAnchor("contact")}>{ctaLabel} <span aria-hidden="true">↗</span></Link>
      </nav>
      <details className="mobileMenu">
        <summary aria-label={english ? "Menu" : "Menu"}>{english ? "Menu" : "Menu"}</summary>
        <div>
          {links.map((link) => (
            <div className="mobileNavGroup" key={link.section}>
              <Link
                className={active === link.section ? "active" : undefined}
                data-nav-section={link.section}
                aria-current={active === link.section ? "page" : undefined}
                href={link.href}
              >
                {link.label}
              </Link>
              {link.section === "sei" && (
                <div className="mobileSubLinks">
                  {aboutSubItems.map((item) => (
                    <Link key={item.id} href={aboutAnchor(item.id)}>{item.label}</Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          <span className="mobileLanguages"><Link href={languageHrefFr}>FR</Link><Link href={languageHrefEn}>EN</Link></span>
          <Link href={homeAnchor("contact")}>{ctaLabel}</Link>
        </div>
      </details>
    </header>
  );
}
