import Image from "next/image";
import Link from "next/link";

export type FooterLink = { href: string; label: string };
export type FooterLinkGroup = { title: string; links: FooterLink[] };

export function SiteFooter({
  brandName,
  descriptor,
  linkGroups,
}: {
  brandName: string;
  descriptor: string;
  linkGroups: FooterLinkGroup[];
}) {
  return (
    <footer className="siteFooter">
      <div className="sectionShell footerTop">
        <div className="footerBrand">
          <span className="brandLogoFrame">
            <Image
              src="/images/Logo_SEImpact-01.png"
              alt={brandName}
              fill
              unoptimized
              sizes="150px"
            />
          </span>
          <p className="footerDescriptor">{descriptor}</p>
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
      </div>
      <div className="sectionShell footerBottom">
        <p>© {new Date().getFullYear()} {brandName}</p>
      </div>
    </footer>
  );
}
