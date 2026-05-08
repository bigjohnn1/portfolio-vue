<template>
  <NuxtImg
    :src="src"
    :alt="alt || ''"
    :width="width"
    :height="height"
    format="webp"
    loading="lazy"
    class="rounded-xl shadow-md w-full object-cover my-8 border border-gray-100 dark:border-gray-800"
  />
</template>

<script setup lang="ts">
defineProps<{
  src: string
  alt?: string
  width?: string | number
  height?: string | number
}>()
</script>
