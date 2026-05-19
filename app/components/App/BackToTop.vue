<template>
  <Transition
    enter-active-class="transition-all duration-[350ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]"
    leave-active-class="transition-all duration-[350ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]"
    enter-from-class="opacity-0 translate-y-[12px] scale-[0.85]"
    leave-to-class="opacity-0 translate-y-[12px] scale-[0.85]"
  >
    <button
      v-show="isVisible"
      ref="btnEl"
      type="button"
      class="group fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-[max(1.25rem,env(safe-area-inset-right))] z-50 grid h-[48px] w-[48px] place-items-center rounded-full border-0 bg-[var(--color-primary-600)] text-[#fff] shadow-[0_8px_22px_rgba(0,0,0,0.18)] transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-[4px] hover:bg-[var(--color-primary-700)] hover:shadow-[0_12px_26px_rgba(0,0,0,0.28)] focus-visible:-translate-y-[4px] focus-visible:bg-[var(--color-primary-700)] focus-visible:shadow-[0_12px_26px_rgba(0,0,0,0.28)] focus-visible:outline-none active:-translate-y-[1px] active:scale-[0.96] motion-reduce:transition-none dark:bg-[var(--color-primary-500)] dark:shadow-[0_8px_22px_rgba(0,0,0,0.55)] dark:hover:bg-[var(--color-primary-400)] dark:focus-visible:bg-[var(--color-primary-400)]"
      :aria-label="$t('nav.backToTop')"
      @click="scrollToTop"
    >
      <svg
        class="absolute inset-0 h-full w-full -rotate-90 pointer-events-none"
        viewBox="0 0 48 48"
        aria-hidden="true"
      >
        <circle
          class="fill-none stroke-[rgba(255,255,255,0.18)] stroke-[2.5]"
          cx="24"
          cy="24"
          r="21"
        />
        <circle
          class="fill-none stroke-[rgba(255,255,255,0.95)] stroke-[2.5] [stroke-dasharray:131.946] transition-[stroke-dashoffset] duration-[180ms] ease-linear motion-reduce:transition-none"
          stroke-linecap="round"
          cx="24"
          cy="24"
          r="21"
          :style="{ strokeDashoffset }"
        />
      </svg>

      <Icon
        name="mdi:arrow-up"
        size="20"
        class="b2t-icon relative z-[1] transition-transform duration-[450ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:-translate-y-[2px] group-focus-visible:-translate-y-[2px] motion-reduce:transition-none"
        aria-hidden="true"
      />
    </button>
  </Transition>
</template>

<script setup lang="ts">
import { useWindowScroll, useWindowSize } from '@vueuse/core'

const { y } = useWindowScroll({ behavior: 'smooth' })
const { height: viewportHeight } = useWindowSize()

const VISIBILITY_THRESHOLD = 320
const CIRCUMFERENCE = 2 * Math.PI * 21

const isVisible = computed(() => y.value > VISIBILITY_THRESHOLD)

const progress = computed(() => {
  if (!import.meta.client) return 0
  const max = document.documentElement.scrollHeight - viewportHeight.value
  if (max <= 0) return 0
  return Math.min(1, Math.max(0, y.value / max))
})

const strokeDashoffset = computed(() => CIRCUMFERENCE * (1 - progress.value))

const btnEl = useTemplateRef<HTMLElement>('btnEl')

const scrollToTop = () => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' })

  if (btnEl.value && !reduceMotion) {
    btnEl.value.classList.remove('is-bounce')
    void btnEl.value.offsetWidth
    btnEl.value.classList.add('is-bounce')
  }
}
</script>

<style scoped>
.is-bounce .b2t-icon {
  animation: b2t-rocket 0.7s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes b2t-rocket {
  0%   { transform: translateY(0); }
  35%  { transform: translateY(-14px); opacity: 0; }
  36%  { transform: translateY(14px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}

@media (prefers-reduced-motion: reduce) {
  .is-bounce .b2t-icon {
    animation: none;
  }
}
</style>
