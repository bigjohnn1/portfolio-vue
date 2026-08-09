<template>
  <div
    ref="rootEl"
    class="relative inline-flex cursor-help items-center gap-[0.6rem] rounded-full p-1 outline-none"
    :aria-describedby="tooltipId"
    tabindex="0"
    @mouseenter="show"
    @mouseleave="hide"
    @focusin="show"
    @focusout="hide"
  >
    <svg
      class="h-7 w-7 shrink-0"
      viewBox="0 0 40 40"
      role="img"
      :aria-label="`${t('contact.localTime')} ${digital}`"
    >
      <circle
        cx="20"
        cy="20"
        r="18"
        fill="none"
        stroke="currentColor"
        stroke-width="1"
        class="opacity-[0.35]"
      />
      <g
        stroke="currentColor"
        stroke-width="1"
        stroke-linecap="round"
        class="opacity-[0.55]"
      >
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
          stroke="currentColor"
          stroke-width="1.8"
          stroke-linecap="round"
          class="opacity-95"
        />
      </g>
      <g :transform="`rotate(${minuteAngle} 20 20)`">
        <line
          x1="20"
          y1="20"
          x2="20"
          y2="6.5"
          stroke="currentColor"
          stroke-width="1.1"
          stroke-linecap="round"
          class="opacity-85"
        />
      </g>
      <circle
        cx="20"
        cy="20"
        r="1.4"
        fill="currentColor"
      />
    </svg>

    <span class="inline-flex flex-col text-[0.7rem] leading-[1.05] tracking-[0.04em]">
      <span class="text-[0.62rem] uppercase opacity-60">{{ t('about.card.location') }}</span>
      <NuxtTime
        class="text-[0.82rem] font-semibold tabular-nums"
        :datetime="now"
        :locale="intlLocale"
        hour="2-digit"
        minute="2-digit"
        time-zone="Europe/Prague"
      />
    </span>

    <Teleport to="body">
      <Transition
        enter-active-class="transition-[opacity,transform] duration-[280ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] motion-reduce:transition-opacity motion-reduce:duration-150"
        enter-from-class="opacity-0 translate-y-[calc(-100%+6px)] motion-reduce:-translate-y-full"
        leave-active-class="transition-[opacity,transform] duration-[200ms] ease-out motion-reduce:transition-opacity motion-reduce:duration-150"
        leave-to-class="opacity-0 translate-y-[calc(-100%+6px)] motion-reduce:-translate-y-full"
      >
        <span
          v-if="visible"
          :id="tooltipId"
          role="tooltip"
          class="pointer-events-none fixed z-[9999] -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-lg bg-gray-900 px-[0.65rem] py-[0.4rem] text-[0.72rem] font-medium text-gray-50 shadow-[0_8px_22px_rgba(0,0,0,0.32)] after:absolute after:left-1/2 after:top-full after:-translate-x-1/2 after:border-[5px] after:border-transparent after:border-t-gray-900 dark:bg-gray-50 dark:text-gray-900 dark:after:border-t-gray-50"
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

const intlLocale = computed(() => toIntlLocale(locale.value))

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
  return new Intl.DateTimeFormat(intlLocale.value, {
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
