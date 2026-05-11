<template>
  <Transition name="b2t-fade">
    <button
      v-show="isVisible"
      ref="btnEl"
      type="button"
      class="back-to-top group"
      :aria-label="$t('nav.backToTop')"
      @click="scrollToTop"
    >
      <svg
        class="b2t-ring"
        viewBox="0 0 48 48"
        aria-hidden="true"
      >
        <circle
          class="b2t-ring-track"
          cx="24"
          cy="24"
          r="21"
        />
        <circle
          class="b2t-ring-progress"
          cx="24"
          cy="24"
          r="21"
          :style="{ strokeDashoffset }"
        />
      </svg>

      <Icon
        name="mdi:arrow-up"
        size="20"
        class="b2t-icon"
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
.back-to-top {
  position: fixed;
  bottom: max(1.25rem, env(safe-area-inset-bottom));
  right: max(1.25rem, env(safe-area-inset-right));
  width: 48px;
  height: 48px;
  display: grid;
  place-items: center;
  border: 0;
  border-radius: 9999px;
  background: var(--color-primary-600);
  color: #fff;
  cursor: pointer;
  z-index: 50;
  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.18);
  transition:
    transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
    box-shadow 0.3s ease,
    background 0.2s ease;
}

:global(.dark) .back-to-top {
  background: var(--color-primary-500);
  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.55);
}

.back-to-top:hover,
.back-to-top:focus-visible {
  transform: translateY(-4px);
  box-shadow: 0 12px 26px rgba(0, 0, 0, 0.28);
  outline: none;
  background: var(--color-primary-700);
}

:global(.dark) .back-to-top:hover,
:global(.dark) .back-to-top:focus-visible {
  background: var(--color-primary-400);
}

.back-to-top:active {
  transform: translateY(-1px) scale(0.96);
}

.b2t-ring {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
  pointer-events: none;
}

.b2t-ring-track {
  fill: none;
  stroke: rgba(255, 255, 255, 0.18);
  stroke-width: 2.5;
}

.b2t-ring-progress {
  fill: none;
  stroke: rgba(255, 255, 255, 0.95);
  stroke-width: 2.5;
  stroke-linecap: round;
  stroke-dasharray: 131.946;
  transition: stroke-dashoffset 0.18s linear;
}

.b2t-icon {
  position: relative;
  z-index: 1;
  transition: transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.back-to-top:hover .b2t-icon,
.back-to-top:focus-visible .b2t-icon {
  transform: translateY(-2px);
}

.is-bounce .b2t-icon {
  animation: b2t-rocket 0.7s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes b2t-rocket {
  0%   { transform: translateY(0); }
  35%  { transform: translateY(-14px); opacity: 0; }
  36%  { transform: translateY(14px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}

.b2t-fade-enter-active,
.b2t-fade-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.b2t-fade-enter-from,
.b2t-fade-leave-to {
  opacity: 0;
  transform: translateY(12px) scale(0.85);
}

@media (prefers-reduced-motion: reduce) {
  .back-to-top,
  .b2t-icon,
  .b2t-ring-progress {
    transition: none;
  }
  .is-bounce .b2t-icon {
    animation: none;
  }
}
</style>
