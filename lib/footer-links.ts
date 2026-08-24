import type { FooterLinkGroup } from "@/app/site-footer";
import { PROJECTS_NEWS_ENABLED } from "@/lib/feature-flags";
import type { Locale, SiteContent } from "@/lib/site-content";

export function getFooterLinkGroups(locale: Locale, content: SiteContent): FooterLinkGroup[] {
  const english = locale === "en";
  const { identity } = content;

  return [
    {
      title: english ? "The firm" : "Le cabinet",
      links: [
        { href: `/?lang=${locale}`, label: english ? "Who we are" : "Qui sommes-nous" },
        { href: `/?lang=${locale}#expertises`, label: english ? "Expertise" : "Expertises" },
        { href: `/?lang=${locale}#approche`, label: english ? "Know-how" : "Notre savoir-faire" },
        { href: `/?lang=${locale}#contact`, label: "Contact" },
      ],
    },
    {
      title: english ? "Discover" : "Découvrir",
      links: [
        { href: `/notre-histoire?lang=${locale}`, label: identity.history.title },
        { href: `/notre-histoire?lang=${locale}#nos-valeurs`, label: identity.values.title },
        { href: `/notre-histoire?lang=${locale}#notre-vision`, label: identity.vision.title },
      ],
    },
    ...(PROJECTS_NEWS_ENABLED
      ? [
          {
            title: english ? "Resources" : "Ressources",
            links: [
              { href: `/actualites?lang=${locale}`, label: english ? "News" : "Actualités" },
              { href: `/projets?lang=${locale}`, label: english ? "Projects" : "Projets" },
            ],
          },
        ]
      : []),
  ];
}
