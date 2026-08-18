import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PublicHeader } from "@/app/public-header";
import { getPublishedProjectBySlug } from "@/lib/projects";
import { getSiteContent, normaliseLocale } from "@/lib/site-content";

export const dynamic = "force-dynamic";

export default async function ProjectPage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ lang?: string }> }) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const locale = normaliseLocale(query.lang);
  const english = locale === "en";
  const [project, content] = await Promise.all([getPublishedProjectBySlug(slug, locale), getSiteContent(locale)]);
  if (!project) notFound();

  return (
    <main className="projectDetailPage">
      <PublicHeader
        locale={locale}
        active="projets"
        ctaLabel={content.hero.primaryAction}
        languageHrefFr={`/projets/${slug}?lang=fr`}
        languageHrefEn={`/projets/${slug}?lang=en`}
      />
      <article>
        <div className="projectDetailHero sectionShell">
          <div className="projectDetailCopy">
            <Link href={`/projets?lang=${locale}`}>← {english ? "Back to projects" : "Retour aux projets"}</Link>
            <p>{content.projects.eyebrow}</p>
            <h1>{project.title}</h1>
            <div className="projectDetailMeta"><time dateTime={project.publishedAt}>{new Intl.DateTimeFormat(english ? "en-GB" : "fr-FR", { dateStyle: "long" }).format(new Date(project.publishedAt))}</time></div>
            <p className="projectDetailLead">{project.excerpt}</p>
          </div>
          <figure className="projectDetailCover">
            <Image src={project.coverImageUrl} alt={project.coverAlt} fill priority unoptimized sizes="(max-width: 900px) 100vw, 50vw" />
            <figcaption>{project.coverAlt}</figcaption>
          </figure>
        </div>
        <div className="projectDetailBody sectionShell">
          <p className="eyebrow"><span /> {english ? "Project description" : "Description du projet"}</p>
          {project.body.split(/\n{2,}/).map((paragraph, index) => <p key={index}>{paragraph}</p>)}
        </div>
      </article>
    </main>
  );
}
