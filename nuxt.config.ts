import { defineNuxtConfig } from "nuxt/config";
export default defineNuxtConfig({
  modules: [
    "@nuxtjs/i18n",
    "@nuxtjs/tailwindcss",
    "@nuxt/eslint",
    "@pinia/nuxt",
    "@nuxt/icon",
    "@nuxt/image",
    "@hypernym/nuxt-gsap",
    "@pinia-plugin-persistedstate/nuxt",
    "nuxt-nodemailer",
    "nuxt-security",
  ],
  nodemailer: {
    from: `"Portfolio" ${process.env.NUXT_MAIL_USER}`,
    service: "gmail",
    secure: true,
    auth: {
      user: process.env.NUXT_MAIL_USER,
      pass: process.env.NUXT_MAIL_PASS,
    },
  },
  runtimeConfig: {
    smtpUser: process.env.NUXT_MAIL_USER,
    smtpPass: process.env.NUXT_MAIL_PASS,
    contactMail: process.env.NUXT_CONTACT_MAIL,
    public: {
      contactMail: undefined,
    },
  },
  security: {
    rateLimiter: {
      interval: 10 * 1000,
      tokensPerInterval: 5,
    },
    headers: {
      contentSecurityPolicy: {
        "img-src": ["'self'", "data:", "blob:"],
        "script-src": ["'self'"],
        "style-src": ["'self'", "'unsafe-inline'"],
      },
    },
  },
  app: {
    head: {
      link: [{ rel: "icon", type: "image/ico", href: "/img/favicon.ico" }],
      meta: [
        { name: "description", content: "" },
        { name: "keywords", content: "" },
      ],
    },
  },
  image: {
    formats: ["webp"],
    quality: 85,
  },
  pinia: { storesDirs: ["./stores/**"] },
  imports: { dirs: ["./stores"] },
  pages: true,
  css: ["~/assets/scss/base.scss"],
  tailwindcss: {
    viewer: false,
    exposeConfig: true,
    editorSupport: true,
    cssPath: "~/assets/scss/base.scss",
    config: {
      mode: "jit",
      darkMode: "class",
      theme: {
        screens: {
          "3xs": "320px",
          "2xs": "425px",
          xs: "480px",
          sm: "640px",
          md: "768px",
          lg: "1024px",
          xl: "1280px",
          "2xl": "1440px",
          "3xl": "1920px",
        },
        extend: {
          colors: {
            primary: {
              "50": "rgb(var(--color-primary-50))",
              "100": "rgb(var(--color-primary-100))",
              "200": "rgb(var(--color-primary-200))",
              "300": "rgb(var(--color-primary-300))",
              "400": "rgb(var(--color-primary-400))",
              "500": "rgb(var(--color-primary-500))",
              "600": "rgb(var(--color-primary-600))",
              "700": "rgb(var(--color-primary-700))",
              "800": "rgb(var(--color-primary-800))",
              "900": "rgb(var(--color-primary-900))",
              "950": "rgb(var(--color-primary-950))",
            },
            "light-bg": "#F9FAFB",
            "light-text": "#1F2937",
            "light-accent": "#3B82F6",
            "dark-bg": "#111827",
            "dark-text": "#E5E7EB",
            "dark-accent": "#60A5FA",
            "fantasy-bg": "#1E293B",
            "fantasy-text": "#9CA3AF",
            "fantasy-accent": "#8B5CF6",
          },
        },
      },
    },
  },
  i18n: {
    lazy: true,
    langDir: "assets/locales/",
    strategy: "no_prefix",
    locales: [
      {
        icon: "twemoji:flag-united-kingdom",
        code: "en",
        language: "en",
        name: "EN",
        files: ["en.json", "common.json"],
      },
      {
        icon: "twemoji:flag-czechia",
        code: "cs",
        language: "cs",
        name: "CZ",
        files: ["cs.json", "common.json"],
      },
    ],
    defaultLocale: "en",
    detectBrowserLanguage: {
      useCookie: true,
      redirectOn: "root",
      fallbackLocale: "en",
    },
    compilation: {
      strictMessage: false,
      escapeHtml: false,
    },
  },
  gsap: {
    extraPlugins: {
      scrollTrigger: true,
    },
    extraEases: {
      expoScale: true,
    },
  },
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
});
