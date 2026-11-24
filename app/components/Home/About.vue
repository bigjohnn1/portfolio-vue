<template>
  <section
    id="about"
    class="relative w-full bg-base-bg py-24 text-base-text dark:bg-transparent md:py-32"
  >
    <div class="mx-auto max-w-6xl px-4">
      <h2 class="mb-14 text-center text-4xl font-bold tracking-tight text-primary-700 md:mb-20 md:text-5xl dark:text-primary-300">
        {{ $t('about.title') }}
      </h2>

      <div class="grid grid-cols-1 items-start gap-12 md:grid-cols-[17rem_1fr] lg:grid-cols-[20rem_1fr] lg:gap-20">
        <div class="mx-auto w-full max-w-xs md:sticky md:top-28 md:max-w-none">
          <div class="rounded-2xl bg-gray-950 p-4 shadow-[0_1px_2px_rgba(15,23,42,0.06),0_12px_32px_-12px_rgba(15,23,42,0.35)] ring-1 ring-gray-900/10 dark:shadow-none dark:ring-white/10">
            <img
              ref="portrait"
              src="/about-portrait.svg"
              :alt="$t('about.portrait.alt')"
              width="766"
              height="766"
              loading="lazy"
              decoding="async"
              class="block h-auto w-full"
            >
            <div
              class="mt-3 flex items-center justify-end gap-1.5 text-[0.68rem] font-medium text-gray-400"
              aria-hidden="true"
            >
              <span>{{ $t('github.calendar.less') }}</span>
              <span
                v-for="level in LEGEND"
                :key="level"
                :class="['h-2.5 w-2.5 rounded-[3px]', level]"
              />
              <span>{{ $t('github.calendar.more') }}</span>
            </div>
          </div>

          <dl class="mt-8 divide-y divide-gray-200 border-y border-gray-200 text-sm dark:divide-white/10 dark:border-white/10">
            <div
              v-for="fact in FACTS"
              :key="fact.key"
              class="flex items-center gap-3 py-3"
            >
              <Icon
                :name="fact.icon"
                class="h-4 w-4 shrink-0 text-primary-600 dark:text-primary-400"
                aria-hidden="true"
              />
              <dt class="text-gray-500 dark:text-gray-400">
                {{ $t(`about.stats.${fact.key}.label`) }}
              </dt>
              <dd class="ml-auto text-right font-semibold text-gray-900 dark:text-gray-50">
                {{ $t(`about.stats.${fact.key}.value`) }}
              </dd>
            </div>
          </dl>
        </div>

        <div class="max-w-2xl">
          <p class="font-display text-[clamp(1.25rem,1.05rem+0.8vw,1.625rem)] font-medium leading-snug tracking-tight text-gray-900 [text-wrap:pretty] dark:text-gray-50">
            {{ $t('about.bio.intro') }}
          </p>
          <div class="mt-8 space-y-5 text-base leading-relaxed text-gray-600 md:text-lg dark:text-gray-300">
            <p>{{ $t('about.bio.work') }}</p>
            <p>{{ $t('about.bio.personal') }}</p>
          </div>

          <div class="mt-10 flex gap-3 border-t border-gray-200 pt-6 dark:border-white/10">
            <Icon
              name="lucide:badge-check"
              class="mt-0.5 h-5 w-5 shrink-0 text-primary-600 dark:text-primary-400"
              aria-hidden="true"
            />
            <p class="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
              <span class="font-semibold text-gray-900 dark:text-gray-50">{{ $t('about.certifications.label') }}:</span>
              {{ $t('about.certifications.value') }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { gsap } from 'gsap'
import { usePreferredReducedMotion } from '@vueuse/core'

const FACTS = [
  { key: 'xp', icon: 'lucide:calendar-days' },
  { key: 'remote', icon: 'lucide:map-pin' },
  { key: 'contract', icon: 'lucide:briefcase' },
  { key: 'languages', icon: 'lucide:languages' },
] as const

// Same five shades as the portrait SVG and the dark-mode GitHub heatmap.
const LEGEND = ['bg-white/[0.07]', 'bg-primary-900', 'bg-primary-700', 'bg-primary-500', 'bg-primary-300'] as const

const { $gsap } = useNuxtApp()
const reducedMotion = usePreferredReducedMotion()
const portrait = useTemplateRef<HTMLImageElement>('portrait')

let ctx: gsap.Context | undefined

// Fill the graph in column by column, the way weeks fill in on a contribution graph. Runs once.
// fromTo renders the hidden state on mount, so the portrait never flashes in full before the reveal;
// SSR / no-JS / reduced motion show it complete.
onMounted(() => {
  if (reducedMotion.value === 'reduce' || !portrait.value) return
  ctx = $gsap.context(() => {
    $gsap.fromTo(
      portrait.value!,
      { clipPath: 'inset(0 100% 0 0)' },
      {
        clipPath: 'inset(0 0% 0 0)',
        duration: 1.6,
        ease: 'steps(64)',
        clearProps: 'clipPath',
        scrollTrigger: { trigger: portrait.value!, start: 'top 85%', once: true },
      },
    )
  })
})

onUnmounted(() => ctx?.revert())
</script>
