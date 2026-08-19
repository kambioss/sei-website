"use client";

import { useState } from "react";
import { ContentEditor, adminSectionLabels } from "@/app/admin/content-editor";
import { NewsManager } from "@/app/admin/news-manager";
import { ProjectManager } from "@/app/admin/project-manager";
import { PROJECTS_NEWS_ENABLED } from "@/lib/feature-flags";
import type { AdminNewsArticle } from "@/lib/news";
import type { AdminProject } from "@/lib/projects";
import type { Locale, SiteContent } from "@/lib/site-content";

type AdminArea = keyof SiteContent | "news" | "projectEntries";

type AdminDashboardProps = {
  initialContentFr: SiteContent;
  initialContentEn: SiteContent;
  initialArticles: AdminNewsArticle[];
  initialProjects: AdminProject[];
};

const copy = {
  fr: {
    navigation: "Navigation de l’administration",
    content: "Contenu du site",
    publication: "Publication",
    news: "Actualités",
    projects: "Fiches projets",
    language: "Langue de travail",
    editing: "Édition en français",
    disabledHint: "Désactivé en attendant l’ajout de contenu",
  },
  en: {
    navigation: "Administration navigation",
    content: "Website content",
    publication: "Publishing",
    news: "News",
    projects: "Project pages",
    language: "Working language",
    editing: "Editing in English",
    disabledHint: "Disabled until content is added",
  },
} as const;

export function AdminDashboard({ initialContentFr, initialContentEn, initialArticles, initialProjects }: AdminDashboardProps) {
  const [locale, setLocale] = useState<Locale>("fr");
  const [activeArea, setActiveArea] = useState<AdminArea>("hero");
  const labels = adminSectionLabels[locale];
  const ui = copy[locale];
  const sectionKeys = Object.keys(initialContentFr) as Array<keyof SiteContent>;

  return (
    <div className="adminDashboard">
      <aside className="adminSidebar">
        <div className="adminSidebarInner">
          <div className="adminLocaleControl" aria-label={ui.language}>
            <span>{ui.language}</span>
            <div>
              <button type="button" className={locale === "fr" ? "active" : ""} onClick={() => setLocale("fr")}>FR</button>
              <button type="button" className={locale === "en" ? "active" : ""} onClick={() => setLocale("en")}>EN</button>
            </div>
            <small>{ui.editing}</small>
          </div>

          <nav aria-label={ui.navigation}>
            <p>{ui.content}</p>
            {sectionKeys.map((key, index) => (
              <button
                type="button"
                className={activeArea === key ? "active" : ""}
                key={key}
                onClick={() => setActiveArea(key)}
              >
                <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                {labels[key] ?? key}
              </button>
            ))}
            <p>{ui.publication}</p>
            <button
              type="button"
              className={activeArea === "news" ? "active" : ""}
              onClick={() => setActiveArea("news")}
              disabled={!PROJECTS_NEWS_ENABLED}
              title={PROJECTS_NEWS_ENABLED ? undefined : ui.disabledHint}
            >
              <span aria-hidden="true">＋</span>
              {ui.news}
            </button>
            <button
              type="button"
              className={activeArea === "projectEntries" ? "active" : ""}
              onClick={() => setActiveArea("projectEntries")}
              disabled={!PROJECTS_NEWS_ENABLED}
              title={PROJECTS_NEWS_ENABLED ? undefined : ui.disabledHint}
            >
              <span aria-hidden="true">＋</span>
              {ui.projects}
            </button>
          </nav>
        </div>
      </aside>

      <div className="adminWorkspace">
        {activeArea === "news" ? (
          <NewsManager initialArticles={initialArticles} locale={locale} />
        ) : activeArea === "projectEntries" ? (
          <ProjectManager initialProjects={initialProjects} locale={locale} />
        ) : (
          <ContentEditor
            initialContentFr={initialContentFr}
            initialContentEn={initialContentEn}
            locale={locale}
            activeSection={activeArea}
          />
        )}
      </div>
    </div>
  );
}
