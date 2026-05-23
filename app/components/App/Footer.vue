<template>
  <footer
    ref="footerRef"
    class="relative bg-gray-900 text-white p-6 text-center overflow-hidden"
  >
    <div
      v-show="isVisible"
      class="absolute inset-0 opacity-20"
    >
      <div
        v-for="(star, index) in stars"
        :key="index"
        class="absolute rounded-full"
        :style="{
          left: star.left + '%',
          top: star.top + '%',
          width: star.size + 'px',
          height: star.size + 'px',
          backgroundColor: '#E5E7EB',
        }"
      ></div>
    </div>
    <div class="relative z-10">
      <div class="flex justify-center gap-6 mb-4">
        <NuxtLink
          v-for="social in socialLinks"
          :key="social.platform"
          :to="social.url"
          target="_blank"
          class="hover:text-gray-300"
        >
          <Icon
            :name="social.icon"
            class="h-6 w-6"
          />
        </NuxtLink>
      </div>
      <p class="text-white">
        © {{ year }} Big John
      </p>
      <p class="mt-2 text-xs text-gray-400">
        Hero iconography by
        <a
          href="https://game-icons.net/"
          target="_blank"
          rel="noopener noreferrer"
          class="underline-offset-2 hover:underline"
        >game-icons.net</a>
        ·
        <a
          href="https://creativecommons.org/licenses/by/3.0/"
          target="_blank"
          rel="noopener noreferrer"
          class="underline-offset-2 hover:underline"
        >CC BY 3.0</a>
      </p>
    </div>
  </footer>
</template>

<script lang="ts" setup>
import { useIntersectionObserver } from '@vueuse/core'
import { socialLinks } from '~/consts/socials'

interface Star {
  left: number
  top: number
  size: number
}

const year = new Date().getFullYear()
const isVisible = shallowRef(false)
const footerRef = shallowRef(null)
const stars = shallowReactive<Star[]>([])

onMounted(() => {
  const { stop } = useIntersectionObserver(
    footerRef,
    ([{ isIntersecting }]) => {
      if (isIntersecting) {
        isVisible.value = true
        generateStars()
        stop()
      }
    },
  )
})
function generateStars() {
  const starCount = 50
  for (let i = 0; i < starCount; i++) {
    stars.push({
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 2 + 1,
    })
  }
}
</script>
