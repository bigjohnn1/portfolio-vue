<div align="center">

# Benjamin Tomaník — Portfolio

A Nuxt 4 single-page experience with a D&D-flavoured hero composition, GSAP-orchestrated entrances, internationalised content (CS / EN), a Markdown-driven blog, and a hardened contact pipeline.

### [Visit the live site &nbsp;→&nbsp; benjamintomanik.me](https://benjamintomanik.me)

[![Nuxt 4](https://img.shields.io/badge/Nuxt-4.4-00DC82?logo=nuxt.js&logoColor=white)](https://nuxt.com)
&nbsp;
[![Vue 3.5](https://img.shields.io/badge/Vue-3.5-4FC08D?logo=vue.js&logoColor=white)](https://vuejs.org)
&nbsp;
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
&nbsp;
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38BDF8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
&nbsp;
[![pnpm](https://img.shields.io/badge/pnpm-9.15-F69220?logo=pnpm&logoColor=white)](https://pnpm.io)

</div>

> [!NOTE]
> This repository is public to showcase my architectural approach to Nuxt 4, GSAP, ZenStack and motion design — **not as a starter template**. The intro timeline, the IntroHero composition, the section-rail wiring, and the data layer are bespoke to my site. Read for ideas; don't expect a one-command bootstrap.

---

## Highlights

- **Cinematic intro.** A GSAP timeline orchestrates a layered entrance — runic cartouche, character-by-character title reveal, word-by-word subtitle, scale-bouncing CTA, scroll hint. Honours `prefers-reduced-motion` end-to-end.
- **D&D-flavoured hero.** Pure SVG + Iconify composition: stroke-drawn rings, sequential hex inscription with soft-glow filter, six energy lines, radial rune flashes, a back-out d20 summon and shockwave, plus ambient particles. Hover or click the d20 for a two-phase roll. Full phase-by-phase breakdown lives in [`MAP.md`](./MAP.md).
- **Internationalised.** Czech and English via `@nuxtjs/i18n`; locale switching from the header, the section rail popover, and a dedicated control.
- **Markdown blog.** `@nuxt/content` v3 with a sticky table of contents on `/blog/[...slug]`.
- **Production chrome.** `@nuxtjs/seo` (sitemap, OG image, `useSchemaOrg` Person / WebSite / WebPage), `nuxt-security` CSP, reCAPTCHA v3 on the contact form, `nuxt-nodemailer` for delivery.
- **One schema, both sides.** Contact form validation is a single Zod schema in `shared/contact-schema.ts` — imported by both `Form.vue` (per-field live validation) and the Nitro route (server-side parse). Field errors render inline in a warm, first-person voice ("Tell me your name — at least 2 letters.") that matches the site's tone without sliding into generic SaaS strings.
- **Self-hosted typography.** Geist + Geist Mono via `@nuxt/fonts`. Global fluid `clamp()` type scale + section rhythm tokens (`p-section-y`, `p-section-x`, `gap-gutter`).
- **A11y by default.** Reduced-motion shortcircuits, semantic landmarks, `aria-label` on every icon-only control, keyboard-reachable section rail with `Alt+↑/↓`.

## Stack

| Layer        | Tooling |
| ------------ | ------- |
| Framework    | Nuxt 4 (Vue 3.5, `app/` directory) |
| Language     | TypeScript (strict) |
| Styling      | Tailwind CSS · SCSS · `@nuxt/fonts` (Geist) |
| Motion       | GSAP via `@hypernym/nuxt-gsap` · VueUse |
| State        | Pinia (`@pinia/nuxt`) + persisted-state |
| i18n         | `@nuxtjs/i18n` (cs, en) |
| Content      | `@nuxt/content` v3 (Markdown) |
| 3D           | Three.js + TresJS (`AboutScene.vue`) |
| Icons        | `@nuxt/icon` (Iconify) — Lucide + game-icons |
| Server / ORM | Nitro routes · ZenStack v3 · Kysely · PostgreSQL |
| Mail         | `nuxt-nodemailer` |
| Security     | `nuxt-security` (CSP) · `@nuxtjs/recaptcha` v3 |
| SEO          | `@nuxtjs/seo`, `nuxt-og-image`, structured data |
| Validation   | Zod — single schema in `shared/contact-schema.ts`, consumed by both client and server |

## Local development

How I work on the site day-to-day:

```bash
pnpm install
pnpm dev
```

Builds run `zenstack generate` before `nuxt build` so the generated ORM types stay in sync with `zenstack/schema.zmodel`. `pnpm generate` produces a static `.output/public`, but the live deployment ships as a Node target — the contact-form route needs Nitro at runtime.

Runtime config is read from `.env` (see [`.env.example`](./.env.example) for the canonical list):

| Variable             | Purpose |
| -------------------- | ------- |
| `DATABASE_URL`       | PostgreSQL connection (ZenStack / Kysely) |
| `NUXT_MAIL_USER`     | SMTP user for `nuxt-nodemailer` |
| `NUXT_MAIL_PASS`     | SMTP password |
| `NUXT_CONTACT_MAIL`  | Inbox that contact-form submissions land in |

reCAPTCHA v3 site / secret keys come from runtime config in `nuxt.config.ts`.

## Scripts

| Command          | What it does |
| ---------------- | ------------ |
| `pnpm dev`       | Nuxt dev server with HMR (port 3000) |
| `pnpm build`     | Runs `zenstack generate`, then `nuxt build` |
| `pnpm preview`   | Preview the production bundle locally |
| `pnpm generate`  | Pre-render the site to static HTML (`.output/public`) |
| `pnpm lint`      | ESLint across the project |
| `pnpm lint:fix`  | ESLint with auto-fix |

## Architecture

A single-page portfolio at `/` composed of independently-mounted sections — Intro, About, Projects, TechStack, Blog preview, Contact. The blog index and posts live at `/blog` and `/blog/[...slug]`.

- **App dir.** Nuxt 4's `app/` convention (`components/`, `composables/`, `layouts/`, `pages/`, `stores/`).
- **Scroll-spy single source of truth.** `useActiveSection` is consumed by both `AppHeader` and `SectionRail` — no duplicated `IntersectionObserver` wiring.
- **Data layer.** ZenStack v3 schema (`zenstack/schema.zmodel`) generates types + helpers consumed by Kysely-driven Nitro routes.
- **Global SEO + JSON-LD.** Person / WebSite / WebPage schema is emitted from `app/app.vue` via `useSchemaOrg`.
- **Motion philosophy.** Big-arc storytelling lives in GSAP timelines (intro, hero composition, contact reveal); idle ambience lives in Tailwind keyframes (`spin-slow`, `rune-float`, `aura-pulse`, `chevron-drift`, `cartouche-shimmer`, `rune-glow`, …) defined in `nuxt.config.ts`.

The exhaustive component map — every animation phase, every accent colour, every micro-interaction — is maintained in [`MAP.md`](./MAP.md). Treat it as the source of truth and update it on every structural change.

> [!TIP]
> Curious how a specific section is wired? [`MAP.md`](./MAP.md) walks through every GSAP timeline, every accent colour, and every composable in play — it's the fastest way to understand the codebase without reading it linearly.

## Accessibility

- All decorative motion is gated by `motion-reduce:animate-none` or branches on `usePreferredReducedMotion`. The intro timeline and the IntroHero composition both short-circuit to `$gsap.set` final state when reduced motion is requested.
- Icon-only controls carry `aria-label`; purely decorative SVG uses `aria-hidden="true"`.
- The section rail accepts `Alt+↑/↓` for keyboard jumping between sections.
- Forms validate against a single Zod schema (`shared/contact-schema.ts`) on both sides. Client errors surface inline on blur (after first touch) and live thereafter, with `aria-invalid` + `aria-describedby` wired per field and a polite `role="alert"` for the message itself.

## Deployment

The site is Nitro-portable. The reference deployment runs on a Node host with a managed PostgreSQL store for contact persistence. For static-export use cases (no DB, no form persistence) `pnpm generate` emits a deployable `.output/public`.

## Credits

- **Iconography:** [Lucide](https://lucide.dev) for UI strokes; [game-icons.net](https://game-icons.net) (CC BY 3.0) for the runes, dice, and scroll-quill — attribution is rendered in the site footer.
- **Typography:** [Geist](https://vercel.com/font), self-hosted via `@nuxt/fonts`.

---

<div align="center">
<sub>Crafted in Czechia · © Benjamin Tomaník · All rights reserved.</sub>
</div>
