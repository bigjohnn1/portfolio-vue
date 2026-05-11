<template>
  <div>
    <NuxtLoadingIndicator
      :color="loaderColor"
      class="z-[9999]"
    />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <LazyAppBackToTop hydrateOnIdle />
    <LazyAppCommandPalette hydrateOnIdle />
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
</script>
