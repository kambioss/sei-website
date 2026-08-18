"use client";

import type { FormEvent } from "react";
import { useState } from "react";

export function LoginForm() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const data = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          username: data.get("username"),
          password: data.get("password"),
        }),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error || "Connexion impossible.");
      window.location.href = "/admin";
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Connexion impossible.");
      setLoading(false);
    }
  }

  return (
    <form className="loginForm" onSubmit={submit}>
      <label>
        <span>Nom d’utilisateur</span>
        <input name="username" type="text" autoComplete="username" required autoFocus />
      </label>
      <label>
        <span>Mot de passe</span>
        <input name="password" type="password" autoComplete="current-password" required />
      </label>
      {error && <p className="loginError" role="alert">{error}</p>}
      <button type="submit" disabled={loading}>
        {loading ? "Connexion…" : "Se connecter"}
      </button>
    </form>
  );
}
