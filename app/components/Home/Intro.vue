<template>
  <section
    id="intro"
    class="relative w-full min-h-screen flex items-center justify-center py-8"
  >
    <div
      class="absolute top-4 right-4 sm:top-6 sm:right-6 md:top-8 md:right-8 z-20"
    >
      <AppLocaleSwitcher />
    </div>
    <div
      class="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 relative z-10"
    >
      <div
        class="flex flex-col gap-6 sm:gap-8 w-full lg:w-1/2 text-center lg:text-left"
      >
        <h1
          ref="title"
          class="text-h1 text-[clamp(40px,6vw,68px)] sm:text-[clamp(48px,6vw,68px)] [text-shadow:_0_0_1px_#000,0_0_4px_#000]"
        >
          {{ $t('global.name') }}
        </h1>
        <p
          ref="subtitle"
          class="text-[clamp(16px,2.5vw,26px)] sm:text-[clamp(18px,2.5vw,26px)]"
        >
          - {{ t("intro.subtitle") }}
        </p>
        <NuxtLink
          to="#contact"
          tabindex="-1"
        >
          <button
            ref="cta"
            :aria-label="t('intro.ctaLabel')"
            class="px-8 py-4 sm:px-10 sm:py-5 mx-auto lg:mx-0 text-lg sm:text-xl md:text-2xl font-bold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 animate-fade-up w-fit"
          >
            {{ t("intro.cta") }}
          </button>
        </NuxtLink>
      </div>
      <LazyCanvasGlobe />
    </div>
  </section>
</template>

<script setup lang="ts">
import type { gsap } from 'gsap'

const { t } = useI18n()
const title = useTemplateRef<HTMLElement>('title')
const subtitle = useTemplateRef<HTMLElement>('subtitle')
const { $gsap } = useNuxtApp() as unknown as { $gsap: typeof gsap }

onMounted(() => {
  $gsap.from(title.value, { x: -100, opacity: 0, duration: 0.8 })
  $gsap.from(subtitle.value, { x: -100, opacity: 0, duration: 1, delay: 0.2 })
})
</script>

<style>
.animate-fade-up {
  animation: fadeUp 0.8s ease-out 0.4s forwards;
  opacity: 0;
}

@keyframes fadeUp {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
