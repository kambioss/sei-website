"use client";

import Image from "next/image";
import { useState } from "react";
import type { AdminNewsArticle, NewsGalleryImage } from "@/lib/news";
import type { Locale } from "@/lib/site-content";

type EditableArticle = Omit<AdminNewsArticle, "createdAt" | "updatedAt">;

function emptyArticle(): EditableArticle {
  return {
    id: 0,
    slug: "",
    titleFr: "",
    titleEn: "",
    excerptFr: "",
    excerptEn: "",
    bodyFr: "",
    bodyEn: "",
    coverImageUrl: "",
    coverAltFr: "",
    coverAltEn: "",
    publishedAt: new Date().toISOString().slice(0, 10),
    isPublished: true,
    gallery: [],
  };
}

export function NewsManager({ initialArticles, locale }: { initialArticles: AdminNewsArticle[]; locale: Locale }) {
  const [article, setArticle] = useState<EditableArticle>(emptyArticle());
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const english = locale === "en";

  function field<K extends keyof EditableArticle>(key: K, value: EditableArticle[K]) {
    setArticle((current) => ({ ...current, [key]: value }));
  }

  async function upload(file: File): Promise<string> {
    const data = new FormData();
    data.set("image", file);
    const response = await fetch("/api/admin/media", { method: "POST", body: data });
    const result = await response.json().catch(() => ({})) as { url?: string; error?: string };
    if (!response.ok || !result.url) throw new Error(result.error || (english ? "Upload failed." : "Échec de l’envoi."));
    return result.url;
  }

  async function uploadCover(file: File) {
    setUploading(true);
    setMessage("");
    try {
      field("coverImageUrl", await upload(file));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : english ? "Upload failed." : "Échec de l’envoi.");
    } finally {
      setUploading(false);
    }
  }

  async function uploadGallery(files: File[]) {
    setUploading(true);
    setMessage("");
    const uploaded: string[] = [];
    const failed: string[] = [];

    try {
      // Large files are sent one at a time so a single invalid image does not
      // discard the other successful gallery uploads.
      for (const file of files) {
        try {
          uploaded.push(await upload(file));
        } catch {
          failed.push(file.name);
        }
      }

      if (uploaded.length) {
        setArticle((current) => ({
          ...current,
          gallery: [
            ...current.gallery,
            ...uploaded.map((url, index) => ({
              url,
              altFr: current.titleFr,
              altEn: current.titleEn,
              position: current.gallery.length + index,
            })),
          ],
        }));
      }

      if (failed.length) {
        setMessage(
          english
            ? `${failed.length} image(s) could not be uploaded: ${failed.join(", ")}`
            : `${failed.length} image(s) n’ont pas pu être envoyées : ${failed.join(", ")}`,
        );
      }
    } finally {
      setUploading(false);
    }
  }

  function updateGallery(index: number, values: Partial<NewsGalleryImage>) {
    setArticle((current) => ({
      ...current,
      gallery: current.gallery.map((image, imageIndex) =>
        imageIndex === index ? { ...image, ...values } : image,
      ),
    }));
  }

  async function save() {
    setSaving(true);
    setMessage("");
    try {
      const response = await fetch("/api/admin/news", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...article, id: article.id || undefined }),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error || (english ? "Could not save the article." : "Échec de l’enregistrement."));
      window.location.reload();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : english ? "Could not save the article." : "Échec de l’enregistrement.");
      setSaving(false);
    }
  }

  async function remove(id: number) {
    if (!window.confirm(english ? "Permanently delete this news article?" : "Supprimer définitivement cette actualité ?")) return;
    const response = await fetch("/api/admin/news?id=" + id, { method: "DELETE" });
    if (response.ok) window.location.reload();
    else {
      const result = (await response.json()) as { error?: string };
      setMessage(result.error || (english ? "Could not delete the article." : "Suppression impossible."));
    }
  }

  return (
    <section className="newsAdmin">
      <div className="newsAdminHeading">
        <div>
          <p className="adminEyebrow">{english ? "News" : "Actualités"}</p>
          <h2>{english ? "Articles and galleries" : "Articles et galeries"}</h2>
          <p>{english ? "Add a cover image, then the images displayed in the article gallery." : "Ajoutez la couverture, puis les images qui défileront dans l’article."}</p>
        </div>
        <button type="button" className="adminSecondaryButton" onClick={() => setArticle(emptyArticle())}>
          {english ? "New article" : "Nouvelle actualité"}
        </button>
      </div>

      {initialArticles.length > 0 && (
        <div className="newsAdminList">
          {initialArticles.map((item) => (
            <article key={item.id}>
              <div>
                <strong>{item.titleFr}</strong>
                <span>{item.isPublished ? (english ? "Published" : "Publiée") : (english ? "Draft" : "Brouillon")} · {item.publishedAt.slice(0, 10)}</span>
              </div>
              <button type="button" onClick={() => setArticle(item)}>{english ? "Edit" : "Modifier"}</button>
              <button type="button" className="danger" onClick={() => remove(item.id)}>{english ? "Delete" : "Supprimer"}</button>
            </article>
          ))}
        </div>
      )}

      <div className="newsAdminForm">
        <div className="newsFormGrid">
          <label><span>{english ? "French title" : "Titre français"}</span><input value={article.titleFr} onChange={(event) => field("titleFr", event.target.value)} /></label>
          <label><span>English title</span><input value={article.titleEn} onChange={(event) => field("titleEn", event.target.value)} /></label>
          <label><span>{english ? "French summary" : "Résumé français"}</span><textarea rows={3} value={article.excerptFr} onChange={(event) => field("excerptFr", event.target.value)} /></label>
          <label><span>English summary</span><textarea rows={3} value={article.excerptEn} onChange={(event) => field("excerptEn", event.target.value)} /></label>
          <label><span>{english ? "French content" : "Contenu français"}</span><textarea rows={8} value={article.bodyFr} onChange={(event) => field("bodyFr", event.target.value)} /></label>
          <label><span>English content</span><textarea rows={8} value={article.bodyEn} onChange={(event) => field("bodyEn", event.target.value)} /></label>
          <label><span>{english ? "Publication date" : "Date de publication"}</span><input type="date" value={article.publishedAt.slice(0, 10)} onChange={(event) => field("publishedAt", event.target.value)} /></label>
          <label><span>{english ? "Article URL (optional)" : "Adresse de l’article (facultatif)"}</span><input value={article.slug} placeholder={english ? "generated from the title" : "générée depuis le titre"} onChange={(event) => field("slug", event.target.value)} /></label>
          <label className="publishToggle"><input type="checkbox" checked={article.isPublished} onChange={(event) => field("isPublished", event.target.checked)} /><span>{english ? "Publish this article" : "Publier l’actualité"}</span></label>
        </div>

        <fieldset className="newsMediaFieldset">
          <legend>{english ? "Cover image" : "Image de couverture"}</legend>
          <input type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/avif" onChange={(event) => event.target.files?.[0] && uploadCover(event.target.files[0])} />
          {article.coverImageUrl && (
            <div className="newsCoverPreview"><Image src={article.coverImageUrl} alt="" fill unoptimized sizes="420px" /></div>
          )}
          <div className="newsFormGrid">
            <label><span>{english ? "French description" : "Description française"}</span><input value={article.coverAltFr} onChange={(event) => field("coverAltFr", event.target.value)} /></label>
            <label><span>English description</span><input value={article.coverAltEn} onChange={(event) => field("coverAltEn", event.target.value)} /></label>
          </div>
        </fieldset>

        <fieldset className="newsMediaFieldset">
          <legend>{english ? "Slideshow gallery" : "Galerie défilante"}</legend>
          <input
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
            onChange={(event) => {
              const input = event.currentTarget;
              const files = Array.from(input.files ?? []);
              input.value = "";
              if (files.length) void uploadGallery(files);
            }}
          />
          <div className="galleryAdminGrid">
            {article.gallery.map((image, index) => (
              <article key={image.url}>
                <div className="galleryAdminImage"><Image src={image.url} alt="" fill unoptimized sizes="220px" /></div>
                <label><span>Description FR</span><input value={image.altFr} onChange={(event) => updateGallery(index, { altFr: event.target.value })} /></label>
                <label><span>Description EN</span><input value={image.altEn} onChange={(event) => updateGallery(index, { altEn: event.target.value })} /></label>
                <button type="button" onClick={() => field("gallery", article.gallery.filter((_, itemIndex) => itemIndex !== index))}>{english ? "Remove" : "Retirer"}</button>
              </article>
            ))}
          </div>
        </fieldset>

        {message && <p className="newsAdminMessage" role="alert">{message}</p>}
        <button type="button" className="newsSaveButton" onClick={save} disabled={saving || uploading}>
          {uploading ? (english ? "Uploading images…" : "Envoi des images…") : saving ? (english ? "Saving…" : "Enregistrement…") : article.id ? (english ? "Update article" : "Mettre à jour l’actualité") : (english ? "Create article" : "Créer l’actualité")}
        </button>
      </div>
    </section>
  );
}
