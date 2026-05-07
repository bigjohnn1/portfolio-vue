<template>
  <div>
    <NuxtLoadingIndicator
      :color="loaderColor"
      class="z-[9999]"
    />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script lang="ts" setup>
import { useThemeStore } from '~/stores/theme'

const themeStore = useThemeStore()
const loaderColor = computed(() => {
  return themeStore.currentTheme === 'light' ? '#3B82F6' : '#60A5FA'
})

useSeoMeta({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} - Big John` : 'Big John'
  },
})
</script>
