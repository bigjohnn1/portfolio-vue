<template>
  <article
    ref="cardEl"
    class="group relative isolate overflow-hidden rounded-2xl border border-gray-200/80 bg-white p-6 shadow-[0_1px_3px_rgba(17,24,39,0.04),0_8px_24px_-12px_rgba(17,24,39,0.08)] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-[3px] hover:border-transparent motion-reduce:transition-none motion-reduce:hover:translate-y-0 dark:border-gray-700/60 dark:bg-gray-800/80"
    :style="cardStyle"
    @mousemove="onMove"
    @mouseleave="onLeave"
  >
    <span
      class="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100 motion-reduce:transition-none"
      :style="spotlightStyle"
      aria-hidden="true"
    />

    <span
      :class="['pointer-events-none absolute left-0 top-0 h-full w-[3px] origin-top scale-y-0 rounded-r-full transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-y-100 motion-reduce:transition-none', fact.rail]"
      aria-hidden="true"
    />

    <span
      v-if="fact.key === 'rpg'"
      aria-hidden="true"
      class="pointer-events-none absolute -bottom-6 -right-3 select-none font-serif text-[7.5rem] leading-none text-violet-500/[0.06] transition-all duration-700 ease-out group-hover:translate-x-[-4px] group-hover:rotate-[6deg] group-hover:text-violet-500/[0.13] dark:text-violet-300/[0.07] dark:group-hover:text-violet-300/[0.14]"
    >
      ᚱ
    </span>

    <div class="relative z-10 flex items-start gap-5">
      <span
        v-if="fact.key === 'learning'"
        class="relative grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-xl bg-indigo-50 dark:bg-indigo-500/15"
      >
        <svg
          viewBox="0 0 48 48"
          class="h-9 w-9 text-indigo-600 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-[1px] motion-reduce:transition-none dark:text-indigo-300"
        >
          <path
            d="M6 36 L14 30 L20 32 L28 20 L36 12 L42 6"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-dasharray="58"
            :stroke-dashoffset="isHovered ? 0 : 22"
            class="transition-[stroke-dashoffset] duration-700 ease-out motion-reduce:transition-none"
          />
          <circle
            cx="42"
            cy="6"
            r="2.4"
            fill="currentColor"
          >
            <animate
              attributeName="r"
              values="2;2.8;2"
              dur="2.4s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.55;1;0.55"
              dur="2.4s"
              repeatCount="indefinite"
            />
          </circle>
        </svg>
      </span>

      <span
        v-else-if="fact.key === 'lifestyle'"
        class="relative grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-amber-50 dark:bg-amber-500/15"
      >
        <Icon
          name="mdi:dumbbell"
          size="24"
          class="relative z-10 text-amber-600 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:rotate-[-8deg] motion-reduce:transition-none dark:text-amber-300"
          aria-hidden="true"
        />
      </span>

      <span
        v-else-if="fact.key === 'rpg'"
        class="relative grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-xl bg-violet-50 dark:bg-violet-500/15"
      >
        <svg
          viewBox="0 0 48 48"
          class="absolute inset-0 m-auto h-10 w-10 text-violet-600 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none dark:text-violet-300"
          :style="{ transform: `rotate(${diceRotation}deg)` }"
        >
          <polygon
            points="24,4 41,14 41,34 24,44 7,34 7,14"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linejoin="round"
          />
          <polygon
            points="24,12 36,32 12,32"
            fill="currentColor"
            fill-opacity="0.1"
            stroke="currentColor"
            stroke-width="1"
            stroke-linejoin="round"
          />
          <g
            stroke="currentColor"
            stroke-width="0.8"
            opacity="0.55"
          >
            <line
              x1="24"
              y1="12"
              x2="24"
              y2="4"
            />
            <line
              x1="36"
              y1="32"
              x2="41"
              y2="14"
            />
            <line
              x1="36"
              y1="32"
              x2="41"
              y2="34"
            />
            <line
              x1="12"
              y1="32"
              x2="7"
              y2="14"
            />
            <line
              x1="12"
              y1="32"
              x2="7"
              y2="34"
            />
            <line
              x1="36"
              y1="32"
              x2="24"
              y2="44"
            />
            <line
              x1="12"
              y1="32"
              x2="24"
              y2="44"
            />
          </g>
        </svg>
        <span class="relative z-10 font-bold text-[0.78rem] leading-none text-violet-700 tabular-nums dark:text-violet-200">
          {{ diceFace }}
        </span>
      </span>

      <div class="min-w-0 flex-1">
        <h4 class="text-lg font-semibold text-gray-900 dark:text-gray-50">
          {{ t(`about.facts.items.${fact.key}.title`) }}
        </h4>
        <p class="mt-1.5 leading-relaxed text-gray-600 dark:text-gray-400">
          {{ t(`about.facts.items.${fact.key}.description`) }}
        </p>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import {
  useElementHover,
} from '@vueuse/core'

interface Fact {
  key: 'learning' | 'lifestyle' | 'rpg'
  rail: string
  accentRgbLight: string
  accentRgbDark: string
}

const props = defineProps<{
  fact: Fact
}>()

const { t } = useI18n()
const colorMode = useColorMode()

const cardEl = useTemplateRef<HTMLElement>('cardEl')
const isHovered = useElementHover(cardEl)

const accentRgb = computed(() =>
  colorMode.value === 'dark' ? props.fact.accentRgbDark : props.fact.accentRgbLight,
)

const spotlight = shallowReactive({ x: 50, y: 50 })

const onMove = (e: MouseEvent) => {
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
  spotlight.x = ((e.clientX - rect.left) / rect.width) * 100
  spotlight.y = ((e.clientY - rect.top) / rect.height) * 100
}

const onLeave = () => {
  spotlight.x = 50
  spotlight.y = 50
}

const spotlightStyle = computed(() => ({
  background: `radial-gradient(420px circle at ${spotlight.x}% ${spotlight.y}%, rgba(${accentRgb.value} / 0.14), transparent 55%)`,
}))

const cardStyle = computed(() => {
  if (!isHovered.value) return {}
  const intensity = colorMode.value === 'dark' ? 0.35 : 0.18
  return {
    boxShadow: `0 1px 3px rgba(17,24,39,0.04), 0 18px 40px -16px rgba(${accentRgb.value} / ${intensity})`,
  }
})

const diceFace = shallowRef(20)
const diceRotation = shallowRef(0)
let rollTimer: ReturnType<typeof setInterval> | null = null

const stopRoll = () => {
  if (rollTimer) {
    clearInterval(rollTimer)
    rollTimer = null
  }
}

watch(isHovered, (v) => {
  if (props.fact.key !== 'rpg') return
  if (v) {
    rollTimer = setInterval(() => {
      diceFace.value = 1 + Math.floor(Math.random() * 20)
      diceRotation.value += 40 + Math.random() * 80
    }, 75)
  }
  else {
    stopRoll()
    diceFace.value = 20
  }
})

onBeforeUnmount(stopRoll)
</script>
