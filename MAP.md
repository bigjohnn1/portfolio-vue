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
  - `Footer.vue`: Site footer. Star-field background + social links + copyright + CC BY 3.0 attribution to game-icons.net (used by `HomeIntroHero`).
  - `LocaleSwitcher.vue`: Component to switch between languages (en/cs).
  - `LocalClock.vue`: Analog/digital Prague-time clock with tz-diff tooltip; uses `<NuxtTime>` for SSR-safe digital rendering.
  - `SectionRail.vue`: Fixed vertical anchor rail. Uses the shared `useActiveSection` composable (see `app/composables/useActiveSection.ts`) for scroll-spy — same source of truth as `Header.vue`. (lg+ only, home route only). Tracks the active section with `useIntersectionObserver`, page progress with `useScroll`, idle auto-hide with `useIdle`, and `Alt+↑/↓` jump via `useMagicKeys`. Lazy-mounted in `app.vue` and gated to `/`. Hosts a compact **locale quick-action button** above the section dots — opens a small popover with `onClickOutside` (VueUse) and ESC-to-close; shares visibility with the rail so it only appears once the user scrolls past the intro.
- **`Home/`**
  - `Intro.vue`: Hero/intro section. Two-column layout with **layered compose-style entrance**: status chip (RPG-style cartouche — bracketed `game-icons:rune-stone` glyph framing the availability label with `animate-rune-glow`, corner accents + double top/bottom lines with traveling `animate-cartouche-shimmer` gradient, role accent in `font-serif italic` separated by a diamond glyph) blur-drops in, H1 reveals **character-by-character** (each glyph y-drop + rotateX + blur-clear via GSAP stagger), subtitle reveals **word-by-word** (y-shift + blur-clear, 35ms stagger), CTA pops with scale-bounce, scroll hint fades in last. CTA is a primary-filled button bracketed by `game-icons:scroll-quill` (rotates -12° on hover) and `lucide:arrow-right` (slides right). Microcopy below CTA shows `intro.ctaSub`. Radial backdrop blobs `-z-0` plus a vignette gradient overlay. Bottom scroll hint uses `lucide:chevrons-down` with `animate-chevron-drift` keyframe; opacity + Y-translate are continuously driven by `useWindowScroll` progress (0 → 1 over first 160px), revealed via a `tl.call` flag after intro timeline. Honors `usePreferredReducedMotion` — entire timeline short-circuits to `gsap.set` final state.
  - `IntroHero.vue`: D&D-themed hero composition (replaces old `CanvasGlobe`). Pure SVG + Iconify, no Three.js. **Compose-style assembly** orchestrated by a GSAP timeline:
    1. Halo blooms in (scale 0.4 → 1)
    2. Outer ring **stroke-draws** via `strokeDashoffset` (1.4s `power2.inOut`), then its dashed companion fills in
    3. **24 tick marks** appear one-by-one in rotation around the dial (40ms stagger)
    4. **6 hex edges** inscribe **sequentially** via per-edge `strokeDashoffset` draw (120ms stagger) with `feGaussianBlur` soft-glow filter
    5. Inner dashed hex zooms in from 1.4x
    6. Inner counter-rotating ring stroke-draws
    7. **6 energy lines** from center to each rune vertex draw + settle to low ambient opacity
    8. Each rune position gets a **radial flash burst** (expanding `<circle>` with radial gradient) just before the rune appears
    9. **Runes materialize** with back-out scale (90ms stagger)
    10. **D20 summons** with rotateZ -540° → 0 + scale 0.2 → 1 (back-out), and a **shockwave ring** expands outward (radius 18 → 95)
    11. 18 ambient particles orbiting the perimeter twinkle in with random delays and continue yo-yo opacity loop indefinitely

    Hover on hero brightens the energy lines (0.12 → 0.4 opacity). Hovering or clicking the d20 triggers a **two-phase roll** (fast 720° in 0.55s `power2.in`, then settle with back-out + 1.1 → 1 scale) and a fresh shockwave. The entire composition has subtle **3D cursor parallax** (rotateX/rotateY based on `useMouseInElement`, max ±4-5°, `[transform-style:preserve-3d]` + `[perspective:1200px]`). Mount waits on `useElementVisibility` so the timeline only fires when the section is on screen. All colors are `text-primary-*`. Honors `usePreferredReducedMotion` — when reduced, `composeScene` short-circuits to `gsap.set` final state (no timeline, no tilt, no roll). Idle keyframes (`spin-slow`, `spin-slow-reverse`, `rune-float`, `aura-pulse`, `scroll-dot`, `chevron-drift`, `cartouche-shimmer`, `rune-glow`) live in `nuxt.config.ts` tailwind theme.
  - `About.vue`: About me section — orchestrates `HomeAboutCard` + 3× `HomeAboutFactCard` with per-fact accent (indigo / amber / violet).
  - `AboutFactCard.vue`: Polished fact card with shared chrome (mouse-tracked spotlight, accent rail, colored hover shadow) and per-fact micro-details: **learning** → animated sparkline (`stroke-dashoffset` on hover) + SMIL-pulsing end-dot; **lifestyle** → dumbbell with hover micro-rotation; **rpg** → inline SVG d20 with rolling face on hover (settles on natural 20) + rune watermark.
  - `Projects.vue`: Project showcase. Each card renders grouped tech-stack pills (`frontend` / `backend` / `db` / `misc`) sourced from a per-project `tech` object; group labels are i18n'd via `projects.tech.*`, technology names stay untranslated.
  - `TechStack.vue`: Technology stack display.
  - `Contact.vue`: Contact section. Two-column grid (`1fr / 1.15fr`) on `lg+`, single column below. **Left:** heading + presence pill (inline `AppLocalClock` + pulsing emerald availability dot + `contact.availability` copy) + phone / email channel rows (primary-tinted icon tiles) + social row (4-corner icon tiles with primary hover). **Right:** inline `<ContactForm>` (no modal). Soft radial gradient blobs in primary tone are absolutely positioned `-z-0` for ambient backdrop. `mailto:` link prefills `?subject=Project inquiry from your portfolio`. Mailto/tel links use `.contact-link` with scaleX underline + 2px translate on hover/focus. Copy button has `aria-pressed`, transitioned check/copy icon swap, emerald `is-copied` state with bounce keyframe, and `navigator.vibrate(10)` haptic on mobile.
  - `Blog.vue`: Homepage preview of the latest 3 blog articles.
