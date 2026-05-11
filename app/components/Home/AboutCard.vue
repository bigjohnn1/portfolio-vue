<template>
  <div
    ref="rootEl"
    class="relative w-full max-w-md mx-auto md:mx-0 [perspective:1600px]"
  >
    <div
      class="relative w-full min-h-[560px] sm:min-h-[600px] [transform-style:preserve-3d] transition-transform duration-[850ms] ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none"
      :class="flipped ? '[transform:rotateY(180deg)]' : ''"
    >
      <article
        class="absolute inset-0 rounded-[2rem] overflow-hidden border border-gray-200 dark:border-white/10 shadow-xl bg-white dark:bg-gray-900 [backface-visibility:hidden]"
        :aria-hidden="flipped"
      >
        <div
          aria-hidden="true"
          class="absolute inset-0 z-0 bg-[radial-gradient(circle_at_100%_0%,rgba(224,231,255,0.55),transparent_45%),radial-gradient(circle_at_0%_100%,rgba(252,231,243,0.45),transparent_50%)] dark:bg-[radial-gradient(circle_at_100%_0%,rgba(99,102,241,0.12),transparent_45%),radial-gradient(circle_at_0%_100%,rgba(244,114,182,0.08),transparent_50%)]"
        />

        <div class="relative h-full flex flex-col p-6 sm:p-8">
          <div class="flex items-center justify-between text-[11px] font-semibold tracking-[0.18em] text-gray-500 dark:text-gray-400">
            <span>{{ $t('about.card.idLabel') }}</span>
            <span class="flex items-center gap-1.5">
              <Icon
                name="twemoji:flag-czechia"
                class="w-3.5 h-3.5 rounded-sm shadow-sm"
                aria-hidden="true"
              />
              {{ $t('about.card.location') }}
            </span>
          </div>

          <div class="flex items-center gap-5 mt-6">
            <div class="shrink-0 w-24 h-24 sm:w-28 sm:h-28">
              <svg
                viewBox="0 0 200 200"
                class="w-full h-full"
                role="img"
                :aria-label="$t('about.card.name')"
              >
                <defs>
                  <linearGradient id="avatar-halo" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stop-color="#e0e7ff" />
                    <stop offset="100%" stop-color="#fce7f3" />
                  </linearGradient>
                  <linearGradient id="avatar-body" x1="0" y1="1" x2="1" y2="0">
                    <stop offset="0%" stop-color="#c7d2fe" />
                    <stop offset="100%" stop-color="#fbcfe8" />
                  </linearGradient>
                  <linearGradient id="avatar-head" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#fde68a" />
                    <stop offset="100%" stop-color="#fed7aa" />
                  </linearGradient>
                </defs>
                <circle cx="100" cy="100" r="92" fill="url(#avatar-halo)" opacity="0.7" />
                <path d="M30 200 Q100 120 170 200 Z" fill="url(#avatar-body)" />
                <circle cx="100" cy="85" r="42" fill="url(#avatar-head)" />
              </svg>
            </div>

            <div class="min-w-0">
              <h3 class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-50 leading-tight">
                {{ $t('about.card.name') }}
              </h3>
              <p class="mt-1 text-sm text-gray-600 dark:text-gray-300">
                {{ $t('about.card.role') }}
              </p>
              <p class="mt-2 text-sm italic text-primary-700 dark:text-primary-300">
                "{{ $t('about.card.tagline') }}"
              </p>
            </div>
          </div>

          <div class="mt-5 flex flex-wrap gap-1.5">
            <span
              v-for="tag in tags"
              :key="tag.label"
              class="group inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full bg-primary-50 dark:bg-primary-900/60 border border-primary-200/70 dark:border-primary-700/50 text-primary-700 dark:text-primary-200 hover:scale-105 hover:shadow-sm hover:bg-primary-100 dark:hover:bg-primary-800/70 transition-all duration-200 motion-reduce:transition-none motion-reduce:hover:scale-100"
            >
              <Icon
                :name="tag.icon"
                size="14"
                class="opacity-75 group-hover:opacity-100 transition-opacity"
                aria-hidden="true"
              />
              {{ tag.label }}
            </span>
          </div>

          <p class="mt-5 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
            {{ $t('about.card.shortBio') }}
          </p>

          <div class="mt-auto pt-5 flex items-end justify-between text-xs text-gray-500 dark:text-gray-400">
            <p class="font-mono">SIG · {{ signature }}</p>
            <p class="font-mono text-[10px] text-gray-400 dark:text-gray-500">
              v2026.01
            </p>
          </div>
        </div>

        <button
          type="button"
          class="absolute bottom-0 right-0 w-11 h-11 hover:w-[68px] hover:h-[68px] focus-visible:w-[68px] focus-visible:h-[68px] cursor-pointer overflow-visible bg-transparent border-0 p-0 transition-[width,height] duration-[350ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] motion-reduce:transition-none outline-none
            before:content-[''] before:absolute before:inset-0 before:[clip-path:polygon(100%_0%,100%_100%,0%_100%)] before:rounded-br-[2rem] before:bg-gradient-to-br before:from-slate-50 before:via-gray-200 before:to-slate-300 before:shadow-[inset_1px_1px_0_rgba(255,255,255,0.9),_-2px_-2px_6px_rgba(15,23,42,0.12)] dark:before:from-gray-800 dark:before:via-gray-700 dark:before:to-gray-600 dark:before:shadow-[inset_1px_1px_0_rgba(255,255,255,0.08),_-2px_-2px_6px_rgba(0,0,0,0.4)]
            after:content-[''] after:absolute after:inset-0 after:rounded-br-[2rem] after:pointer-events-none after:[background:linear-gradient(135deg,transparent_calc(50%-1px),rgba(15,23,42,0.18)_50%,transparent_calc(50%+1px))] dark:after:[background:linear-gradient(135deg,transparent_calc(50%-1px),rgba(0,0,0,0.5)_50%,transparent_calc(50%+1px))]"
          :aria-label="$t('about.card.flipHint')"
          :tabindex="flipped ? -1 : 0"
          @click="flip(true)"
        >
          <svg
            class="absolute bottom-2 right-2 w-3.5 h-3.5 opacity-60 group-hover:opacity-85 pointer-events-none"
            viewBox="0 0 14 14"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            aria-hidden="true"
          >
            <line x1="2" y1="12" x2="12" y2="2" />
            <line x1="5" y1="12" x2="12" y2="5" />
          </svg>
        </button>
      </article>

      <article
        class="absolute inset-0 rounded-[2rem] overflow-hidden border border-gray-200 dark:border-white/10 shadow-xl bg-white dark:bg-gray-900 [backface-visibility:hidden] [transform:rotateY(180deg)]"
        :aria-hidden="!flipped"
      >
        <div
          aria-hidden="true"
          class="absolute inset-0 z-0 bg-[radial-gradient(circle_at_0%_0%,rgba(254,243,199,0.45),transparent_45%),radial-gradient(circle_at_100%_100%,rgba(199,210,254,0.45),transparent_50%)] dark:bg-[radial-gradient(circle_at_0%_0%,rgba(251,191,36,0.1),transparent_45%),radial-gradient(circle_at_100%_100%,rgba(99,102,241,0.12),transparent_50%)]"
        />

        <div class="relative h-full flex flex-col p-6 sm:p-8">
          <div class="flex items-center justify-between text-[11px] font-semibold tracking-[0.18em] text-gray-500 dark:text-gray-400">
            <span>{{ $t('about.card.backTitle') }}</span>
            <span>{{ $t('about.card.idLabel') }}</span>
          </div>

          <div class="mt-6 space-y-5 flex-grow">
            <div>
              <div class="flex items-center gap-3">
                <span class="w-9 h-9 grid place-items-center rounded-xl bg-primary-50 dark:bg-primary-900">
                  <Icon
                    name="mdi:robot-outline"
                    size="20"
                    class="text-primary-700 dark:text-primary-200"
                    aria-hidden="true"
                  />
                </span>
                <h4 class="font-semibold text-gray-900 dark:text-gray-50">
                  {{ $t('about.points.workflow.title') }}
                </h4>
              </div>
              <p class="mt-2 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                {{ $t('about.points.workflow.description') }}
              </p>
            </div>

            <div>
              <div class="flex items-center gap-3">
                <span class="w-9 h-9 grid place-items-center rounded-xl bg-primary-50 dark:bg-primary-900">
                  <Icon
                    name="mdi:rocket-launch"
                    size="20"
                    class="text-primary-700 dark:text-primary-200"
                    aria-hidden="true"
                  />
                </span>
                <h4 class="font-semibold text-gray-900 dark:text-gray-50">
                  {{ $t('about.points.principles.title') }}
                </h4>
              </div>
              <p class="mt-2 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                {{ $t('about.points.principles.description') }}
              </p>
            </div>
          </div>

          <div class="pt-4 flex items-end justify-between text-xs text-gray-500 dark:text-gray-400">
            <p class="font-mono">{{ signature }}</p>
            <p class="font-mono text-[10px] text-gray-400 dark:text-gray-500">
              v2026.01
            </p>
          </div>
        </div>

        <button
          type="button"
          class="absolute bottom-0 right-0 w-11 h-11 hover:w-[68px] hover:h-[68px] focus-visible:w-[68px] focus-visible:h-[68px] cursor-pointer overflow-visible bg-transparent border-0 p-0 transition-[width,height] duration-[350ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] motion-reduce:transition-none outline-none
            before:content-[''] before:absolute before:inset-0 before:[clip-path:polygon(100%_0%,100%_100%,0%_100%)] before:rounded-br-[2rem] before:bg-gradient-to-br before:from-slate-50 before:via-gray-200 before:to-slate-300 before:shadow-[inset_1px_1px_0_rgba(255,255,255,0.9),_-2px_-2px_6px_rgba(15,23,42,0.12)] dark:before:from-gray-800 dark:before:via-gray-700 dark:before:to-gray-600 dark:before:shadow-[inset_1px_1px_0_rgba(255,255,255,0.08),_-2px_-2px_6px_rgba(0,0,0,0.4)]
            after:content-[''] after:absolute after:inset-0 after:rounded-br-[2rem] after:pointer-events-none after:[background:linear-gradient(135deg,transparent_calc(50%-1px),rgba(15,23,42,0.18)_50%,transparent_calc(50%+1px))] dark:after:[background:linear-gradient(135deg,transparent_calc(50%-1px),rgba(0,0,0,0.5)_50%,transparent_calc(50%+1px))]"
          :aria-label="$t('about.card.flipBack')"
          :tabindex="flipped ? 0 : -1"
          @click="flip(false)"
        >
          <svg
            class="absolute bottom-2 right-2 w-3.5 h-3.5 opacity-60 pointer-events-none"
            viewBox="0 0 14 14"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            aria-hidden="true"
          >
            <line x1="2" y1="12" x2="12" y2="2" />
            <line x1="5" y1="12" x2="12" y2="5" />
          </svg>
        </button>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { gsap } from 'gsap'

const { $gsap } = useNuxtApp() as unknown as { $gsap: typeof gsap }

const flipped = shallowRef(false)
const rootEl = useTemplateRef<HTMLElement>('rootEl')

interface SkillTag {
  label: string
  icon: string
}

const tags: SkillTag[] = [
  { label: 'Vue · Nuxt', icon: 'mdi:vuejs' },
  { label: 'React · Next', icon: 'mdi:react' },
  { label: 'AI Workflows', icon: 'mdi:robot-happy-outline' },
  { label: 'Architecture', icon: 'mdi:graph-outline' },
]

const signature = 'BT-2026'

const flip = (next: boolean) => {
  flipped.value = next
}

onMounted(() => {
  if (!rootEl.value) return
  $gsap.from(rootEl.value, {
    y: 30,
    opacity: 0,
    duration: 0.8,
    ease: 'power3.out',
    scrollTrigger: { trigger: rootEl.value, start: 'top 85%' },
  })
})
</script>
