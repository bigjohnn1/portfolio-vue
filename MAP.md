# Project Map

This file documents the structure and key components of the Nuxt 4 portfolio project. **Every structural change or new functionality added MUST be documented here.**

## Core Setup

- **Framework:** Nuxt 4 + Vue 3 + TypeScript
- **Styling:** Tailwind CSS + SCSS (`assets/scss/base.scss`)
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
  - `Header.vue`: Main navigation header.
  - `Footer.vue`: Site footer.
  - `LocaleSwitcher.vue`: Component to switch between languages (en/cs).
  - `LocalClock.vue`: Analog/digital Prague-time clock with tz-diff tooltip; uses `<NuxtTime>` for SSR-safe digital rendering.
  - `SectionRail.vue`: Fixed vertical anchor rail (lg+ only, home route only). Tracks the active section with `useIntersectionObserver`, page progress with `useScroll`, idle auto-hide with `useIdle`, and `Alt+↑/↓` jump via `useMagicKeys`. Lazy-mounted in `app.vue` and gated to `/`. Hosts a compact **locale quick-action button** above the section dots — opens a small popover with `onClickOutside` (VueUse) and ESC-to-close; shares visibility with the rail so it only appears once the user scrolls past the intro.
- **`Home/`**
  - `Intro.vue`: Hero/intro section.
  - `About.vue`: About me section — orchestrates `HomeAboutCard` + 3× `HomeAboutFactCard` with per-fact accent (indigo / amber / violet).
  - `AboutFactCard.vue`: Polished fact card with shared chrome (mouse-tracked spotlight, accent rail, colored hover shadow) and per-fact micro-details: **learning** → animated sparkline (`stroke-dashoffset` on hover) + SMIL-pulsing end-dot; **lifestyle** → dumbbell with hover micro-rotation; **rpg** → inline SVG d20 with rolling face on hover (settles on natural 20) + rune watermark.
  - `Projects.vue`: Project showcase.
  - `TechStack.vue`: Technology stack display.
  - `Contact.vue`: Contact section wrapper.
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
  