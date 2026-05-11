<template>
  <div
    class="fixed top-0 left-0 right-0 h-[3px] z-[60] pointer-events-none"
    aria-hidden="true"
  >
    <div
      class="h-full bg-gradient-to-r from-primary-500 to-primary-700 dark:from-primary-400 dark:to-primary-200 origin-left transition-transform duration-100 ease-linear motion-reduce:transition-none will-change-transform"
      :style="{ transform: `scaleX(${progress})` }"
    />
  </div>
</template>

<script setup lang="ts">
import { useElementBounding, useWindowSize } from '@vueuse/core'

const props = defineProps<{
  target: HTMLElement | null
}>()

const targetRef = computed(() => props.target)
const { top, height } = useElementBounding(targetRef)
const { height: viewportHeight } = useWindowSize()

const progress = computed(() => {
  if (!props.target) return 0
  const readable = height.value - viewportHeight.value
  if (readable <= 0) return top.value < 0 ? 1 : 0
  const scrolled = -top.value
  return Math.min(1, Math.max(0, scrolled / readable))
})
</script>
