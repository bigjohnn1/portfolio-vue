# Project Conventions

## Core Stack

- **Framework:** Nuxt 4 (Vue 3.5)
- **Language:** TypeScript
- **Styling:** Tailwind CSS (configured in `nuxt.config.ts`, `assets/scss/base.scss`)
- **State Management:** Pinia (`@pinia/nuxt`)
- **i18n:** `@nuxtjs/i18n`
- **Animations/3D:** GSAP, Three.js
- **Database/ORM:** Prisma (have to migrate to pure Zenstack v3)

## Documentation & Learning

- **Latest Conventions:** Make sure to use **Context7** for documentation search (via MCP) if you aren't sure of something regarding Nuxt, Vue 3, or other libraries. Always follow the latest Vue 3.5 / Nuxt 4 best practices.

## Project Structure & Mapping

- **MAP.md:** Every structural change you make or every new functionality added MUST be documented in `MAP.md` to prevent duplicating existing code. Keep `MAP.md` up to date as a single source of truth for the codebase layout.

## Modernization & Best Practices

- **Reactivity:** Avoid unnecessary `ref`s / `reactive`s, use VueUse composables and Vue macros, such as useTemplateRef, or Nuxt defineOptions, defineSlots, defineModel, etc. Do not overuse `useNuxtApp()` when built-in composables or Vue features are available (e.g., standard imports, Vue 3 native reactivity).
- **Core Web Vitals (CWVs):** Optimize for performance (LCP, CLS, FID/INP). Use `@nuxt/image` for images, lazy-load non-critical components, and ensure lightweight initial loads.
- **Accessibility (A11y):** Ensure semantic HTML elements are used (`<main>`, `<header>`, `<footer>`, `<nav>`, `<section>`). Use proper `aria-labels`, `alt` attributes for images, and ensure good keyboard navigation and contrast ratios.

## i18n (Internationalization)

- The platform supports multiple languages (`en`, `cs`).
- Dictionary keys (`$t('key')` or `t('key')`) **MUST** be used for all hardcoded UI elements. Never leave hardcoded English or Czech text in the templates.

## Code Style

- Use ESLint for linting.
- Follow Vue 3.5 recommended component structures. Use auto-imports provided by Nuxt whenever possible.
