"use client";

import type { FormEvent } from "react";
import { useState } from "react";

type ContactFormProps = {
  email: string;
  expertiseOptions: string[];
  locale: "fr" | "en";
};

const translations = {
  fr: {
    need: "Votre besoin",
    choose: "Sélectionnez une expertise",
    project: "Développement de projet ou partenariat",
    other: "Autre demande",
    name: "Nom et prénom",
    namePlaceholder: "Votre nom",
    email: "Courriel professionnel",
    organisation: "Organisation",
    organisationPlaceholder: "Nom de votre organisation",
    context: "Contexte et résultat recherché",
    contextPlaceholder: "Décrivez votre projet, le territoire concerné et le type d’appui recherché.",
    submit: "Préparer votre demande",
    ready: "Votre messagerie va s’ouvrir avec votre demande préremplie.",
    note: "Le formulaire prépare un courriel dans votre messagerie. Aucune donnée n’est enregistrée sur ce site.",
    defaultMission: "Demande de mission ou partenariat",
    unspecified: "Non précisée",
    bodyName: "Nom",
    bodyEmail: "Courriel",
    bodyNeed: "Type de besoin",
    bodyContext: "Contexte et besoin",
    emailPlaceholder: "nom@organisation.org",
  },
  en: {
    need: "Your needs",
    choose: "Select an area of expertise",
    project: "Project development or partnership",
    other: "Other request",
    name: "Full name",
    namePlaceholder: "Your name",
    email: "Professional email",
    organisation: "Organisation",
    organisationPlaceholder: "Your organisation",
    context: "Context and expected result",
    contextPlaceholder: "Describe your project, the territory concerned and the support you are looking for.",
    submit: "Prepare your request",
    ready: "Your email application will open with a pre-filled request.",
    note: "This form prepares an email in your email application. No data is stored on this website.",
    defaultMission: "Assignment or partnership request",
    unspecified: "Not specified",
    bodyName: "Name",
    bodyEmail: "Email",
    bodyNeed: "Type of request",
    bodyContext: "Context and needs",
    emailPlaceholder: "name@organisation.org",
  },
};

export function ContactForm({ email, expertiseOptions, locale }: ContactFormProps) {
  const [emailPrepared, setEmailPrepared] = useState(false);
  const copy = translations[locale];

  function prepareEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const mission = String(data.get("mission") || copy.defaultMission);
    const organisation = String(data.get("organisation") || copy.unspecified);
    const name = String(data.get("name") || "");
    const senderEmail = String(data.get("email") || "");
    const message = String(data.get("message") || "");
    const body = [
      copy.bodyName + " : " + name,
      "Organisation : " + organisation,
      copy.bodyEmail + " : " + senderEmail,
      copy.bodyNeed + " : " + mission,
      "",
      copy.bodyContext + " :",
      message,
    ].join("\n");

    setEmailPrepared(true);
    window.location.href =
      "mailto:" +
      email +
      "?subject=" +
      encodeURIComponent(mission + " - SEI") +
      "&body=" +
      encodeURIComponent(body);
  }

  return (
    <form className="projectForm" onSubmit={prepareEmail}>
      <div className="field fullField">
        <label htmlFor="mission">{copy.need}</label>
        <select id="mission" name="mission" required defaultValue="">
          <option value="" disabled>{copy.choose}</option>
          {expertiseOptions.map((option) => <option key={option}>{option}</option>)}
          <option>{copy.project}</option>
          <option>{copy.other}</option>
        </select>
      </div>
      <div className="field">
        <label htmlFor="name">{copy.name}</label>
        <input id="name" name="name" type="text" autoComplete="name" required placeholder={copy.namePlaceholder} />
      </div>
      <div className="field">
        <label htmlFor="email">{copy.email}</label>
        <input id="email" name="email" type="email" autoComplete="email" required placeholder={copy.emailPlaceholder} />
      </div>
      <div className="field fullField">
        <label htmlFor="organisation">{copy.organisation}</label>
        <input id="organisation" name="organisation" type="text" autoComplete="organization" placeholder={copy.organisationPlaceholder} />
      </div>
      <div className="field fullField">
        <label htmlFor="message">{copy.context}</label>
        <textarea id="message" name="message" required rows={5} placeholder={copy.contextPlaceholder} />
      </div>
      <button className="button buttonPrimary formSubmit" type="submit">
        {copy.submit} <span aria-hidden="true">→</span>
      </button>
      <p className="formNote" aria-live="polite">
        {emailPrepared
          ? copy.ready
          : copy.note}
      </p>
    </form>
  );
}
