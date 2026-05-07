# Project Map

This file documents the structure and key components of the Nuxt 4 portfolio project. **Every structural change or new functionality added MUST be documented here.**

## Core Setup
- **Framework:** Nuxt 4 + Vue 3 + TypeScript
- **Styling:** Tailwind CSS + SCSS (`assets/scss/base.scss`)
- **State:** Pinia (`stores/theme.ts`)
- **i18n:** `@nuxtjs/i18n` (`assets/locales/cs.json`, `en.json`)
- **Backend:** Nuxt API routes + Prisma (`prisma/schema.prisma`)

## Directory Structure

### `/pages`
- `index.vue`: The main entry point and single-page portfolio layout.

### `/layouts`
- `default.vue`: Main layout wrapping the pages.

### `/components`
- **`App/`**
  - `Header.vue`: Main navigation header.
  - `Footer.vue`: Site footer.
  - `LocaleSwitcher.vue`: Component to switch between languages (en/cs).
- **`Home/`**
  - `Intro.vue`: Hero/intro section.
  - `About.vue`: About me section.
  - `Projects.vue`: Project showcase.
  - `TechStack.vue`: Technology stack display.
  - `Contact.vue`: Contact section wrapper.
- **`Contact/`**
  - `Form.vue`: The contact form component.
  - `Consent.vue`: Privacy/consent checkbox component.
- **`Canvas/`**
  - `Globe.vue`: 3D/Canvas element (likely Three.js).
- `VueFrag.vue`: Utility component (possibly for fragment wrapping).

### `/stores`
- `theme.ts`: Manages theme (light/dark/fantasy) preferences, persisted via `@pinia-plugin-persistedstate/nuxt`.

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

## Recent Changes & Modernization Efforts
*Initial Mapping*: Documented the existing project structure. A parallel branch `SEO` was created via worktree. Current focus is on improving Accessibility (A11y) and removing unnecessary `ref` and `useNuxtApp()` calls.
