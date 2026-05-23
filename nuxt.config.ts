import { execSync } from 'node:child_process'
import { defineNuxtConfig } from 'nuxt/config'
import typography from '@tailwindcss/typography'

const buildCommit = (() => {
  try {
    return execSync('git rev-parse --short HEAD', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim()
  }
  catch {
    return 'dev'
  }
})()
const buildDate = new Date().toISOString().slice(0, 10)

export default defineNuxtConfig({
  modules: [
    '@nuxt/content',
    '@nuxt/fonts',
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
    public: {
      contactEmail: process.env.NUXT_PUBLIC_CONTACT_EMAIL || 'benjamin.tomanik@gmail.com',
      build: {
        commit: buildCommit,
        date: buildDate,
        repoUrl: 'https://github.com/bigjohnn1/portfolio-vue',
      },
    },
  },
  compatibilityDate: '2026-05-07',
  eslint: {
    config: {
      stylistic: true,
    },
  },
  fonts: {
    families: [
      { name: 'Geist', provider: 'google', weights: [400, 500, 600, 700, 800] },
      { name: 'Geist Mono', provider: 'google', weights: [400, 500, 600] },
    ],
    defaults: {
      weights: [400, 500, 600, 700],
      styles: ['normal'],
      subsets: ['latin', 'latin-ext'],
    },
    experimental: {
      processCSSVariables: true,
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
      {
        icon: 'twemoji:flag-germany',
        code: 'de',
        language: 'de',
        name: 'DE',
        files: ['de.json'],
      },
      {
        icon: 'twemoji:flag-france',
        code: 'fr',
        language: 'fr',
        name: 'FR',
        files: ['fr.json'],
      },
      {
        icon: 'twemoji:flag-spain',
        code: 'es',
        language: 'es',
        name: 'ES',
        files: ['es.json'],
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
          fontFamily: {
            display: ['Geist', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'],
            sans: ['Geist', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'],
            mono: ['"Geist Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
          },
          fontSize: {
            'xs': ['0.75rem', { lineHeight: '1rem', letterSpacing: '0.01em' }],
            'sm': ['0.875rem', { lineHeight: '1.375rem', letterSpacing: '0.005em' }],
            'base': ['1rem', { lineHeight: '1.625rem', letterSpacing: '0' }],
            'lg': ['1.125rem', { lineHeight: '1.75rem', letterSpacing: '-0.005em' }],
            'xl': ['1.25rem', { lineHeight: '1.875rem', letterSpacing: '-0.01em' }],
            'd-xs': ['clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem)', { lineHeight: '1.25', letterSpacing: '-0.015em' }],
            'd-sm': ['clamp(1.5rem, 1.3rem + 1vw, 1.875rem)', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
            'd-md': ['clamp(1.875rem, 1.5rem + 1.875vw, 2.5rem)', { lineHeight: '1.15', letterSpacing: '-0.025em' }],
            'd-lg': ['clamp(2.25rem, 1.7rem + 2.75vw, 3.25rem)', { lineHeight: '1.1', letterSpacing: '-0.03em' }],
            'd-xl': ['clamp(2.75rem, 2rem + 3.75vw, 4.25rem)', { lineHeight: '1.05', letterSpacing: '-0.035em' }],
            'd-2xl': ['clamp(3.25rem, 2.25rem + 5vw, 5.5rem)', { lineHeight: '1', letterSpacing: '-0.04em' }],
          },
          letterSpacing: {
            tightest: '-0.04em',
            tighter: '-0.025em',
            tight: '-0.015em',
            normal: '0',
            wide: '0.01em',
            wider: '0.04em',
            widest: '0.12em',
          },
          spacing: {
            'section-y': 'clamp(4rem, 8vw, 7rem)',
            'section-x': 'clamp(1.25rem, 4vw, 2.5rem)',
            'gutter': 'clamp(1rem, 3vw, 2rem)',
          },
          maxWidth: {
            prose: '68ch',
            content: '78rem',
          },
          keyframes: {
            'copy-pop': {
              '0%, 100%': { transform: 'scale(1)' },
              '50%': { transform: 'scale(1.18)' },
            },
            'spin-slow': {
              to: { transform: 'rotate(360deg)' },
            },
            'spin-slow-reverse': {
              to: { transform: 'rotate(-360deg)' },
            },
            'rune-float': {
              '0%, 100%': { transform: 'translate(-50%, -50%) translateY(0)', opacity: '0.85' },
              '50%': { transform: 'translate(-50%, -50%) translateY(-4px)', opacity: '1' },
            },
            'aura-pulse': {
              '0%, 100%': { opacity: '0.5', transform: 'scale(1)' },
              '50%': { opacity: '0.85', transform: 'scale(1.05)' },
            },
            'scroll-dot': {
              '0%': { transform: 'translateY(0)', opacity: '0' },
              '20%': { opacity: '1' },
              '80%': { opacity: '1' },
              '100%': { transform: 'translateY(10px)', opacity: '0' },
            },
            'chevron-drift': {
              '0%, 100%': { transform: 'translateY(-2px)', opacity: '0.45' },
              '50%': { transform: 'translateY(3px)', opacity: '1' },
            },
            'cartouche-shimmer': {
              '0%': { backgroundPosition: '-150% 0' },
              '100%': { backgroundPosition: '250% 0' },
            },
            'rune-glow': {
              '0%, 100%': { filter: 'drop-shadow(0 0 4px rgba(0,220,130,0.35))' },
              '50%': { filter: 'drop-shadow(0 0 10px rgba(0,220,130,0.75))' },
            },
            'marching-dashes': {
              '0%': { backgroundPosition: '0 0' },
              '100%': { backgroundPosition: '14px 0' },
            },
            'marching-dashes-reverse': {
              '0%': { backgroundPosition: '14px 0' },
              '100%': { backgroundPosition: '0 0' },
            },
            'lab-pulse': {
              '0%, 100%': { transform: 'scale(1)', opacity: '1', filter: 'drop-shadow(0 0 5px rgba(167,139,250,0.55))' },
              '50%': { transform: 'scale(0.72)', opacity: '0.65', filter: 'drop-shadow(0 0 11px rgba(217,70,239,0.95))' },
            },
            'lab-text-shimmer': {
              '0%, 100%': { backgroundPosition: '0% 50%' },
              '50%': { backgroundPosition: '100% 50%' },
            },
            'twinkle-a': {
              '0%, 100%': { opacity: 'var(--base-opacity, 0.5)' },
              '50%': { opacity: 'calc(var(--base-opacity, 0.5) * 0.35)' },
            },
            'twinkle-b': {
              '0%, 100%': { opacity: 'var(--base-opacity, 0.5)' },
              '60%': { opacity: 'calc(var(--base-opacity, 0.5) * 1.35)' },
            },
            'hex-drift': {
              from: { transform: 'rotate(0deg)' },
              to: { transform: 'rotate(360deg)' },
            },
            'collapsible-down': {
              from: { height: '0', opacity: '0' },
              to: { height: 'var(--reka-collapsible-content-height)', opacity: '1' },
            },
            'collapsible-up': {
              from: { height: 'var(--reka-collapsible-content-height)', opacity: '1' },
              to: { height: '0', opacity: '0' },
            },
          },
          animation: {
            'copy-pop': 'copy-pop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
            'spin-slow': 'spin-slow 60s linear infinite',
            'spin-slow-reverse': 'spin-slow-reverse 90s linear infinite',
            'rune-float': 'rune-float 4s ease-in-out infinite',
            'aura-pulse': 'aura-pulse 5s ease-in-out infinite',
            'scroll-dot': 'scroll-dot 1.6s ease-in-out infinite',
            'chevron-drift': 'chevron-drift 2.2s ease-in-out infinite',
            'cartouche-shimmer': 'cartouche-shimmer 6s ease-in-out infinite',
            'rune-glow': 'rune-glow 3.2s ease-in-out infinite',
            'marching-dashes': 'marching-dashes 1.4s linear infinite',
            'marching-dashes-reverse': 'marching-dashes-reverse 1.4s linear infinite',
            'lab-pulse': 'lab-pulse 1.6s ease-in-out infinite',
            'lab-text-shimmer': 'lab-text-shimmer 5s ease-in-out infinite',
            'twinkle-a': 'twinkle-a 4s ease-in-out infinite',
            'twinkle-b': 'twinkle-b 7s ease-in-out infinite',
            'hex-drift': 'hex-drift 90s linear infinite',
            'collapsible-down': 'collapsible-down 0.3s ease-out',
            'collapsible-up': 'collapsible-up 0.3s ease-out',
          },
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
