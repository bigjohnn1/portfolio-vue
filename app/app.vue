<template>
  <div>
    <NuxtLoadingIndicator
      :color="loaderColor"
      class="z-[9999]"
    />
    <NuxtRouteAnnouncer />
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

const { isOpen: paletteIsOpen } = useCommandPalette()
const { isOpen: sceneIsOpen } = useScene()

const route = useRoute()
const isHome = computed(() => route.path === '/')

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
    return titleChunk ? `${titleChunk} - Big John` : 'Big John'
  },
})

useSchemaOrg([
  definePerson({
    '@id': 'https://benjamintomanik.me/#about',
    'name': 'Benjamin Tomanik',
    'alternateName': 'Big John',
    'jobTitle': 'Product Engineer & Technical Co-Founder',
    'description': 'Product engineer from Czechia building scalable full-stack architectures with Vue, Nuxt, React and Next.',
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
      'Node.js',
      'Tailwind CSS',
      'Three.js',
      'GSAP',
      'Pinia',
      'ZenStack',
      'Prisma',
    ],
    'sameAs': socialLinks.map(s => s.url),
  }),
  defineWebSite({
    '@id': 'https://benjamintomanik.me/#about',
    'name': 'Big John — Benjamin Tomanik',
    'description': 'Portfolio of Benjamin Tomanik, Product Engineer & Technical Co-Founder.',
    'url': 'https://benjamintomanik.me',
    'inLanguage': ['en', 'cs'],
    'publisher': { '@id': 'https://benjamintomanik.me/#person' },
  }),
  defineWebPage({
    '@type': 'WebPage',
    'isPartOf': { '@id': 'https://benjamintomanik.me/#about' },
    'about': { '@id': 'https://benjamintomanik.me/#person' },
    'primaryImageOfPage': 'https://benjamintomanik.me/bj.png',
  }),
])
</script>
