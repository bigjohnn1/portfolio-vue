<template>
  <section
    id="stack"
    class="relative w-full overflow-hidden bg-base-bg py-section-y text-base-text dark:bg-transparent"
  >
    <div
      ref="rootEl"
      class="relative z-10 mx-auto max-w-6xl px-section-x"
    >
      <header class="mb-12 flex flex-col items-center text-center">
        <h2 class="text-d-md font-bold text-gray-900 dark:text-gray-50">
          {{ $t('techStack.title') }}
        </h2>
        <p class="mt-3 max-w-prose text-lg text-gray-600 dark:text-gray-400">
          {{ $t('techStack.description') }}
        </p>
      </header>

      <div class="flex flex-col gap-10">
        <div
          v-for="category in STACK_CATEGORIES"
          :key="category"
        >
          <header class="flex items-center gap-3">
            <h3 class="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-gray-500 dark:text-gray-400">
              {{ $t(`techStack.categories.${category}`) }}
            </h3>
            <span
              aria-hidden="true"
              class="h-px flex-1 bg-gradient-to-r from-gray-200 via-gray-200/40 to-transparent dark:from-white/10 dark:via-white/5"
            />
          </header>

          <ul class="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            <li
              v-for="tech in STACK[category]"
              :key="tech.key"
              ref="tileEls"
              :data-tech="tech.key"
              :style="{ '--tech-accent': tech.accent }"
              tabindex="0"
              class="group relative flex flex-col items-center gap-3 overflow-hidden rounded-2xl border border-gray-200/80 bg-white/90 px-3 py-5 text-center shadow-[0_1px_3px_rgba(15,23,42,0.05),0_12px_30px_-20px_rgba(15,23,42,0.35)] outline-none transition-[transform,border-color,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:border-[rgb(var(--tech-accent)/0.55)] hover:shadow-[0_1px_3px_rgba(15,23,42,0.05),0_16px_34px_-22px_rgb(var(--tech-accent)/0.9)] focus-visible:-translate-y-1 focus-visible:border-[rgb(var(--tech-accent)/0.55)] focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:focus-visible:translate-y-0 dark:border-white/10 dark:bg-gray-900/70 dark:backdrop-blur-sm dark:focus-visible:ring-offset-gray-900"
            >
              <span
                aria-hidden="true"
                class="pointer-events-none absolute inset-x-0 -top-8 h-20 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none [background:radial-gradient(circle,rgb(var(--tech-accent)/0.55),transparent_70%)]"
              />
              <Icon
                :name="tech.icon"
                class="relative h-10 w-10 transition-transform duration-300 ease-out group-hover:scale-110 group-focus-visible:scale-110 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                aria-hidden="true"
              />
              <span class="relative text-sm font-semibold tracking-tight text-gray-800 dark:text-gray-100">
                {{ $t(`techStack.items.${tech.key}.name`) }}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import tippy from 'tippy.js'
import type { Instance } from 'tippy.js'
import { useElementVisibility, usePreferredReducedMotion } from '@vueuse/core'
import 'tippy.js/dist/tippy.css'
import 'tippy.js/themes/light.css'

type StackCategory = 'frontend' | 'backend' | 'data' | 'platform'

interface StackItem {
  key: string
  icon: string
  accent: string
}

const STACK: Record<StackCategory, StackItem[]> = {
  frontend: [
    { key: 'vue', icon: 'logos:vue', accent: '65 184 131' },
    { key: 'nuxt', icon: 'logos:nuxt-icon', accent: '0 220 130' },
    { key: 'typescript', icon: 'logos:typescript-icon', accent: '49 120 198' },
    { key: 'javascript', icon: 'logos:javascript', accent: '247 223 30' },
    { key: 'react', icon: 'logos:react', accent: '97 218 251' },
    { key: 'nextjs', icon: 'logos:nextjs-icon', accent: '148 163 184' },
    { key: 'tailwind', icon: 'logos:tailwindcss-icon', accent: '56 189 248' },
    { key: 'unocss', icon: 'logos:unocss', accent: '148 163 184' },
  ],
  backend: [
    { key: 'nodejs', icon: 'logos:nodejs-icon', accent: '95 160 78' },
    { key: 'nitro', icon: 'unjs:nitro', accent: '251 191 36' },
    { key: 'php', icon: 'logos:php', accent: '119 123 180' },
    { key: 'bun', icon: 'logos:bun', accent: '244 114 182' },
  ],
  data: [
    { key: 'postgresql', icon: 'logos:postgresql', accent: '51 103 145' },
    { key: 'zenstack', icon: 'logos:prisma', accent: '99 102 241' },
  ],
  platform: [
    { key: 'cloudflare', icon: 'logos:cloudflare-icon', accent: '243 128 32' },
    { key: 'vercel', icon: 'logos:vercel-icon', accent: '148 163 184' },
    { key: 'dokploy', icon: 'selfhst:dokploy', accent: '148 163 184' },
    { key: 'docker', icon: 'logos:docker-icon', accent: '36 150 237' },
    { key: 'linux', icon: 'logos:linux-tux', accent: '250 204 21' },
    { key: 'git', icon: 'logos:git-icon', accent: '240 80 51' },
  ],
}

const STACK_CATEGORIES = Object.keys(STACK) as StackCategory[]

const { t, locale } = useI18n()
const { $gsap } = useNuxtApp()
const colorMode = useColorMode()
const reducedMotion = usePreferredReducedMotion()

const rootEl = useTemplateRef<HTMLElement>('rootEl')
const tileEls = useTemplateRef<HTMLElement[]>('tileEls')
const tippyInstances = shallowRef<Instance[]>([])

const isVisible = useElementVisibility(rootEl)

const activeTheme = computed(() => (colorMode.value === 'dark' ? '' : 'light'))
const activeDuration = computed(() => (reducedMotion.value === 'reduce' ? 0 : 200))

const describe = (el: HTMLElement) => t(`techStack.items.${el.dataset.tech}.description`)

onMounted(() => {
  tippyInstances.value = (tileEls.value ?? []).map(el =>
    tippy(el, {
      content: describe(el),
      placement: 'top',
      theme: activeTheme.value,
      duration: activeDuration.value,
    }),
  )
})

watch(locale, () => {
  tippyInstances.value.forEach((instance, index) => {
    const el = tileEls.value?.[index]
    if (el) instance.setContent(describe(el))
  })
})

watch([activeTheme, activeDuration], ([theme, duration]) => {
  tippyInstances.value.forEach(instance => instance.setProps({ theme, duration }))
})

const stopVisibilityWatch = watch(isVisible, (visible) => {
  if (!visible) return
  stopVisibilityWatch()
  if (reducedMotion.value === 'reduce' || !tileEls.value?.length) return

  $gsap.from(tileEls.value, {
    y: 16,
    opacity: 0,
    duration: 0.5,
    ease: 'power3.out',
    stagger: 0.025,
    clearProps: 'all',
  })
})

onBeforeUnmount(() => {
  tippyInstances.value.forEach(instance => instance.destroy())
})
</script>
