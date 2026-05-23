<template>
  <section
    id="intro"
    class="relative w-full min-h-screen flex items-center justify-center py-12 overflow-hidden"
  >
    <div
      class="pointer-events-none absolute inset-0 -z-0"
      aria-hidden="true"
    >
      <div class="absolute -left-32 top-1/4 h-[420px] w-[420px] rounded-full bg-primary-300/30 blur-3xl dark:bg-primary-700/25" />
      <div class="absolute -right-40 bottom-1/4 h-[480px] w-[480px] rounded-full bg-primary-400/25 blur-3xl dark:bg-primary-600/20" />
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_60%,rgba(0,0,0,0.04)_100%)] dark:bg-[radial-gradient(circle_at_center,transparent_60%,rgba(0,0,0,0.3)_100%)]" />
    </div>

    <div
      class="absolute top-4 right-4 sm:top-6 sm:right-6 md:top-8 md:right-8 z-20"
    >
      <LazyAppLocaleSwitcher hydrate-on-idle />
    </div>

    <div
      class="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center justify-center gap-12 px-4 sm:px-6 lg:flex-row lg:gap-16 lg:px-8"
    >
      <div
        class="flex w-full flex-col items-center gap-6 text-center sm:gap-7 lg:w-1/2 lg:items-start lg:text-left"
      >
        <div
          ref="chip"
          class="relative inline-flex flex-wrap items-center justify-center gap-x-3 gap-y-1 bg-gradient-to-r from-primary-50/45 via-transparent to-primary-50/45 px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary-700 opacity-0 backdrop-blur-md lg:justify-start dark:from-primary-900/25 dark:to-primary-900/25 dark:text-primary-300"
        >
          <span
            aria-hidden="true"
            class="pointer-events-none absolute inset-x-0 top-0 h-px animate-cartouche-shimmer bg-[length:200%_100%] bg-gradient-to-r from-transparent via-primary-500/55 to-transparent motion-reduce:animate-none dark:via-primary-400/50"
          />
          <span
            aria-hidden="true"
            class="pointer-events-none absolute inset-x-6 top-[3px] h-px bg-gradient-to-r from-transparent via-primary-500/20 to-transparent dark:via-primary-400/15"
          />
          <span
            aria-hidden="true"
            class="pointer-events-none absolute inset-x-0 bottom-0 h-px animate-cartouche-shimmer bg-[length:200%_100%] bg-gradient-to-r from-transparent via-primary-500/55 to-transparent motion-reduce:animate-none dark:via-primary-400/50"
            style="animation-delay: -3s"
          />
          <span
            aria-hidden="true"
            class="pointer-events-none absolute inset-x-6 bottom-[3px] h-px bg-gradient-to-r from-transparent via-primary-500/20 to-transparent dark:via-primary-400/15"
          />
          <span
            aria-hidden="true"
            class="absolute left-0 top-0 h-1.5 w-1.5 border-l border-t border-primary-500/70 dark:border-primary-400/55"
          />
          <span
            aria-hidden="true"
            class="absolute right-0 top-0 h-1.5 w-1.5 border-r border-t border-primary-500/70 dark:border-primary-400/55"
          />
          <span
            aria-hidden="true"
            class="absolute bottom-0 left-0 h-1.5 w-1.5 border-b border-l border-primary-500/70 dark:border-primary-400/55"
          />
          <span
            aria-hidden="true"
            class="absolute bottom-0 right-0 h-1.5 w-1.5 border-b border-r border-primary-500/70 dark:border-primary-400/55"
          />

          <span class="inline-flex items-center gap-2">
            <span
              aria-hidden="true"
              class="h-3 w-[3px] border-y border-l border-primary-500/55 dark:border-primary-400/45"
            />
            <Icon
              name="game-icons:rune-stone"
              class="h-3.5 w-3.5 animate-rune-glow text-primary-500 motion-reduce:animate-none dark:text-primary-400"
              aria-hidden="true"
            />
            <span
              aria-hidden="true"
              class="h-3 w-[3px] border-y border-r border-primary-500/55 dark:border-primary-400/45"
            />
            <span>{{ $t('intro.availability') }}</span>
          </span>

          <span
            aria-hidden="true"
            class="text-[10px] leading-none text-primary-500/55 dark:text-primary-400/50"
          >◆</span>

          <span class="font-serif font-medium italic normal-case tracking-[0.01em] text-primary-700/90 dark:text-primary-300/85">
            {{ $t('intro.role') }}
          </span>
        </div>

        <h1
          class="font-display font-bold tracking-tight text-gray-900 leading-[0.95] dark:text-gray-50 text-[clamp(48px,9vw,108px)]"
        >
          <span
            v-for="(word, wi) in titleWords"
            :key="wi"
            class="inline-block whitespace-nowrap"
          >
            <span
              v-for="(char, ci) in word.chars"
              :key="ci"
              :ref="(el) => { if (el) titleCharRefs[word.offset + ci] = el as HTMLElement }"
              class="inline-block opacity-0 will-change-transform"
            >{{ char }}</span>
            <span
              v-if="wi < titleWords.length - 1"
              aria-hidden="true"
            >&nbsp;</span>
          </span>
        </h1>

        <p
          class="flex max-w-xl flex-wrap justify-center gap-x-[0.3em] text-[clamp(17px,2vw,22px)] leading-relaxed text-gray-600 lg:justify-start dark:text-gray-300"
        >
          <span
            v-for="(word, i) in subtitleWords"
            :key="i"
            :ref="(el) => { if (el) subtitleWordRefs[i] = el as HTMLElement }"
            class="inline-block opacity-0 will-change-transform"
          >{{ word }}</span>
        </p>

        <div
          ref="ctaWrap"
          class="flex flex-col items-center gap-2.5 opacity-0 lg:items-start"
        >
          <NuxtLink
            to="#contact"
            :aria-label="$t('intro.ctaLabel')"
            class="group/cta inline-flex w-fit items-center gap-2.5 rounded-xl bg-primary-600 px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-primary-500/30 transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary-700 hover:shadow-xl hover:shadow-primary-500/40 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-300 sm:px-9 sm:py-4 sm:text-lg dark:bg-primary-500 dark:hover:bg-primary-400 dark:shadow-primary-500/20"
          >
            <Icon
              name="game-icons:scroll-quill"
              class="h-5 w-5 transition-transform duration-500 group-hover/cta:-rotate-12"
              aria-hidden="true"
            />
            {{ $t('intro.cta') }}
            <Icon
              name="lucide:arrow-right"
              class="h-4 w-4 transition-transform duration-300 group-hover/cta:translate-x-1"
              aria-hidden="true"
            />
          </NuxtLink>
          <p class="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.08em] text-gray-500 dark:text-gray-400">
            <Icon
              name="lucide:clock-3"
              class="h-3 w-3"
              aria-hidden="true"
            />
            {{ $t('intro.ctaSub') }}
          </p>
        </div>
      </div>

      <HomeIntroHero />
    </div>

    <div
      :style="scrollHintStyle"
      class="pointer-events-none absolute bottom-6 left-1/2 z-10 will-change-transform sm:bottom-8"
      aria-hidden="true"
    >
      <div class="flex flex-col items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">
        <span class="inline-flex items-center gap-2">
          <span
            aria-hidden="true"
            class="h-px w-5 bg-gradient-to-r from-transparent to-current opacity-60"
          />
          {{ $t('intro.scrollHint') }}
          <span
            aria-hidden="true"
            class="h-px w-5 bg-gradient-to-l from-transparent to-current opacity-60"
          />
        </span>
        <Icon
          name="lucide:chevrons-down"
          class="h-4 w-4 animate-chevron-drift text-primary-500/80 motion-reduce:animate-none dark:text-primary-300/80"
          aria-hidden="true"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useWindowScroll, usePreferredReducedMotion } from '@vueuse/core'

