<template>
  <div
    ref="rootEl"
    class="about-card relative w-full max-w-md mx-auto md:mx-0"
  >
    <div
      class="card-inner relative w-full"
      :class="{ 'is-flipped': flipped }"
    >
      <article
        class="card-face card-front absolute inset-0 rounded-[2rem] overflow-hidden border border-gray-200 dark:border-white/10 shadow-xl bg-white dark:bg-gray-900"
        :aria-hidden="flipped"
      >
        <div class="card-bg" aria-hidden="true"></div>

        <div class="relative h-full flex flex-col p-6 sm:p-8">
          <div class="flex items-center justify-between text-[11px] font-semibold tracking-[0.18em] text-gray-500 dark:text-gray-400">
            <span>{{ $t('about.card.idLabel') }}</span>
            <span class="flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
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

          <div class="mt-5 flex flex-wrap gap-2">
            <span
              v-for="tag in tags"
              :key="tag"
              class="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-200"
            >
              {{ tag }}
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
          class="corner-flip"
          :aria-label="$t('about.card.flipHint')"
          :tabindex="flipped ? -1 : 0"
          @click="flip(true)"
        >
          <span class="corner-flip-crease" aria-hidden="true"></span>
        </button>
      </article>

      <article
        class="card-face card-back absolute inset-0 rounded-[2rem] overflow-hidden border border-gray-200 dark:border-white/10 shadow-xl bg-white dark:bg-gray-900"
        :aria-hidden="!flipped"
      >
        <div class="card-bg card-bg-back" aria-hidden="true"></div>

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
          class="corner-flip corner-flip-back"
          :aria-label="$t('about.card.flipBack')"
          :tabindex="flipped ? 0 : -1"
          @click="flip(false)"
        >
          <span class="corner-flip-crease" aria-hidden="true"></span>
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

const tags = ['Vue · Nuxt', 'React · Next', 'AI Workflows', 'Architecture']
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

<style scoped>
.about-card {
  perspective: 1600px;
}

.card-inner {
  transform-style: preserve-3d;
  transition: transform 0.85s cubic-bezier(0.4, 0, 0.2, 1);
  min-height: 560px;
}

@media (min-width: 640px) {
  .card-inner {
    min-height: 600px;
  }
}

.card-inner.is-flipped {
  transform: rotateY(180deg);
}

.card-face {
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}

.card-back {
  transform: rotateY(180deg);
}

.card-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  background:
    radial-gradient(circle at 100% 0%, rgba(224, 231, 255, 0.55), transparent 45%),
    radial-gradient(circle at 0% 100%, rgba(252, 231, 243, 0.45), transparent 50%);
}

.card-bg-back {
  background:
    radial-gradient(circle at 0% 0%, rgba(254, 243, 199, 0.45), transparent 45%),
    radial-gradient(circle at 100% 100%, rgba(199, 210, 254, 0.45), transparent 50%);
}

:global(.dark) .card-bg {
  background:
    radial-gradient(circle at 100% 0%, rgba(99, 102, 241, 0.12), transparent 45%),
    radial-gradient(circle at 0% 100%, rgba(244, 114, 182, 0.08), transparent 50%);
}

:global(.dark) .card-bg-back {
  background:
    radial-gradient(circle at 0% 0%, rgba(251, 191, 36, 0.1), transparent 45%),
    radial-gradient(circle at 100% 100%, rgba(99, 102, 241, 0.12), transparent 50%);
}

.corner-flip {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 44px;
  height: 44px;
  cursor: pointer;
  border: 0;
  padding: 0;
  background: transparent;
  border-bottom-right-radius: 2rem;
  transition: width 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), height 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
  overflow: visible;
}

.corner-flip::before {
  content: '';
  position: absolute;
  inset: 0;
  clip-path: polygon(100% 0%, 100% 100%, 0% 100%);
  background: linear-gradient(135deg, #f8fafc 0%, #e5e7eb 60%, #cbd5e1 100%);
  border-bottom-right-radius: 2rem;
  box-shadow:
    inset 1px 1px 0 rgba(255, 255, 255, 0.9),
    -2px -2px 6px rgba(15, 23, 42, 0.12);
}

.corner-flip::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, transparent calc(50% - 1px), rgba(15, 23, 42, 0.18) 50%, transparent calc(50% + 1px));
  pointer-events: none;
  border-bottom-right-radius: 2rem;
}

.corner-flip:hover,
.corner-flip:focus-visible {
  width: 68px;
  height: 68px;
  outline: none;
}

:global(.dark) .corner-flip::before {
  background: linear-gradient(135deg, #1f2937 0%, #374151 60%, #4b5563 100%);
  box-shadow:
    inset 1px 1px 0 rgba(255, 255, 255, 0.08),
    -2px -2px 6px rgba(0, 0, 0, 0.4);
}

:global(.dark) .corner-flip::after {
  background: linear-gradient(135deg, transparent calc(50% - 1px), rgba(0, 0, 0, 0.5) 50%, transparent calc(50% + 1px));
}

.corner-flip-crease {
  position: absolute;
  bottom: 8px;
  right: 8px;
  width: 14px;
  height: 14px;
  pointer-events: none;
  opacity: 0.6;
  background:
    linear-gradient(135deg, transparent 45%, rgba(15, 23, 42, 0.35) 45%, rgba(15, 23, 42, 0.35) 55%, transparent 55%),
    linear-gradient(135deg, transparent 65%, rgba(15, 23, 42, 0.25) 65%, rgba(15, 23, 42, 0.25) 75%, transparent 75%);
  transition: bottom 0.3s ease, right 0.3s ease, opacity 0.3s ease;
}

.corner-flip:hover .corner-flip-crease,
.corner-flip:focus-visible .corner-flip-crease {
  bottom: 14px;
  right: 14px;
  opacity: 0.85;
}

:global(.dark) .corner-flip-crease {
  background:
    linear-gradient(135deg, transparent 45%, rgba(255, 255, 255, 0.45) 45%, rgba(255, 255, 255, 0.45) 55%, transparent 55%),
    linear-gradient(135deg, transparent 65%, rgba(255, 255, 255, 0.3) 65%, rgba(255, 255, 255, 0.3) 75%, transparent 75%);
}

@media (prefers-reduced-motion: reduce) {
  .card-inner,
  .corner-flip,
  .corner-flip-crease {
    transition: none;
  }
}
</style>
