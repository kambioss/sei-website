import Image from "next/image";
import Link from "next/link";

export type FooterLink = { href: string; label: string };

export function SiteFooter({
  brandName,
  tagline,
  links,
}: {
  brandName: string;
  tagline: string;
  links: FooterLink[];
}) {
  return (
    <footer className="siteFooter">
      <div className="sectionShell footerInner">
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
          <small>{tagline}</small>
        </div>
        <div className="footerLinks">
          {links.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </div>
        <p>
          © {new Date().getFullYear()} {brandName}
        </p>
      </div>
    </footer>
  );
}
