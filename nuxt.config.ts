import { defineNuxtConfig } from 'nuxt/config'
import typography from '@tailwindcss/typography'

export default defineNuxtConfig({
  modules: [
    '@nuxt/content',
    '@nuxtjs/color-mode',
    '@nuxtjs/i18n',
    '@nuxtjs/tailwindcss',
    '@nuxt/eslint',
    '@nuxt/icon',
    '@nuxt/image',
    '@hypernym/nuxt-gsap',
    '@tresjs/nuxt',
    'nuxt-nodemailer',
    'nuxt-security',
    '@nuxtjs/seo',
  ],
  pages: true,
  imports: { dirs: ['~/consts'] },
  devtools: { enabled: true },
  app: {
    head: {
      link: [{ rel: 'icon', type: 'image/ico', href: '/img/favicon.ico' }],
      meta: [
        { name: 'description', content: '' },
        { name: 'keywords', content: '' },
      ],
    },
  },
  css: ['~/assets/scss/base.scss', 'vue-sonner/style.css'],
  site: {
    url: 'https://benjamin-tomanik.cz',
    name: 'Big John',
    description: 'Portfolio of Benjamin Tomanik',
    defaultLocale: 'en',
  },
  colorMode: {
    classSuffix: '',
    preference: 'light',
    fallback: 'light',
  },
  content: {
    database: {
      type: 'sqlite',
      filename: process.env.NODE_ENV === 'production'
        ? '.data/content/db.sqlite'
        : 'content-db.sqlite',
    },
    experimental: {
      sqliteConnector: 'native',
    },
  },
  runtimeConfig: {
    smtpUser: process.env.NUXT_MAIL_USER,
    smtpPass: process.env.NUXT_MAIL_PASS,
    contactMail: process.env.NUXT_CONTACT_MAIL,
  },
  compatibilityDate: '2026-05-07',
  eslint: {
    config: {
      stylistic: true,
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
  i18n: {
    langDir: 'app/locales/',
    strategy: 'no_prefix',
    locales: [
      {
        icon: 'twemoji:flag-united-kingdom',
        code: 'en',
        language: 'en',
        name: 'EN',
        files: ['en.json'],
      },
      {
        icon: 'twemoji:flag-czechia',
        code: 'cs',
        language: 'cs',
        name: 'CZ',
        files: ['cs.json'],
      },
    ],
    defaultLocale: 'en',
    detectBrowserLanguage: {
      useCookie: true,
      redirectOn: 'root',
      fallbackLocale: 'en',
    },
    compilation: {
      strictMessage: false,
      escapeHtml: false,
    },
  },
  image: {
    formats: ['webp'],
    quality: 85,
  },
  nodemailer: {
    from: `"Portfolio" ${process.env.NUXT_MAIL_USER}`,
    service: 'gmail',
    secure: true,
    auth: {
      user: process.env.NUXT_MAIL_USER,
      pass: process.env.NUXT_MAIL_PASS,
    },
  },
  ogImage: {
    zeroRuntime: true,
  },
  security: {
    rateLimiter: {
      interval: 5 * 1000,
      tokensPerInterval: 15,
    },
    headers: {
      contentSecurityPolicy: process.env.NODE_ENV === 'development'
        ? false
        : {
            'img-src': ['\'self\'', 'data:', 'blob:'],
            'script-src': [
              '\'self\'',
              'https:',
              '\'unsafe-inline\'',
              '\'strict-dynamic\'',
              '\'nonce-{{nonce}}\'',
              '\'wasm-unsafe-eval\'',
            ],
          },
    },
    xssValidator: {
      escapeHtml: true,
    },
  },
  tailwindcss: {
    viewer: false,
    exposeConfig: true,
    editorSupport: true,
    cssPath: '~/assets/scss/base.scss',
    config: {
      plugins: [typography],
      content: [
        './app/**/*.{vue,js,ts}',
        './app.vue',
      ],
      mode: 'jit',
      darkMode: 'class',
      theme: {
        screens: {
          xs: '480px',
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl2: '1100px',
          xl: '1280px',
        },
        extend: {
          colors: {
            'primary': {
              50: 'var(--color-primary-50)',
              100: 'var(--color-primary-100)',
              200: 'var(--color-primary-200)',
              300: 'var(--color-primary-300)',
              400: 'var(--color-primary-400)',
              500: 'var(--color-primary-500)',
              600: 'var(--color-primary-600)',
              700: 'var(--color-primary-700)',
              800: 'var(--color-primary-800)',
              900: 'var(--color-primary-900)',
              950: 'var(--color-primary-950)',
            },
            'light-bg': '#F9FAFB',
            'light-text': '#1F2937',
            'light-accent': '#3B82F6',
            'dark-bg': '#111827',
            'dark-text': '#E5E7EB',
            'dark-accent': '#60A5FA',
            'fantasy-bg': '#1E293B',
            'fantasy-text': '#9CA3AF',
            'fantasy-accent': '#8B5CF6',
          },
        },
      },
    },
  },
})
