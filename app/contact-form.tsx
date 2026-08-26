"use client";

import type { FormEvent } from "react";
import { useState } from "react";

type ContactFormProps = {
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
    submit: "Envoyer votre demande",
    sending: "Envoi en cours…",
    successTitle: "Message envoyé !",
    ready: "Votre message a bien été envoyé. Nous vous répondrons dans les meilleurs délais.",
    error: "Votre message n’a pas pu être envoyé. Réessayez ou écrivez-nous directement.",
    note: "Votre demande sera envoyée directement et de façon sécurisée à l’équipe SEI.",
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
    submit: "Send your request",
    sending: "Sending…",
    successTitle: "Message sent!",
    ready: "Your message has been sent. We will get back to you as soon as possible.",
    error: "Your message could not be sent. Please try again or email us directly.",
    note: "Your request will be sent directly and securely to the SEI team.",
    emailPlaceholder: "name@organisation.org",
  },
};

export function ContactForm({ expertiseOptions, locale }: ContactFormProps) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [feedback, setFeedback] = useState("");
  const copy = translations[locale];

  async function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setStatus("sending");
    setFeedback("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          locale,
          mission: data.get("mission"),
          name: data.get("name"),
          email: data.get("email"),
          organisation: data.get("organisation"),
          message: data.get("message"),
          website: data.get("website"),
        }),
      });
      const result = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) throw new Error(result.error || copy.error);
      form.reset();
      setStatus("sent");
      setFeedback(copy.ready);
    } catch (error) {
      setStatus("error");
      setFeedback(error instanceof Error ? error.message : copy.error);
    }
  }

  return (
    <form className="projectForm" onSubmit={sendMessage}>
      <div className="contactHoneypot" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
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
      <button className="button buttonPrimary formSubmit" type="submit" disabled={status === "sending"}>
        {status === "sending" ? copy.sending : copy.submit} <span aria-hidden="true">→</span>
      </button>
      {status === "sent" ? (
        <div className="formFeedback formSuccess" role="status" aria-live="polite">
          <span aria-hidden="true">✓</span>
          <div><strong>{copy.successTitle}</strong><p>{feedback}</p></div>
        </div>
      ) : status === "error" ? (
        <div className="formFeedback formError" role="alert">
          <span aria-hidden="true">!</span>
          <p>{feedback}</p>
        </div>
      ) : (
        <p className="formNote" aria-live="polite">{copy.note}</p>
      )}
    </form>
  );
}
