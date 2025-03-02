// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: true,
  modules: [
    "@nuxtjs/tailwindcss",
    "@nuxtjs/i18n",
    "@nuxt/eslint",
    "@pinia/nuxt",
    "@nuxt/icon",
    "@nuxt/image",
  ],
  eslint: {
    config: { typescript: true },
  },

  app: {
    head: {
      link: [{ rel: "icon", type: "image/ico", href: "/img/favicon.ico" }],
      meta: [
        {
          name: "description",
          content: "",
        },
        {
          name: "keywords",
          content: "",
        },
      ],
    },
  },

  runtimeConfig: {
    public: {
      youtubeApiKey: process.env.NUXT_PUBLIC_YOUTUBE_API || "",
      supaServiceKey: process.env.NUXT_PUBLIC_SUPABASE_SERVICE_KEY || "",
      supaUrl: process.env.NUXT_PUBLIC_SUPABASE_URL || "",
    },
  },

  pinia: { storesDirs: ["./stores/**"] },
  imports: { dirs: ["./stores"] },

  pages: true,
  css: ["~/assets/css/tailwind.css"],
  tailwindcss: {
    exposeConfig: true,
    config: {
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
              50: "var(--color-primary-50)",
              100: "var(--color-primary-100)",
              200: "var(--color-primary-200)",
              300: "var(--color-primary-300)",
              400: "var(--color-primary-400)",
              500: "var(--color-primary-500)",
              600: "var(--color-primary-600)",
              700: "var(--color-primary-700)",
              800: "var(--color-primary-800)",
              900: "var(--color-primary-900)",
              950: "var(--color-primary-950)",
            },
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
        name: "English - UK (United Kingdom)",
        files: ["en.json", "common.json"],
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
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
});
