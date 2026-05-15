<template>
  <Transition
    enter-active-class="transition-opacity duration-[200ms] ease-out motion-reduce:transition-none"
    leave-active-class="transition-opacity duration-[160ms] ease-out motion-reduce:transition-none"
    enter-from-class="opacity-0"
    leave-to-class="opacity-0"
  >
    <button
      v-show="drawerVisible"
      type="button"
      class="group fixed right-0 top-1/2 z-40 hidden h-[56px] w-[22px] -translate-y-1/2 cursor-pointer items-center justify-center rounded-l-lg border border-r-0 border-gray-900/[0.08] bg-white/70 p-0 text-gray-900/[0.65] shadow-[-4px_0_16px_rgba(17,24,39,0.06)] backdrop-blur-md transition-[width,color] duration-[250ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:w-[28px] hover:text-gray-900/[0.95] focus-visible:w-[28px] focus-visible:text-gray-900/[0.95] focus-visible:outline-none motion-reduce:transition-none dark:border-white/[0.08] dark:bg-gray-900/70 dark:text-gray-200/70 dark:shadow-[-4px_0_16px_rgba(0,0,0,0.3)] dark:hover:text-gray-200 dark:focus-visible:text-gray-200 lg:inline-flex"
      :aria-label="t('nav.sectionsLabel')"
      :aria-hidden="!drawerVisible"
      @mouseenter="reveal"
      @focus="reveal"
      @click="pin"
    >
      <svg
        viewBox="0 0 12 18"
        aria-hidden="true"
        class="h-[14px] w-[10px] transition-transform duration-[250ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:-translate-x-[1px] group-focus-visible:-translate-x-[1px] motion-reduce:transition-none"
      >
        <path
          d="M9 3 L3 9 L9 15"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </button>
  </Transition>

  <Transition
    enter-active-class="transition-opacity duration-[260ms] ease-out motion-reduce:transition-none"
    leave-active-class="transition-opacity duration-[200ms] ease-out motion-reduce:transition-none"
    enter-from-class="opacity-0"
    leave-to-class="opacity-0"
  >
    <nav
      v-show="visible"
      ref="rootEl"
      class="fixed right-[clamp(1rem,2.2vw,2rem)] top-1/2 z-40 hidden -translate-y-1/2 py-[0.4rem] text-gray-900/[0.85] pointer-events-auto motion-reduce:transition-none dark:text-gray-200/90 lg:block"
      :aria-label="t('nav.sectionsLabel')"
      :aria-hidden="!visible"
    >
      <span
        class="absolute bottom-[0.6rem] right-[0.62rem] top-[0.6rem] w-[1px] overflow-hidden bg-current opacity-[0.14]"
        aria-hidden="true"
      >
        <span
          class="absolute inset-0 origin-top bg-current opacity-70 transition-transform duration-[180ms] ease-linear motion-reduce:transition-none"
          :style="{ transform: `scaleY(${progress})` }"
        />
      </span>

      <ul class="relative m-0 flex flex-col gap-[1.1rem] list-none pr-[1.5rem]">
        <li
          v-for="(section, index) in sections"
          :key="section.id"
        >
          <a
            :href="`#${section.id}`"
            :class="['group relative flex h-[14px] items-center justify-end gap-[0.85rem] text-inherit no-underline outline-none', { 'is-active': activeId === section.id }]"
            :aria-current="activeId === section.id ? 'true' : undefined"
            :aria-label="t(section.labelKey)"
            @click.prevent="scrollTo(section.id)"
          >
            <span
              class="relative block h-[6px] w-[6px] rounded-full bg-current opacity-[0.35] transition-all duration-[250ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] after:absolute after:-inset-[6px] after:scale-50 after:rounded-full after:border after:border-current after:opacity-0 after:transition-all after:duration-[250ms] after:ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:opacity-90 group-focus-visible:opacity-90 group-focus-visible:shadow-[0_0_0_2px_currentColor] group-[.is-active]:scale-105 group-[.is-active]:opacity-100 group-[.is-active]:after:scale-100 group-[.is-active]:after:opacity-[0.55] motion-reduce:transition-none motion-reduce:after:transition-none"
              aria-hidden="true"
            />
            <span class="absolute right-[calc(100%+0.35rem)] top-1/2 flex -translate-y-1/2 translate-x-[0.4rem] items-baseline gap-[0.55rem] whitespace-nowrap rounded-full border border-gray-900/[0.08] bg-white/70 px-[0.55rem] py-[0.25rem] text-[0.72rem] tracking-[0.06em] uppercase opacity-0 backdrop-blur-[8px] transition-all duration-[200ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] pointer-events-none group-hover:-translate-y-1/2 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:-translate-y-1/2 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 group-[.is-active]:-translate-y-1/2 group-[.is-active]:translate-x-0 group-[.is-active]:opacity-100 dark:border-white/[0.08] dark:bg-gray-900/70 motion-reduce:transition-none">
              <span class="tabular-nums opacity-[0.45]">{{ String(index + 1).padStart(2, '0') }}</span>
              <span class="font-semibold">{{ t(section.labelKey) }}</span>
            </span>
          </a>
        </li>
      </ul>
    </nav>
  </Transition>
