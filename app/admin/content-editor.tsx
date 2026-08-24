"use client";

import { useState } from "react";
import type { Locale, SiteContent } from "@/lib/site-content";

type JsonObject = { [key: string]: JsonValue };
type JsonValue = string | boolean | JsonObject | JsonValue[];

const labelsFr: Record<string, string> = {
  brand: "Identité de marque",
  shortName: "Nom court",
  name: "Nom",
  descriptor: "Descriptif",
  hero: "Accueil",
  title: "Titre",
  statement: "Message principal",
  lead: "Texte d’introduction",
  primaryAction: "Bouton principal",
  secondaryAction: "Bouton secondaire",
  proofs: "Points forts",
  imageCaption: "Légende de l’image",
  audiences: "Publics accompagnés",
  founder: "Mot du fondateur",
  quote: "Citation",
  photo: "Photo",
  role: "Fonction / structure",
  identity: "Identité et positionnement",
  eyebrow: "Libellé de section",
  ambition: "Notre ambition",
  paragraphs: "Paragraphes",
  knowUs: "Nous connaître",
  history: "Notre histoire",
  values: "Nos valeurs",
  vision: "Notre vision",
  pillars: "Valeurs clés",
  heading: "Titre de la section",
  image: "Image",
  expertiseIntro: "Introduction des expertises",
  text: "Texte",
  expertises: "Domaines d’expertise",
  number: "Numéro",
  tone: "Couleur (green, ochre ou teal)",
  summary: "Présentation",
  interventions: "Interventions",
  impact: "Impact recherché",
  approach: "Notre savoir-faire",
  items: "Éléments",
  closingTitle: "Titre de conclusion",
  closingText: "Texte de conclusion",
  capabilities: "Compétences transversales",
  projects: "Projets",
  trustedOrganizations: "Organisations partenaires",
  enabled: "Afficher cette section sur le site",
  logoUrl: "Adresse du logo",
  link: "Lien vers l’organisation",
  description: "Présentation",
  valueAdded: "Valeur ajoutée",
  label: "Libellé",
  contact: "Contact et partenariats",
  intro: "Introduction",
  email: "Adresse e-mail",
  location: "Zone d’intervention",
  address: "Adresse postale",
};

const labelsEn: Record<string, string> = {
  brand: "Brand identity",
  shortName: "Short name",
  name: "Name",
  descriptor: "Descriptor",
  hero: "Home page",
  title: "Title",
  statement: "Main message",
  lead: "Introduction",
  primaryAction: "Primary button",
  secondaryAction: "Secondary button",
  proofs: "Key strengths",
  imageCaption: "Image caption",
  audiences: "Audiences supported",
  founder: "Founder's word",
  quote: "Quote",
  photo: "Photo",
  role: "Role / organisation",
  identity: "Identity and positioning",
  eyebrow: "Section label",
  ambition: "Our ambition",
  paragraphs: "Paragraphs",
  knowUs: "Get to know us",
  history: "Our history",
  values: "Our values",
  vision: "Our vision",
  pillars: "Key values",
  heading: "Section heading",
  image: "Image",
  expertiseIntro: "Expertise introduction",
  text: "Text",
  expertises: "Areas of expertise",
  number: "Number",
  tone: "Colour (green, ochre or teal)",
  summary: "Overview",
  interventions: "Services",
  impact: "Expected impact",
  approach: "Our know-how",
  items: "Items",
  closingTitle: "Closing title",
  closingText: "Closing text",
  capabilities: "Cross-cutting capabilities",
  projects: "Projects",
  trustedOrganizations: "Partner organisations",
  enabled: "Show this section on the website",
  logoUrl: "Logo URL",
  link: "Organisation link",
  description: "Overview",
  valueAdded: "Added value",
  label: "Label",
  contact: "Contact and partnerships",
  intro: "Introduction",
  email: "Email address",
  location: "Area of operation",
  address: "Postal address",
};

export const adminSectionLabels: Record<Locale, Record<string, string>> = {
  fr: labelsFr,
  en: labelsEn,
};

function fieldLabel(key: string, locale: Locale, index?: number) {
  const label = adminSectionLabels[locale][key] ?? key;
  return index === undefined ? label : label + " " + (index + 1);
}

type ContentEditorProps = {
  initialContentFr: SiteContent;
  initialContentEn: SiteContent;
  locale: Locale;
  activeSection: keyof SiteContent;
};

