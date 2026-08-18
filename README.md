# Site institutionnel SEI

A clean full-stack starter running on
[vinext](https://github.com/cloudflare/vinext), with optional Cloudflare D1 and
Drizzle support.

## Prerequisites

- Node.js `>=22.13.0`
- Linux with `flock`, `curl`, and GNU `timeout`

## Sites Lifecycle

The Sites lifecycle CLI runs the locked dependency install before returning this checkout. Edit the source under `app/`, then checkpoint when a coherent milestone is ready to inspect or share. The remote Sites builder runs `npm run build` against the pushed commit. Do not repeat install or build as a normal pre-checkpoint step.

This starter does not use `wrangler.jsonc`.

`install:ci` is intentionally a single, non-retrying `npm ci`. It refuses a concurrent install for the same project, consumes a matching image-seeded npm cache with `--prefer-offline` while retaining registry fallback for a missing cache object, otherwise downloads and verifies the complete vinext tarball recorded in `package-lock.json`, limits npm to one socket, and terminates a stalled install. `build` applies a short timeout and then validates the Sites artifact. These helpers target Linux and use GNU `timeout`; they are not native macOS scripts.

Scripts that need writable project-scoped home, npm, XDG, and temporary paths use `scripts/sites-env.sh`. The `dev` and `start` scripts honor the caller's runtime environment and keep Wrangler logs inside the checkout. The generated `.sites-runtime/` directory is disposable and ignored by Git.

## Included Shape

- edit site code under `app/`
- `.openai/hosting.json` déclare les bindings Cloudflare D1 (`DB`) et R2 (`MEDIA`)
- `vite.config.ts` simulates declared bindings for local development
- `db/index.ts` reads the D1 binding from the Cloudflare Worker environment
- `db/schema.ts` starts intentionally empty
- `examples/d1/` contains an optional D1 example surface
- `drizzle.config.ts` supports local migration generation when needed

## Gestion du contenu SEI

Le contenu public est séparé des composants d’affichage :

- content/site-content.json contient la version française de référence issue de la présentation institutionnelle ;
- content/site-content-en.json contient sa version anglaise ;
- la page publique lit en priorité la version publiée dans Cloudflare D1 ;
- si D1 est indisponible ou encore vide, la version de référence est affichée automatiquement ;
- /admin fournit des champs de saisie pour modifier et publier les textes français et anglais sans toucher au code ;
- l’administration permet également de créer les actualités, leur image de couverture et une galerie de plusieurs images affichée sous forme de diaporama ;
- l’onglet « Fiches projets » permet de créer chaque projet avec une image de couverture, un résumé et une description complète en français et en anglais ;
- les images envoyées depuis l’administration sont stockées dans Cloudflare R2 via le binding MEDIA.

L’administration utilise son propre nom d’utilisateur et mot de passe. Définissez
les trois variables d’environnement SITE_ADMIN_USERNAME, SITE_ADMIN_PASSWORD et
SITE_ADMIN_SESSION_SECRET. La dernière doit être une valeur aléatoire longue et
confidentielle ; elle signe les cookies de session HTTP-only.

Copiez `.dev.vars.example` vers `.dev.vars` pour le développement local, puis
remplacez toutes les valeurs d’exemple. Le fichier `.dev.vars`, ignoré par Git,
contient les identifiants de développement. En production, configurez ces trois
valeurs dans les secrets de l’hébergement et n’utilisez pas les identifiants locaux.

Les migrations `drizzle/0000_windy_starfox.sql`,
`drizzle/0001_lame_silk_fever.sql` et
`drizzle/0002_spooky_jack_murdock.sql` créent respectivement le contenu éditorial,
les actualités et les fiches projets. Elles doivent être appliquées à D1 lors du
déploiement. Un bucket R2 lié sous le nom `MEDIA` est également nécessaire pour
les images importées.

L’espace d’administration n’utilise ni ChatGPT ni un compte OpenAI. Il repose
uniquement sur les identifiants internes configurés par variables d’environnement.

## Diagnostic Commands

- `npm run install:ci`: perform the one bounded lockfile install
- `npm run dev`: start the Vite/Vinext development server
- `npm run build`: build and validate the deployable Sites artifact
- `npm run start`: start the built Vinext application
- `npm test`: build, validate, and verify the rendered development-preview metadata
- `npm run validate:artifact`: recheck an existing artifact's manifest and ESM `default.fetch` export
- `npm run db:generate`: generate Drizzle migrations after schema changes

Use build and validation commands for targeted diagnosis after a remote failure, not as part of the normal checkpoint path.

The timeout defaults can be overridden for a controlled canary with `SITES_INSTALL_TIMEOUT`, `SITES_INSTALL_KILL_AFTER`, `SITES_BUILD_TIMEOUT`, and `SITES_BUILD_KILL_AFTER`. A timeout fails the command; the helpers never retry an unchanged install or build.

## Learn More

- [vinext Documentation](https://github.com/cloudflare/vinext)
- [Drizzle D1 Guide](https://orm.drizzle.team/docs/get-started/d1-new)
