<template>
  <div>
    <NuxtLoadingIndicator
      :color="loaderColor"
      class="z-[9999]"
    />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <AppBackToTop />
    <Toaster
      position="bottom-right"
      :theme="colorMode.value === 'dark' ? 'dark' : 'light'"
      rich-colors
      close-button
    />
  </div>
</template>

<script lang="ts" setup>
import { Toaster } from 'vue-sonner'

const colorMode = useColorMode()
const loaderColor = computed(() => {
  return colorMode.value === 'light' ? '#3B82F6' : '#60A5FA'
})

useSeoMeta({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} - Big John` : 'Big John'
  },
})
</script>
