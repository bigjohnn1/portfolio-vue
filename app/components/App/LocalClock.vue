<template>
  <div
    ref="rootEl"
    class="local-clock"
    :aria-describedby="tooltipId"
    tabindex="0"
    @mouseenter="show"
    @mouseleave="hide"
    @focusin="show"
    @focusout="hide"
  >
    <svg
      class="clock-svg"
      viewBox="0 0 40 40"
      role="img"
      :aria-label="`${t('contact.localTime')} ${digital}`"
    >
      <circle
        cx="20"
        cy="20"
        r="18"
        class="clock-face"
      />
      <g class="ticks">
        <line
          x1="20"
          y1="3.5"
          x2="20"
          y2="6"
        />
        <line
          x1="36.5"
          y1="20"
          x2="34"
          y2="20"
        />
        <line
          x1="20"
          y1="36.5"
          x2="20"
          y2="34"
        />
        <line
          x1="3.5"
          y1="20"
          x2="6"
          y2="20"
        />
      </g>
      <g :transform="`rotate(${hourAngle} 20 20)`">
        <line
          x1="20"
          y1="20"
          x2="20"
          y2="11"
          class="hand hand-hour"
        />
      </g>
      <g :transform="`rotate(${minuteAngle} 20 20)`">
        <line
          x1="20"
          y1="20"
          x2="20"
          y2="6.5"
          class="hand hand-minute"
        />
      </g>
      <circle
        cx="20"
        cy="20"
        r="1.4"
        class="clock-center"
      />
    </svg>

    <span class="clock-meta">
      <span class="clock-city">{{ t('about.card.location') }}</span>
      <NuxtTime
        class="clock-time"
        :datetime="now"
        :locale="locale === 'cs' ? 'cs-CZ' : 'en-US'"
        hour="2-digit"
        minute="2-digit"
        time-zone="Europe/Prague"
      />
    </span>

    <Teleport to="body">
      <Transition name="clock-tip">
        <span
          v-if="visible"
          :id="tooltipId"
          role="tooltip"
          class="clock-tooltip"
          :style="tooltipStyle"
        >
          {{ tooltipText }}
        </span>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { useElementBounding, useNow } from '@vueuse/core'

const { t, locale } = useI18n()

const TARGET_TZ = 'Europe/Prague'
const tooltipId = useId()

const now = useNow({ interval: 30_000 })

const rootEl = useTemplateRef<HTMLElement>('rootEl')
const visible = shallowRef(false)

const { x, y, width, update } = useElementBounding(rootEl)

const show = () => {
  update()
  visible.value = true
}
const hide = () => {
  visible.value = false
}

const tooltipStyle = computed(() => ({
  left: `${x.value + width.value / 2}px`,
  top: `${y.value - 10}px`,
}))

const pragueTime = computed(() => {
  return new Date(now.value.toLocaleString('en-US', { timeZone: TARGET_TZ }))
})

const hourAngle = computed(() => {
  const h = pragueTime.value.getHours() % 12
  const m = pragueTime.value.getMinutes()
  return h * 30 + m * 0.5
})

const minuteAngle = computed(() => {
  return pragueTime.value.getMinutes() * 6
})

const digital = computed(() => {
  return new Intl.DateTimeFormat(locale.value === 'cs' ? 'cs-CZ' : 'en-US', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: TARGET_TZ,
  }).format(now.value)
})

const userTz = computed(() => {
  if (!import.meta.client) return TARGET_TZ
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || TARGET_TZ
  }
  catch {
    return TARGET_TZ
  }
})

const tooltipText = computed(() => {
  if (!import.meta.client) return digital.value
  if (userTz.value === TARGET_TZ) return t('contact.sameTimezone')

  const wall = (tz: string) =>
    new Date(now.value.toLocaleString('en-US', { timeZone: tz })).getTime()

  const diffMinutes = Math.round((wall(TARGET_TZ) - wall(userTz.value)) / 60_000)
  if (diffMinutes === 0) return t('contact.sameTimezone')

  const abs = Math.abs(diffMinutes)
  const hours = Math.floor(abs / 60)
  const minutes = abs % 60
  const diff = minutes === 0 ? `${hours}h` : `${hours}h ${minutes}m`

  return diffMinutes > 0
    ? t('contact.behindMe', { diff })
    : t('contact.aheadOfMe', { diff })
})
</script>

<style scoped>
.local-clock {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.25rem 0.25rem 0.25rem 0.25rem;
  border-radius: 9999px;
  cursor: help;
  outline: none;
}

.clock-svg {
  width: 28px;
  height: 28px;
  flex-shrink: 0;
}

.clock-face {
  fill: none;
  stroke: currentColor;
  stroke-width: 1;
  opacity: 0.35;
}

.ticks line {
  stroke: currentColor;
  stroke-width: 1;
  stroke-linecap: round;
  opacity: 0.55;
}

.hand {
  stroke: currentColor;
  stroke-linecap: round;
}

.hand-hour   { stroke-width: 1.8; opacity: 0.95; }
.hand-minute { stroke-width: 1.1; opacity: 0.85; }

.clock-center {
  fill: currentColor;
}

.clock-meta {
  display: inline-flex;
  flex-direction: column;
  line-height: 1.05;
  font-size: 0.7rem;
  letter-spacing: 0.04em;
}

.clock-city {
  font-size: 0.62rem;
  text-transform: uppercase;
  opacity: 0.6;
}

.clock-time {
  font-variant-numeric: tabular-nums;
  font-weight: 600;
  font-size: 0.82rem;
}

@media (prefers-reduced-motion: reduce) {
  .local-clock {
    transition: none;
  }
}
</style>

<style>
.clock-tooltip {
  position: fixed;
  transform: translate(-50%, -100%);
  white-space: nowrap;
  background: #111827;
  color: #f9fafb;
  font-size: 0.72rem;
  font-weight: 500;
  padding: 0.4rem 0.65rem;
  border-radius: 0.5rem;
  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.32);
  pointer-events: none;
  z-index: 9999;
}

.clock-tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 5px solid transparent;
  border-top-color: #111827;
}

html.dark .clock-tooltip {
  background: #f9fafb;
  color: #111827;
}

html.dark .clock-tooltip::after {
  border-top-color: #f9fafb;
}

.clock-tip-enter-active,
.clock-tip-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.28s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.clock-tip-enter-from,
.clock-tip-leave-to {
  opacity: 0;
  transform: translate(-50%, calc(-100% + 6px));
}

@media (prefers-reduced-motion: reduce) {
  .clock-tip-enter-active,
  .clock-tip-leave-active {
    transition: opacity 0.15s ease;
  }
  .clock-tip-enter-from,
  .clock-tip-leave-to {
    transform: translate(-50%, -100%);
  }
}
</style>