const { t } = useI18n()
const { $gsap } = useNuxtApp()

const reducedMotion = usePreferredReducedMotion()
const prefersReducedMotion = computed(() => reducedMotion.value === 'reduce')

const chip = useTemplateRef<HTMLElement>('chip')
const ctaWrap = useTemplateRef<HTMLElement>('ctaWrap')

const titleCharRefs = ref<HTMLElement[]>([])
const subtitleWordRefs = ref<HTMLElement[]>([])

const titleWords = computed(() => {
  let offset = 0
  return t('global.name').split(' ').map((word) => {
    const entry = { chars: word.split(''), offset }
    offset += entry.chars.length
    return entry
  })
})
const subtitleWords = computed(() => t('intro.subtitle').split(' '))

const { y: scrollY } = useWindowScroll()
const scrollHintRevealed = ref(false)
const scrollHintProgress = computed(() => {
  if (prefersReducedMotion.value) return scrollY.value > 60 ? 1 : 0
  return Math.min(scrollY.value / 160, 1)
})
const scrollHintStyle = computed(() => ({
  opacity: scrollHintRevealed.value ? 1 - scrollHintProgress.value : 0,
  transform: `translate3d(-50%, ${scrollHintProgress.value * 14}px, 0)`,
  transition: 'opacity 600ms ease, transform 320ms ease',
}))

onMounted(() => {
  if (prefersReducedMotion.value) {
    const targets = [chip.value, ctaWrap.value, ...titleCharRefs.value, ...subtitleWordRefs.value].filter(Boolean) as HTMLElement[]
    $gsap.set(targets, { opacity: 1, y: 0, rotateX: 0, scale: 1, filter: 'blur(0px)', clearProps: 'filter' })
    scrollHintRevealed.value = true
    return
  }

  const tl = $gsap.timeline({ defaults: { ease: 'power3.out' } })

  tl.fromTo(
    chip.value,
    { y: -16, opacity: 0, filter: 'blur(8px)' },
    { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.7 },
    0,
  )

  if (titleCharRefs.value.length) {
    tl.fromTo(
      titleCharRefs.value,
      { y: 60, opacity: 0, rotateX: -90, filter: 'blur(8px)' },
      {
        y: 0,
        opacity: 1,
        rotateX: 0,
        filter: 'blur(0px)',
        duration: 0.7,
        stagger: 0.04,
        ease: 'back.out(1.4)',
      },
      0.2,
    )
  }

  if (subtitleWordRefs.value.length) {
    tl.fromTo(
      subtitleWordRefs.value,
      { y: 12, opacity: 0, filter: 'blur(6px)' },
      {
        y: 0,
        opacity: 1,
        filter: 'blur(0px)',
        duration: 0.5,
        stagger: 0.035,
        ease: 'power2.out',
      },
      0.55,
    )
  }

  tl.fromTo(
    ctaWrap.value,
    { y: 18, opacity: 0, scale: 0.92 },
    {
      y: 0,
      opacity: 1,
      scale: 1,
      duration: 0.7,
      ease: 'back.out(1.6)',
    },
    1.1,
  )

  const revealScrollHint = () => {
    scrollHintRevealed.value = true
  }
  tl.call(revealScrollHint, [], 1.7)
})
</script>
