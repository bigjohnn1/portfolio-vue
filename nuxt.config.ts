import { defineNuxtConfig } from "nuxt/config";
import tailwind from "unplugin-tailwindcss/vite";

export default defineNuxtConfig({
  ssr: true,
  modules: [
    "@nuxtjs/i18n",
    "@nuxt/eslint",
    "@pinia/nuxt",
    "@nuxt/icon",
    "@nuxt/image",
  ],
  app: {
    head: {
      link: [{ rel: "icon", type: "image/ico", href: "/img/favicon.ico" }],
      meta: [
        { name: "description", content: "" },
        { name: "keywords", content: "" },
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
  css: ["~/assets/scss/base.scss"],
  i18n: {
    lazy: true,
    langDir: "assets/locales/",
    strategy: "no_prefix",
    locales: [
      {
        icon: "twemoji:flag-united-kingdom",
        code: "en",
        language: "en",
        name: "English - UK",
        files: ["en.json", "common.json"],
      },
      {
        icon: "twemoji:flag-czechia",
        code: "cs",
        language: "cs",
        name: "Czech - CZ",
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
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  vite: {
    plugins: [tailwind() as any],
  },
});
