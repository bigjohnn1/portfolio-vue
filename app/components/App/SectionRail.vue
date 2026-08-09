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
      class="group fixed right-0 top-1/2 z-40 hidden h-[56px] w-[22px] -translate-y-1/2 cursor-pointer items-center justify-center rounded-l-lg border border-r-0 border-gray-900/10 bg-white/70 p-0 text-gray-900/60 shadow-sm backdrop-blur-md transition-[width,color] duration-[250ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:w-[28px] hover:text-gray-900 focus-visible:w-[28px] focus-visible:text-gray-900 focus-visible:outline-none motion-reduce:transition-none dark:border-white/10 dark:bg-gray-900/70 dark:text-gray-200/70 dark:hover:text-gray-100 dark:focus-visible:text-gray-100 lg:inline-flex"
      :aria-label="t('nav.sectionsLabel')"
      :aria-hidden="!drawerVisible"
      @mouseenter="reveal"
      @focus="reveal"
      @click="pin"
    >
      <svg
        viewBox="0 0 12 18"
        aria-hidden="true"
        class="h-[14px] w-[10px] transition-transform duration-[250ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:-translate-x-px group-focus-visible:-translate-x-px motion-reduce:transition-none"
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
      class="fixed right-[clamp(1rem,2.2vw,2rem)] top-1/2 z-40 hidden -translate-y-1/2 text-gray-900 pointer-events-auto dark:text-gray-100 lg:block"
      :aria-label="t('nav.sectionsLabel')"
      :aria-hidden="!visible"
    >
      <div class="relative flex w-[28px] flex-col items-center">
        <div
          class="absolute bottom-[7px] top-[7px] w-[1px] bg-gray-900/10 dark:bg-white/10"
          aria-hidden="true"
        >
          <div
            class="absolute inset-0 origin-top bg-gray-900 opacity-60 transition-transform duration-200 ease-linear dark:bg-white motion-reduce:transition-none"
            :style="{ transform: `scaleY(${progress})` }"
          />
        </div>

        <ul class="relative z-10 m-0 flex w-full flex-col gap-[1.25rem] p-0 list-none">
          <li
            v-for="(section, index) in sections"
            :key="section.id"
            class="relative flex w-full justify-center"
          >
            <a
              :href="`#${section.id}`"
              :class="[
                'group flex h-[14px] w-[14px] items-center justify-center outline-none',
                { 'is-active': activeId === section.id },
              ]"
              :aria-current="activeId === section.id ? 'true' : undefined"
              :aria-label="t(section.labelKey)"
              @click.prevent="scrollTo(section.id)"
            >
              <span
                class="absolute right-[calc(100%+0.75rem)] top-1/2 flex -translate-y-1/2 translate-x-2 items-center gap-2 whitespace-nowrap rounded-full border border-gray-900/10 bg-white/70 px-2.5 py-1 text-[0.75rem] font-medium tracking-wide uppercase opacity-0 shadow-sm backdrop-blur-md transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] pointer-events-none group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 group-[.is-active]:translate-x-0 group-[.is-active]:opacity-100 dark:border-white/10 dark:bg-gray-900/70 motion-reduce:transition-none"
              >
                <span class="tabular-nums text-gray-900/50 dark:text-gray-100/50">
                  {{ String(index + 1).padStart(2, '0') }}
                </span>
                <span>{{ t(section.labelKey) }}</span>
              </span>

              <span
                class="relative block h-[6px] w-[6px] rounded-full bg-current opacity-30 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] after:absolute after:-inset-[4px] after:scale-50 after:rounded-full after:border after:border-current after:opacity-0 after:transition-all after:duration-300 group-hover:scale-125 group-hover:opacity-100 group-focus-visible:scale-125 group-focus-visible:opacity-100 group-[.is-active]:scale-110 group-[.is-active]:opacity-100 group-[.is-active]:after:scale-100 group-[.is-active]:after:opacity-50 motion-reduce:transition-none"
                aria-hidden="true"
              />
            </a>
          </li>
        </ul>

        <div class="absolute top-[calc(100%+2rem)] flex w-full justify-center">
          <AppLocaleSwitcher
            ref="localeSwitcherRef"
            :panel-class="railPanelClass"
            :item-class="railItemClass"
            :active-item-class="railActiveItemClass"
            icon-class="h-[16px] w-[16px] shrink-0"
            :transition="railTransition"
          >
            <template #trigger="{ toggle, isOpen, currentLocale }">
              <button
                type="button"
                class="group/lang relative grid h-[28px] w-[28px] cursor-pointer place-items-center rounded-full border border-gray-900/10 bg-white/70 text-gray-900/80 shadow-sm backdrop-blur-md transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:scale-110 hover:text-gray-900 focus-visible:scale-110 focus-visible:text-gray-900 focus-visible:outline-none dark:border-white/10 dark:bg-gray-900/70 dark:text-gray-200/80 dark:hover:text-gray-100 motion-reduce:transition-none"
                :aria-haspopup="true"
                :aria-expanded="isOpen"
                :aria-label="t('nav.switchLanguage')"
                @click="toggle"
              >
                <Icon
                  :name="currentLocale.icon ?? 'mdi:translate'"
                  class="h-[16px] w-[16px]"
                  aria-hidden="true"
                />
                <span class="sr-only">{{ currentLocale.name }}</span>
              </button>
            </template>
          </AppLocaleSwitcher>
        </div>
      </div>
    </nav>
  </Transition>
</template>

<script setup lang="ts">
import {
  useScroll,
  useIdle,
  useMagicKeys,
  usePreferredReducedMotion,
} from '@vueuse/core'

import type { SectionDef } from '~/composables/useActiveSection'

const { t } = useI18n()

const localeSwitcherRef = useTemplateRef<{ close: () => void }>('localeSwitcherRef')

const railPanelClass = 'absolute right-0 top-[calc(100%+0.75rem)] z-50 m-0 flex w-[130px] origin-top-right flex-col gap-1 rounded-xl border border-gray-900/10 bg-white/85 p-1.5 text-[0.8rem] text-gray-900/85 shadow-lg backdrop-blur-md will-change-transform dark:border-white/10 dark:bg-gray-900/85 dark:text-gray-100/90'
const railItemClass = 'flex cursor-pointer select-none items-center gap-2.5 rounded-lg px-2.5 py-2 transition-colors duration-200 font-medium hover:bg-gray-900/5 dark:hover:bg-white/5'
const railActiveItemClass = '!bg-primary-50 !font-semibold !text-primary-900 dark:!bg-primary-900/40 dark:!text-primary-100 hover:!bg-primary-50 dark:hover:!bg-primary-900/40'
const railTransition = {
  enterActive: 'transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]',
  enterFrom: 'opacity-0 -translate-y-2 scale-95',
  leaveActive: 'transition-all duration-200 ease-out',
  leaveTo: 'opacity-0 -translate-y-2 scale-95',
}

const sections: SectionDef[] = [
  { id: 'intro', labelKey: 'nav.intro' },
  { id: 'references', labelKey: 'nav.references' },
  { id: 'stack', labelKey: 'nav.stack' },
  { id: 'activity', labelKey: 'nav.activity' },
  { id: 'contact', labelKey: 'nav.contact' },
  { id: 'about', labelKey: 'nav.about' },
  { id: 'blog-preview', labelKey: 'nav.blog' },
]

const pinned = shallowRef(false)
const idleHidden = shallowRef(false)
const hideY = shallowRef(0)
const { activeId, progress } = useActiveSection(sections)
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

watch(visible, (v) => {
  if (!v) localeSwitcherRef.value?.close()
})
</script>
