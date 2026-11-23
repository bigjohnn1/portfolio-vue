<template>
  <div>
    <NuxtLoadingIndicator
      :color="loaderColor"
      class="z-[9999]"
    />
    <NuxtRouteAnnouncer />
    <LazyAppStarfield v-if="isDark" />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <LazyAppBackToTop hydrate-on-idle />
    <LazyAppCommandPalette hydrate-on-idle />
    <LazyAppSectionRail
      v-if="isHome"
      hydrate-on-idle
    />
    <LazyAboutSceneOverlay v-if="sceneIsOpen" />
    <Toaster
      position="bottom-right"
      :theme="colorMode.value === 'dark' ? 'dark' : 'light'"
      rich-colors
      close-button
    />
  </div>
</template>

<script lang="ts" setup>
import { useMagicKeys } from '@vueuse/core'
import { Toaster } from 'vue-sonner'

const colorMode = useColorMode()
const loaderColor = computed(() => {
  return colorMode.value === 'light' ? '#3B82F6' : '#60A5FA'
})
const isDark = computed(() => colorMode.value === 'dark')

const { isOpen: paletteIsOpen } = useCommandPalette()
const { isOpen: sceneIsOpen } = useScene()

const route = useRoute()
const routeBaseName = useRouteBaseName()
const isHome = computed(() => routeBaseName(route) === 'index')

if (import.meta.client) {
  const keys = useMagicKeys({
    passive: false,
    onEventFired(e) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k' && e.type === 'keydown') {
        e.preventDefault()
      }
    },
  })

  watch([keys['Meta+K'], keys['Ctrl+K']], ([m, c]) => {
    if (m || c) paletteIsOpen.value = !paletteIsOpen.value
  })
}

useSeoMeta({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} - Benjamin Tomanik` : 'Benjamin Tomanik'
  },
})

useSchemaOrg([
  definePerson({
    '@id': 'https://benjamintomanik.me/#person',
    'name': 'Benjamin Tomanik',
    'alternateName': 'Big John',
    'jobTitle': 'Full-Stack TypeScript Engineer',
    'description': 'Full-stack TypeScript engineer from Czechia building production SaaS with Vue, Nuxt and PostgreSQL. Open to remote roles.',
    'image': 'https://benjamintomanik.me/bj.png',
    'url': 'https://benjamintomanik.me',
    'email': `mailto:${useRuntimeConfig().public.contactEmail}`,
    'telephone': '+420705206985',
    'address': {
      '@type': 'PostalAddress',
      'addressCountry': 'CZ',
    },
    'knowsAbout': [
      'Vue.js',
      'Nuxt',
      'React',
      'Next.js',
      'TypeScript',
      'PostgreSQL',
      'Node.js',
      'Tailwind CSS',
      'GSAP',
      'Pinia',
      'ZenStack',
      'Prisma',
    ],
    'sameAs': socialLinks.map(s => s.url),
  }),
  defineWebSite({
    '@id': 'https://benjamintomanik.me/#website',
    'name': 'Benjamin Tomanik',
    'description': 'Portfolio of Benjamin Tomanik, Full-Stack TypeScript Engineer (Vue / Nuxt).',
    'url': 'https://benjamintomanik.me',
    'inLanguage': ['en', 'cs', 'de', 'fr', 'es'],
    'publisher': { '@id': 'https://benjamintomanik.me/#person' },
  }),
  defineWebPage({
    '@type': 'WebPage',
    'isPartOf': { '@id': 'https://benjamintomanik.me/#website' },
    'about': { '@id': 'https://benjamintomanik.me/#person' },
    'primaryImageOfPage': 'https://benjamintomanik.me/bj.png',
  }),
])
</script>
