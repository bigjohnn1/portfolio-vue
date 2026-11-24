<div align="center">

# Benjamin Tomaník — Portfolio

Personal site of a full-stack TypeScript engineer (Vue / Nuxt): a Nuxt 4 single page with selected work, a Markdown blog, live GitHub activity, content in five languages and a hardened contact pipeline.

### [Visit the live site &nbsp;→&nbsp; benjamintomanik.me](https://benjamintomanik.me)

[![Nuxt 4](https://img.shields.io/badge/Nuxt-4.4-00DC82?logo=nuxt.js&logoColor=white)](https://nuxt.com)
&nbsp;
[![Vue 3.5](https://img.shields.io/badge/Vue-3.5-4FC08D?logo=vue.js&logoColor=white)](https://vuejs.org)
&nbsp;
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
&nbsp;
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38BDF8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
&nbsp;
[![Bun](https://img.shields.io/badge/Bun-runtime-FBF0DF?logo=bun&logoColor=black)](https://bun.sh)

</div>

> [!NOTE]
> This repository is public to show how I structure a Nuxt 4 app — data layer, i18n, SEO, security and CI — **not as a starter template**. The content, section wiring and data layer are specific to my site. Read it for ideas; don't expect a one-command bootstrap.

---

## Highlights

- **Recruiter-first home page.** Static hero copy (name, role, one proof sentence, CTA and CV download), then selected work (the flagship product as a featured card with an in-app screenshot, the rest on a timeline), blog, tech stack, about, GitHub activity and contact.
- **One playful detail.** The hero visual is a d20 built from pure SVG + Iconify and assembled by a GSAP timeline. Click it to roll: the result scrolls to a random section, and a natural 20 sends you to the contact form. Phase-by-phase breakdown in [`MAP.md`](./MAP.md).
- **Internationalised.** English, Czech, German, French and Spanish via `@nuxtjs/i18n` (`prefix_except_default`); locale switching from the hero, the header and the section rail.
- **Markdown blog.** `@nuxt/content` v3 with a sticky table of contents on `/blog/[...slug]`.
- **Live GitHub activity.** Contribution heatmap, streaks, language share and latest commits from a server route, fetched only when the section scrolls into view.
- **Production chrome.** `@nuxtjs/seo` (sitemap, OG image, `useSchemaOrg` Person / WebSite / WebPage), `nuxt-security` CSP, reCAPTCHA v3 on the contact form, `nuxt-nodemailer` for delivery.
- **One schema, both sides.** Contact form validation is a single Zod schema in `shared/contact-schema.ts`, imported by both `Form.vue` (per-field live validation) and the Nitro route (server-side parse).
- **Self-hosted typography.** Geist + Geist Mono via `@nuxt/fonts`. Global fluid `clamp()` type scale + section rhythm tokens (`p-section-y`, `p-section-x`, `gap-gutter`).
- **A11y by default.** Reduced-motion support, semantic landmarks, `aria-label` on every icon-only control, keyboard-reachable section rail with `Alt+↑/↓`.

## Stack

| Layer        | Tooling |
| ------------ | ------- |
| Framework    | Nuxt 4 (Vue 3.5, `app/` directory) |
| Language     | TypeScript (strict) |
| Styling      | Tailwind CSS · SCSS · `@nuxt/fonts` (Geist) |
| Motion       | GSAP via `@hypernym/nuxt-gsap` · VueUse |
| State        | Pinia (`@pinia/nuxt`) + persisted-state |
| i18n         | `@nuxtjs/i18n` (en, cs, de, fr, es) |
| Content      | `@nuxt/content` v3 (Markdown) |
| Icons        | `@nuxt/icon` (Iconify) — Lucide, brand logos, game-icons |
| Server / ORM | Nitro routes · ZenStack v3 · Kysely · PostgreSQL |
| Mail         | `nuxt-nodemailer` |
| Security     | `nuxt-security` (CSP) · `@nuxtjs/recaptcha` v3 |
| SEO          | `@nuxtjs/seo`, `nuxt-og-image`, structured data |
| Validation   | Zod — single schema in `shared/contact-schema.ts`, consumed by both client and server |

## Local development

How I work on the site day-to-day:

```bash
bun install
bun run dev
```

Builds run `zenstack generate` before `nuxt build` so the generated ORM types stay in sync with `zenstack/schema.zmodel`. `bun run generate` produces a static `.output/public`, but the live deployment ships to Vercel with the contact-form route running as a Nitro serverless function (on the Bun runtime).

Runtime config is read from `.env` (see [`.env.example`](./.env.example) for the canonical list):

| Variable             | Purpose |
| -------------------- | ------- |
| `DATABASE_URL`       | PostgreSQL connection (ZenStack / Kysely) |
| `NUXT_MAIL_USER`     | SMTP user for `nuxt-nodemailer` |
| `NUXT_MAIL_PASS`     | SMTP password |
| `NUXT_CONTACT_MAIL`  | Inbox that contact-form submissions land in |
| `NUXT_GITHUB_TOKEN`  | GitHub PAT (classic, scope `read:user` only — everything else the section reads is public) for the live activity section — without it `/api/github/stats` returns `503` and the section renders its offline state |
| `NUXT_PUBLIC_GITHUB_USERNAME` | GitHub handle the activity section reads (defaults to `bigjohnn1`) |

reCAPTCHA v3 site / secret keys come from runtime config in `nuxt.config.ts`.

## Scripts

| Command          | What it does |
| ---------------- | ------------ |
| `bun run dev`      | Nuxt dev server with HMR (port 3000) |
| `bun run build`    | Runs `zenstack generate`, then `nuxt build` |
| `bun run preview`  | Preview the production bundle locally |
| `bun run generate` | Pre-render the site to static HTML (`.output/public`) |
| `bun run lint`     | ESLint across the project |
| `bun run lint:fix` | ESLint with auto-fix |

## Architecture

A single-page portfolio at `/` composed of independently mounted sections — Intro, Projects, Blog preview, Tech stack, About, GitHub activity, Contact. The blog index and posts live at `/blog` and `/blog/[...slug]`.

- **App dir.** Nuxt 4's `app/` convention (`components/`, `composables/`, `layouts/`, `pages/`, `stores/`).
- **Scroll-spy single source of truth.** `useActiveSection` is consumed by `AppHeader`, `SectionRail` and the footer — no duplicated `IntersectionObserver` wiring.
- **Data layer.** ZenStack v3 schema (`zenstack/schema.zmodel`) generates types + helpers consumed by Kysely-driven Nitro routes.
- **Global SEO + JSON-LD.** Person / WebSite / WebPage schema is emitted from `app/app.vue` via `useSchemaOrg`.
- **Hydration-safe SSR.** Markup that depends on the clock, randomness or the stored colour mode renders the same on server and client: the local-time clock hydrates from the server timestamp in the payload, the hero particles use a seeded PRNG, and the theme toggle renders both icons and lets the `dark` class pick one.
- **Motion.** The d20 composition in the hero is a GSAP timeline that starts once it is on screen; everything else is short, scroll-triggered entrances on content (project timeline, tech stack, GitHub activity). The hero text never animates, so it is readable on first paint.

The component map is maintained in [`MAP.md`](./MAP.md). Treat it as the source of truth and update it on every structural change.

## Accessibility

- All decorative motion is gated by `motion-reduce:animate-none` or branches on `usePreferredReducedMotion`. The d20 composition short-circuits to its final state, and a roll scrolls instantly, when reduced motion is requested.
- The d20 is a real `<button>` with an `aria-label`; the surrounding SVG is `aria-hidden`.
- Icon-only controls carry `aria-label`; purely decorative SVG uses `aria-hidden="true"`.
- The section rail accepts `Alt+↑/↓` for keyboard jumping between sections.
- Forms validate against a single Zod schema (`shared/contact-schema.ts`) on both sides. Client errors surface inline on blur (after first touch) and live thereafter, with `aria-invalid` + `aria-describedby` wired per field and a polite `role="alert"` for the message itself.

## Deployment

The site deploys to **Vercel** — Nitro auto-detects the `vercel` preset, and serverless functions run on the **Bun runtime** (`nitro.vercel.functions.runtime` in `nuxt.config.ts`). Contact persistence and `@nuxt/content` both use a managed PostgreSQL store. For static-export use cases (no DB, no form persistence) `bun run generate` emits a deployable `.output/public`.

## Credits

- **Iconography:** [Lucide](https://lucide.dev) for UI strokes, brand marks via Iconify logo sets, and [game-icons.net](https://game-icons.net) (CC BY 3.0) for the d20 and runes — attribution is rendered in the site footer.
- **Typography:** [Geist](https://vercel.com/font), self-hosted via `@nuxt/fonts`.

---

<div align="center">
<sub>© Benjamin Tomaník · All rights reserved.</sub>
</div>
