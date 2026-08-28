import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { PageInteractions } from "@/app/page-interactions";
import { PublicHeader } from "@/app/public-header";
import { SiteFooter } from "@/app/site-footer";
import { PROJECTS_NEWS_ENABLED } from "@/lib/feature-flags";
import { getFooterLinkGroups } from "@/lib/footer-links";
import { getPublishedProjects } from "@/lib/projects";
import { getSiteContent, normaliseLocale } from "@/lib/site-content";

export const dynamic = "force-dynamic";

export default async function ProjectsPage({ searchParams }: { searchParams: Promise<{ lang?: string }> }) {
  const query = await searchParams;
  const locale = normaliseLocale(query.lang);
  if (!PROJECTS_NEWS_ENABLED) redirect(`/?lang=${locale}`);
  const english = locale === "en";
  const [content, projects] = await Promise.all([getSiteContent(locale), getPublishedProjects(locale)]);

  return (
    <main className="projectsArchivePage" lang={locale}>
      <PageInteractions />
      <PublicHeader locale={locale} active="projets" ctaLabel={content.hero.primaryAction} languageHrefFr="/projets?lang=fr" languageHrefEn="/projets?lang=en" />
      <section className="projectsArchive sectionShell">
        <div className="projectsArchiveIntro">
          <p className="eyebrow"><span /> {content.projects.eyebrow}</p>
          <h1>{content.projects.title}</h1>
          <p>{content.projects.intro}</p>
        </div>
        {projects.length ? (
          <div className="projectArchiveGrid">
            {projects.map((project, index) => (
              <article className="projectCard" key={project.id}>
                <Link className="projectCardImage" href={`/projets/${project.slug}?lang=${locale}`}>
                  <Image src={project.coverImageUrl} alt={project.coverAlt} fill unoptimized sizes="(max-width: 760px) 100vw, 50vw" />
                  <span>{String(index + 1).padStart(2, "0")}</span>
                </Link>
                <div className="projectCardCopy">
                  <time dateTime={project.publishedAt}>{new Intl.DateTimeFormat(english ? "en-GB" : "fr-FR", { year: "numeric", month: "long" }).format(new Date(project.publishedAt))}</time>
                  <h2><Link href={`/projets/${project.slug}?lang=${locale}`}>{project.title}</Link></h2>
                  <p>{project.excerpt}</p>
                  <Link href={`/projets/${project.slug}?lang=${locale}`}>{english ? "View project" : "Voir le projet"} <span aria-hidden="true">→</span></Link>
                </div>
              </article>
            ))}
          </div>
        ) : <p className="newsEmpty">{english ? "Projects will be published soon." : "Les premiers projets seront publiés prochainement."}</p>}
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
