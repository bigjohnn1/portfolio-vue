<template>
  <section
    id="intro"
    class="relative w-full min-h-screen flex items-center justify-center py-8"
  >
    <div
      class="absolute top-4 right-4 sm:top-6 sm:right-6 md:top-8 md:right-8 z-20"
    >
      <LazyAppLocaleSwitcher hydrateOnIdle />
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
          - {{ $t("intro.subtitle") }}
        </p>
        <NuxtLink
          ref="cta"
          to="#contact"
          :aria-label="$t('intro.ctaLabel')"
          class="inline-block px-8 py-4 sm:px-10 sm:py-5 mx-auto lg:mx-0 text-lg sm:text-xl md:text-2xl font-bold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 animate-fade-up w-fit"
        >
          {{ $t("intro.cta") }}
        </NuxtLink>
      </div>
      <LazyCanvasGlobe class="hidden sm:block" hydrateOnIdle />

      <div
        class="sm:hidden relative w-full aspect-square max-w-[280px] mx-auto pointer-events-none"
        aria-hidden="true"
      >
        <div class="absolute top-0 left-2 w-40 h-40 rounded-full bg-gradient-to-br from-pink-300 to-rose-400 dark:from-pink-500/40 dark:to-rose-500/30 blur-3xl opacity-70 motion-safe:animate-pulse" />
        <div class="absolute bottom-0 right-2 w-44 h-44 rounded-full bg-gradient-to-br from-indigo-400 to-violet-300 dark:from-indigo-500/40 dark:to-violet-500/30 blur-3xl opacity-70 motion-safe:animate-pulse [animation-delay:700ms]" />
        <div class="absolute top-1/3 right-1/4 w-28 h-28 rounded-full bg-gradient-to-br from-amber-300 to-emerald-400 dark:from-amber-500/40 dark:to-emerald-500/30 blur-3xl opacity-70 motion-safe:animate-pulse [animation-delay:1400ms]" />

        <div class="absolute inset-0 flex items-center justify-center">
          <svg
            viewBox="0 0 100 100"
            class="w-32 h-32 text-primary-700 dark:text-primary-200"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polygon
              points="50,10 85,30 85,70 50,90 15,70 15,30"
              opacity="0.6"
            />
            <polygon
              points="50,30 70,42 70,58 50,70 30,58 30,42"
              opacity="0.4"
            />
            <circle
              cx="50"
              cy="50"
              r="3.5"
              fill="currentColor"
            />
          </svg>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { gsap } from 'gsap'

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