export function ContentEditor({ initialContentFr, initialContentEn, locale, activeSection }: ContentEditorProps) {
  const [contents, setContents] = useState({ fr: initialContentFr, en: initialContentEn });
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [message, setMessage] = useState("");
  const [uploadingPath, setUploadingPath] = useState("");
  const content = contents[locale];

  function update(path: Array<string | number>, value: string | boolean) {
    setContents((allContents) => {
      const current = allContents[locale];
      const clone = structuredClone(current) as unknown as JsonObject;
      let target: JsonObject | JsonValue[] = clone;
      path.slice(0, -1).forEach((part) => {
        target = (target as JsonObject)[String(part)] as JsonObject | JsonValue[];
      });
      const last = path[path.length - 1];
      if (Array.isArray(target)) target[Number(last)] = value;
      else target[String(last)] = value;
      return { ...allContents, [locale]: clone as unknown as SiteContent };
    });
    setStatus("idle");
  }

  async function save() {
    setStatus("saving");
    setMessage("");
    try {
      const response = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ locale, content }),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error || (locale === "fr" ? "Échec de l’enregistrement." : "Could not save the content."));
      setStatus("saved");
      setMessage(locale === "fr" ? "La version française est publiée." : "The English version is published.");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : locale === "fr" ? "Échec de l’enregistrement." : "Could not save the content.");
    }
  }

  async function uploadLogo(path: Array<string | number>, file: File) {
    const pathKey = path.join(".");
    setUploadingPath(pathKey);
    setMessage("");
    try {
      const data = new FormData();
      data.set("image", file);
      const response = await fetch("/api/admin/media", { method: "POST", body: data });
      const result = await response.json().catch(() => ({})) as { url?: string; error?: string };
      if (!response.ok || !result.url) throw new Error(result.error || (locale === "fr" ? "Échec de l’envoi du logo." : "Logo upload failed."));
      update(path, result.url);
      setMessage(locale === "fr" ? "Logo envoyé. Publiez la section pour enregistrer ce changement." : "Logo uploaded. Publish the section to save this change.");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : locale === "fr" ? "Échec de l’envoi du logo." : "Logo upload failed.");
    } finally {
      setUploadingPath("");
    }
  }

  function renderValue(value: JsonValue, path: Array<string | number>, key: string): React.ReactNode {
    if (typeof value === "boolean") {
      return (
        <label className="adminField adminBooleanField" key={path.join(".")}>
          <input type="checkbox" checked={value} onChange={(event) => update(path, event.target.checked)} />
          <span>{fieldLabel(key, locale)}</span>
        </label>
      );
    }

    if (typeof value === "string") {
      const multiline = value.length > 75 || ["paragraphs", "interventions", "text", "summary", "impact"].includes(key);
      const isLogo = key === "logoUrl";
      if (isLogo) {
        return (
          <div className="adminField" key={path.join(".")}>
            <span>{fieldLabel(key, locale)}</span>
            <div className="adminLogoField">
              <input value={value} placeholder="https://…" onChange={(event) => update(path, event.target.value)} />
              <label className="adminUploadButton">
                <span>{uploadingPath === path.join(".") ? (locale === "fr" ? "Envoi…" : "Uploading…") : (locale === "fr" ? "Importer un logo" : "Upload a logo")}</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
                  disabled={Boolean(uploadingPath)}
                  onChange={(event) => event.currentTarget.files?.[0] && void uploadLogo(path, event.currentTarget.files[0])}
                />
              </label>
            </div>
          </div>
        );
      }
      return (
        <label className="adminField" key={path.join(".")}>
          <span>{fieldLabel(key, locale, typeof path[path.length - 1] === "number" ? Number(path[path.length - 1]) : undefined)}</span>
          {multiline ? (
            <textarea value={value} rows={Math.min(6, Math.max(3, Math.ceil(value.length / 90)))} onChange={(event) => update(path, event.target.value)} />
          ) : (
            <input value={value} onChange={(event) => update(path, event.target.value)} />
          )}
        </label>
      );
    }

    if (Array.isArray(value)) {
      return (
        <div className="adminArray" key={path.join(".")}>
          {value.map((item, index) =>
            typeof item === "object" && !Array.isArray(item) ? (
              <fieldset className="adminCard" key={index}>
                <legend>{fieldLabel(key, locale, index)}</legend>
                {Object.entries(item).map(([childKey, childValue]) =>
                  renderValue(childValue, [...path, index, childKey], childKey),
                )}
              </fieldset>
            ) : renderValue(item, [...path, index], key)
          )}
        </div>
      );
    }

    return (
      <div className="adminGroup" key={path.join(".")}>
        {Object.entries(value).map(([childKey, childValue]) =>
          renderValue(childValue, [...path, childKey], childKey),
        )}
      </div>
    );
  }

  return (
    <div className="adminContentPanel">
      <div className="adminSections">
        <section className="adminSection" key={activeSection}>
          <div className="adminSectionHeading">
            <p className="adminEyebrow">{locale === "fr" ? "Contenu du site" : "Website content"}</p>
            <h2>{fieldLabel(activeSection, locale)}</h2>
          </div>
          {renderValue((content as unknown as JsonObject)[activeSection], [activeSection], activeSection)}
        </section>
      </div>
      <div className="adminSaveBar">
        <p className={status === "error" ? "adminError" : ""} aria-live="polite">
          {message || (locale === "fr" ? "Les changements ne sont visibles qu’après publication." : "Changes are visible only after publishing.")}
        </p>
        <button type="button" onClick={save} disabled={status === "saving"}>
          {status === "saving"
            ? locale === "fr" ? "Enregistrement…" : "Saving…"
            : locale === "fr"
              ? "Publier la version française"
              : "Publish English version"}
        </button>
      </div>
    </div>
  );
}
