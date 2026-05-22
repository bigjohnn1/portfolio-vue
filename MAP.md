# Project Map

This file documents the structure and key components of the Nuxt 4 portfolio project. **Every structural change or new functionality added MUST be documented here.**

## Core Setup

- **Framework:** Nuxt 4 + Vue 3 + TypeScript
- **Styling:** Tailwind CSS + SCSS (`assets/scss/base.scss`)
- **Typography:** `@nuxt/fonts` self-hosts **Geist** (display + body sans, full weight range) and **Geist Mono** (code). Global type scale lives in `nuxt.config.ts` under `tailwindcss.config.theme.extend.fontSize` as fluid `clamp()` tuples with `lineHeight` + `letterSpacing`. Display sizes use the `text-d-*` utilities (`d-xs`…`d-2xl`). Body defaults to `font-sans`; headings auto-apply `font-display font-semibold tracking-tight` + `text-wrap: balance` via `@layer base` in `base.scss` (H1 is `font-bold`). Section rhythm tokens: `p-section-y`, `p-section-x`, `gap-gutter`; content widths: `max-w-prose`, `max-w-content`. Title + subtitle pairs use a `<header>` wrapper (single external `mb-*`, internal `mt-3` between H2 and `<p>`) — applied in `TechStack.vue` and `Contact.vue`.
- **State:** Pinia (`stores/theme.ts`)
- **i18n:** `@nuxtjs/i18n` (`assets/locales/cs.json`, `en.json`)
- **Backend:** Nuxt API routes + Prisma (`prisma/schema.prisma`)

## Directory Structure

### Root

- `content.config.ts`: Configuration for Nuxt Content, parsing markdown files from local `content/` directory.
- `app/app.vue`: Global SEO + JSON-LD structured data via `useSchemaOrg` (`definePerson` with phone/email/sameAs/address, `defineWebSite`, `defineWebPage`) — emitted on every page through `@nuxtjs/seo` (nuxt-schema-org).

### `/pages`

- `index.vue`: The main entry point and single-page portfolio layout.
- **`blog/`**
  - `index.vue`: Lists all parsed blog posts from the local content directory.
  - `[...slug].vue`: Dynamically renders individual markdown posts using `<ContentRenderer>` and includes a sticky `TableOfContents` on desktop layouts.

### `/layouts`

- `default.vue`: Main layout wrapping the pages.

### `/components`

- **`App/`**
  - `Header.vue`: Main navigation header. Desktop nav uses a **text-first** pattern — Fraunces/Inter-friendly labels with `text-base font-medium tracking-tight`; the icon (Lucide stroke) slides in from the left only on `:hover` or `[data-active]` (scroll-spy active section). Underline is a separate scale-x layer in `primary-500` (light) / `primary-300` (dark), independent of text colour for crisp transitions. Active section is shared with `SectionRail` via [[active-section-composable]] (`useActiveSection`). Search / theme / locale buttons re-skinned as 40×40 pill controls with primary-tinted hover. Icon set is **Lucide** across the whole header for stroke consistency.
  - `Footer.vue`: Site footer.
  - `LocaleSwitcher.vue`: Component to switch between languages (en/cs).
  - `LocalClock.vue`: Analog/digital Prague-time clock with tz-diff tooltip; uses `<NuxtTime>` for SSR-safe digital rendering.
  - `SectionRail.vue`: Fixed vertical anchor rail. Uses the shared `useActiveSection` composable (see `app/composables/useActiveSection.ts`) for scroll-spy — same source of truth as `Header.vue`. (lg+ only, home route only). Tracks the active section with `useIntersectionObserver`, page progress with `useScroll`, idle auto-hide with `useIdle`, and `Alt+↑/↓` jump via `useMagicKeys`. Lazy-mounted in `app.vue` and gated to `/`. Hosts a compact **locale quick-action button** above the section dots — opens a small popover with `onClickOutside` (VueUse) and ESC-to-close; shares visibility with the rail so it only appears once the user scrolls past the intro.
- **`Home/`**
  - `Intro.vue`: Hero/intro section.
  - `About.vue`: About me section — orchestrates `HomeAboutCard` + 3× `HomeAboutFactCard` with per-fact accent (indigo / amber / violet).
  - `AboutFactCard.vue`: Polished fact card with shared chrome (mouse-tracked spotlight, accent rail, colored hover shadow) and per-fact micro-details: **learning** → animated sparkline (`stroke-dashoffset` on hover) + SMIL-pulsing end-dot; **lifestyle** → dumbbell with hover micro-rotation; **rpg** → inline SVG d20 with rolling face on hover (settles on natural 20) + rune watermark.
  - `Projects.vue`: Project showcase. Each card renders grouped tech-stack pills (`frontend` / `backend` / `db` / `misc`) sourced from a per-project `tech` object; group labels are i18n'd via `projects.tech.*`, technology names stay untranslated.
  - `TechStack.vue`: Technology stack display.
  - `Contact.vue`: Contact section. Two-column grid (`1fr / 1.15fr`) on `lg+`, single column below. **Left:** heading + presence pill (inline `AppLocalClock` + pulsing emerald availability dot + `contact.availability` copy) + phone / email channel rows (primary-tinted icon tiles) + social row (4-corner icon tiles with primary hover). **Right:** inline `<ContactForm>` (no modal). Soft radial gradient blobs in primary tone are absolutely positioned `-z-0` for ambient backdrop. `mailto:` link prefills `?subject=Project inquiry from your portfolio`. Mailto/tel links use `.contact-link` with scaleX underline + 2px translate on hover/focus. Copy button has `aria-pressed`, transitioned check/copy icon swap, emerald `is-copied` state with bounce keyframe, and `navigator.vibrate(10)` haptic on mobile.
  - `Blog.vue`: Homepage preview of the latest 3 blog articles.
- **`Blog/`**
  - `TableOfContents.vue`: A sticky table of contents navigation component for blog articles.
- **`Contact/`**
  - `Form.vue`: The contact form component.
  - `Consent.vue`: Privacy/consent checkbox component.
- **`Canvas/`**
  - `Globe.vue`: 3D/Canvas element (likely Three.js).
- `VueFrag.vue`: Utility component (possibly for fragment wrapping).

### `/server`

- **`api/`**
  - `contact.ts`: Endpoint for handling contact form submissions (utilizes `nuxt-nodemailer` and Prisma).

### `/assets`

- **`locales/`**
  - `en.json`: English translation dictionary.
  - `cs.json`: Czech translation dictionary.
- **`scss/`**
  - `base.scss`: Main stylesheet including Tailwind directives.
  - `_variables.scss`: SCSS variables.
  