"use client";

import Image from "next/image";
import { useState } from "react";
import type { AdminProject } from "@/lib/projects";
import type { Locale } from "@/lib/site-content";

type EditableProject = Omit<AdminProject, "createdAt" | "updatedAt">;

function emptyProject(): EditableProject {
  return {
    id: 0, slug: "", titleFr: "", titleEn: "", excerptFr: "", excerptEn: "", bodyFr: "", bodyEn: "",
    coverImageUrl: "", coverAltFr: "", coverAltEn: "", publishedAt: new Date().toISOString().slice(0, 10), isPublished: true,
  };
}

export function ProjectManager({ initialProjects, locale }: { initialProjects: AdminProject[]; locale: Locale }) {
  const [project, setProject] = useState<EditableProject>(emptyProject());
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const english = locale === "en";

  function field<K extends keyof EditableProject>(key: K, value: EditableProject[K]) {
    setProject((current) => ({ ...current, [key]: value }));
  }

  async function uploadCover(file: File) {
    setUploading(true);
    setMessage("");
    try {
      const data = new FormData();
      data.set("image", file);
      const response = await fetch("/api/admin/media", { method: "POST", body: data });
      const result = await response.json().catch(() => ({})) as { url?: string; error?: string };
      if (!response.ok || !result.url) throw new Error(result.error || (english ? "Upload failed." : "Échec de l’envoi."));
      field("coverImageUrl", result.url);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : english ? "Upload failed." : "Échec de l’envoi.");
    } finally {
      setUploading(false);
    }
  }

  async function save() {
    setSaving(true);
    setMessage("");
    try {
      const response = await fetch("/api/admin/projects", {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...project, id: project.id || undefined }),
      });
      const result = await response.json().catch(() => ({})) as { error?: string };
      if (!response.ok) throw new Error(result.error || (english ? "Could not save the project." : "Échec de l’enregistrement."));
      window.location.reload();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : english ? "Could not save the project." : "Échec de l’enregistrement.");
      setSaving(false);
    }
  }

  async function remove(id: number) {
    if (!window.confirm(english ? "Permanently delete this project?" : "Supprimer définitivement ce projet ?")) return;
    const response = await fetch("/api/admin/projects?id=" + id, { method: "DELETE" });
    if (response.ok) window.location.reload();
    else setMessage(english ? "Could not delete the project." : "Suppression impossible.");
  }

  return (
    <section className="newsAdmin projectAdmin">
      <div className="newsAdminHeading">
        <div><p className="adminEyebrow">{english ? "Projects" : "Projets"}</p><h2>{english ? "Project pages" : "Fiches projets"}</h2><p>{english ? "Each published project has its own page and cover image." : "Chaque projet publié possède sa page descriptive et son image de couverture."}</p></div>
        <button type="button" className="adminSecondaryButton" onClick={() => setProject(emptyProject())}>{english ? "New project" : "Nouveau projet"}</button>
      </div>
      {initialProjects.length > 0 && <div className="newsAdminList">{initialProjects.map((item) => <article key={item.id}><div><strong>{item.titleFr}</strong><span>{item.isPublished ? (english ? "Published" : "Publié") : (english ? "Draft" : "Brouillon")} · {item.publishedAt.slice(0, 10)}</span></div><button type="button" onClick={() => setProject(item)}>{english ? "Edit" : "Modifier"}</button><button type="button" className="danger" onClick={() => remove(item.id)}>{english ? "Delete" : "Supprimer"}</button></article>)}</div>}
      <div className="newsAdminForm">
        <div className="newsFormGrid">
          <label><span>{english ? "French title" : "Titre français"}</span><input value={project.titleFr} onChange={(event) => field("titleFr", event.target.value)} /></label>
          <label><span>English title</span><input value={project.titleEn} onChange={(event) => field("titleEn", event.target.value)} /></label>
          <label><span>{english ? "French summary" : "Résumé français"}</span><textarea rows={4} value={project.excerptFr} onChange={(event) => field("excerptFr", event.target.value)} /></label>
          <label><span>English summary</span><textarea rows={4} value={project.excerptEn} onChange={(event) => field("excerptEn", event.target.value)} /></label>
          <label><span>{english ? "French full description" : "Description complète française"}</span><textarea rows={10} value={project.bodyFr} onChange={(event) => field("bodyFr", event.target.value)} /></label>
          <label><span>English full description</span><textarea rows={10} value={project.bodyEn} onChange={(event) => field("bodyEn", event.target.value)} /></label>
          <label><span>{english ? "Publication date" : "Date de publication"}</span><input type="date" value={project.publishedAt.slice(0, 10)} onChange={(event) => field("publishedAt", event.target.value)} /></label>
          <label><span>{english ? "Project URL (optional)" : "Adresse du projet (facultatif)"}</span><input value={project.slug} onChange={(event) => field("slug", event.target.value)} /></label>
          <label className="publishToggle"><input type="checkbox" checked={project.isPublished} onChange={(event) => field("isPublished", event.target.checked)} /><span>{english ? "Publish this project" : "Publier le projet"}</span></label>
        </div>
        <fieldset className="newsMediaFieldset">
          <legend>{english ? "Project cover image" : "Image de couverture du projet"}</legend>
          <input type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/avif" onChange={(event) => event.currentTarget.files?.[0] && void uploadCover(event.currentTarget.files[0])} />
          {project.coverImageUrl && <div className="newsCoverPreview"><Image src={project.coverImageUrl} alt="" fill unoptimized sizes="440px" /></div>}
          <div className="newsFormGrid">
            <label><span>{english ? "French image description" : "Description française de l’image"}</span><input value={project.coverAltFr} onChange={(event) => field("coverAltFr", event.target.value)} /></label>
            <label><span>English image description</span><input value={project.coverAltEn} onChange={(event) => field("coverAltEn", event.target.value)} /></label>
          </div>
        </fieldset>
        {message && <p className="newsAdminMessage" role="alert">{message}</p>}
        <button type="button" className="newsSaveButton" onClick={save} disabled={saving || uploading}>{uploading ? (english ? "Uploading image…" : "Envoi de l’image…") : saving ? (english ? "Saving…" : "Enregistrement…") : project.id ? (english ? "Update project" : "Mettre à jour le projet") : (english ? "Create project" : "Créer le projet")}</button>
      </div>
    </section>
  );
}