- **`Blog/`**
  - `TableOfContents.vue`: A sticky table of contents navigation component for blog articles.
- **`Contact/`**
  - `Form.vue`: Contact form. **Validation is shared with the server** — single Zod schema imported from `~~/shared/contact-schema.ts` (`contactFormSchema`, `CONTACT_REASONS`, `ContactFormField`). State is held in three flat `shallowReactive` objects (`form`, `errors`, `touched`) — no `.value` indirection, top-level key mutations are exactly what the v-model / lookup pattern needs. `isConsentOpen` uses VueUse's `useToggle` (returns `[ref, setter]`). Per-field state machine: each field tracks `touched` and `errors` independently; `validateField` runs `contactFormSchema.shape[field].safeParse(form[field])` on `@blur` (first touch) and on every `@input` thereafter, so a field never flashes red on first focus but corrects live once the user is engaged. On submit, the full schema is `safeParse`d; on failure all offending fields are forced `touched=true` and the parent toast fires `contact.errors.formInvalid`. Errors render inline below each field with `lucide:alert-triangle` + rose-tinted border and a `<Transition>` (opacity + -translate-y-1, 200/150ms), `aria-invalid` + `aria-describedby` wired per field. Native `required` attributes were removed — Zod is the single source of validation truth. Error messages live under `contact.errors.*` (CS/EN) in a warm conversational first-person voice ("Pověz mi své jméno — alespoň 2 znaky.", "I'll need your consent to reply.", …) — friendlier than generic SaaS strings, but tonedown from full RPG metaphor. The hidden honeypot `website` field remains, checked server-side before schema parsing. Reset uses `Object.assign(form, emptyForm())` + a `clearKeys` helper (assigns `undefined`, never `delete` — keeps `@typescript-eslint/no-dynamic-delete` happy).
  - `Consent.vue`: Privacy/consent checkbox component.
- **`Canvas/`**
  - `AboutScene.vue`: Three.js scene used in the About section.
- `VueFrag.vue`: Utility component (possibly for fragment wrapping).

### `/shared`

- `contact-schema.ts`: Single Zod schema (`contactFormSchema`) + `CONTACT_REASONS` tuple + `ContactFormInput` / `ContactFormField` types. Imported by both `app/components/Contact/Form.vue` (client-side per-field validation) and `server/api/contact.ts` (server-side payload check) via the `~~/shared/...` alias — there is no duplicated validation logic between client and server.

### `/server`

- **`api/`**
  - `contact.ts`: Endpoint for handling contact form submissions. Imports `contactFormSchema` from `~~/shared/contact-schema.ts` — same schema the client uses. Checks the `website` honeypot first, then `safeParse`s the body; on failure returns `{ status: 400, error: <code> }` (codes match keys under `contact.errors.*` in the i18n dictionaries). Sanitises the parsed payload with `validator.escape` + `normalizeEmail`, persists via ZenStack v3 (`contactSubmission.create`), then dispatches via `nuxt-nodemailer`. Server-only errors (`email_failed`, `server_error`) also live under `contact.errors.*`.

### `/assets`

- **`locales/`**
  - `en.json`: English translation dictionary.
  - `cs.json`: Czech translation dictionary.
- **`scss/`**
  - `base.scss`: Main stylesheet including Tailwind directives.
  - `_variables.scss`: SCSS variables.
  