import { redirect } from "next/navigation";
import { AdminDashboard } from "@/app/admin/admin-dashboard";
import { readAdminSession } from "@/lib/admin-auth";
import { getAllNewsArticles } from "@/lib/news";
import { getAllProjects } from "@/lib/projects";
import { getSiteContent } from "@/lib/site-content";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await readAdminSession();
  if (!session) redirect("/admin/connexion");

  const [contentFr, contentEn, articles, projects] = await Promise.all([
    getSiteContent("fr"),
    getSiteContent("en"),
    getAllNewsArticles(),
    getAllProjects(),
  ]);
  return (
    <main className="adminShell">
      <header className="adminHeader">
        <div>
          <p className="adminEyebrow">Administration SEI</p>
          <h1>Contenu du site</h1>
          <p>Modifiez les textes ci-dessous, puis enregistrez pour les publier.</p>
        </div>
        <div className="adminAccount">
          <span>Connecté : {session.username}</span>
          <a href="/" target="_blank">Voir le site ↗</a>
          <form action="/api/admin/logout" method="post">
            <button type="submit">Se déconnecter</button>
          </form>
        </div>
      </header>
      <AdminDashboard
        initialContentFr={contentFr}
        initialContentEn={contentEn}
        initialArticles={articles}
        initialProjects={projects}
      />
    </main>
  );
}