</template>

<script setup lang="ts">
import {
  useScroll,
  useIdle,
  useMagicKeys,
  useIntersectionObserver,
  usePreferredReducedMotion,
} from '@vueuse/core'
import { shallowRef, computed, watch, onMounted, nextTick } from 'vue'

interface SectionDef {
  id: string
  labelKey: string
}

const { t } = useI18n()

const sections: SectionDef[] = [
  { id: 'intro', labelKey: 'nav.intro' },
  { id: 'references', labelKey: 'nav.references' },
  { id: 'stack', labelKey: 'nav.stack' },
  { id: 'contact', labelKey: 'nav.contact' },
  { id: 'about', labelKey: 'nav.about' },
  { id: 'blog-preview', labelKey: 'nav.blog' },
]

const pinned = shallowRef(false)
const idleHidden = shallowRef(false)
const hideY = shallowRef(0)
const activeId = shallowRef<string>(sections[0]!.id)
const reducedMotion = usePreferredReducedMotion()

const IDLE_TIMEOUT = 6000
const REOPEN_SCROLL_RATIO = 0.1

const reveal = () => {
  idleHidden.value = false
}

const pin = () => {
  pinned.value = true
  idleHidden.value = false
}

const { y, arrivedState } = useScroll(import.meta.client ? window : null, {
  throttle: 80,
})

const progress = computed(() => {
  if (!import.meta.client) return 0
  const max = Math.max(
    document.documentElement.scrollHeight - window.innerHeight,
    1,
  )
  return Math.min(1, Math.max(0, y.value / max))
})

const pastIntro = computed(() => y.value > 240)
const atBottom = computed(() => arrivedState.bottom)
const inActiveRange = computed(() => pastIntro.value && !atBottom.value)

const visible = computed(() => {
  if (!inActiveRange.value) return false
  return pinned.value || !idleHidden.value
})

const drawerVisible = computed(() => {
  if (!inActiveRange.value || pinned.value) return false
  return idleHidden.value
})

const { idle } = useIdle(IDLE_TIMEOUT, { initialState: false })

watch(idle, (v) => {
  if (!v || !inActiveRange.value || pinned.value) return
  hideY.value = y.value
  idleHidden.value = true
})

watch(y, (cur) => {
  if (!idleHidden.value) return
  const max = Math.max(
    document.documentElement.scrollHeight - window.innerHeight,
    1,
  )
  if (Math.abs(cur - hideY.value) / max >= REOPEN_SCROLL_RATIO) {
    idleHidden.value = false
  }
})

const observeSections = () => {
  if (!import.meta.client) return
  sections.forEach((s) => {
    const el = document.getElementById(s.id)
    if (el) {
      useIntersectionObserver(
        el,
        ([entry]) => {
          if (entry?.isIntersecting) activeId.value = s.id
        },
        { threshold: 0, rootMargin: '-45% 0px -50% 0px' },
      )
    }
  })
}

onMounted(() => {
  nextTick(observeSections)
})

const scrollTo = (id: string) => {
  if (!import.meta.client) return
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({
      behavior: reducedMotion.value === 'reduce' ? 'auto' : 'smooth',
      block: 'start',
    })
  }
}

const keys = useMagicKeys()
const altDown = computed(() => !!keys['Alt+ArrowDown']?.value)
const altUp = computed(() => !!keys['Alt+ArrowUp']?.value)

const jump = (dir: 1 | -1) => {
  const idx = sections.findIndex(s => s.id === activeId.value)
  const next = sections[Math.min(sections.length - 1, Math.max(0, idx + dir))]
  if (next) scrollTo(next.id)
}

watch(altDown, (v) => {
  if (v) jump(1)
})

watch(altUp, (v) => {
  if (v) jump(-1)
})
</script>
