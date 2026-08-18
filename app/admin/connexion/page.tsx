import Image from "next/image";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LoginForm } from "@/app/admin/connexion/login-form";
import { readAdminSession } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  if (await readAdminSession()) redirect("/admin");

  return (
    <main className="loginShell">
      <Link className="loginBrand" href="/" aria-label="Retour au site">
        <span className="brandLogoFrame"><Image src="/images/Logo_SEImpact-01.png" alt="Social &amp; Eco Impact" fill priority unoptimized sizes="160px" /></span>
      </Link>
      <section className="loginPanel">
        <p className="adminEyebrow">Espace sécurisé</p>
        <h1>Administration</h1>
        <p>Connectez-vous pour modifier et publier les informations du site.</p>
        <LoginForm />
      </section>
    </main>
  );
}
