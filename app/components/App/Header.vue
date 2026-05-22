<template>
  <header
    class="flex items-center justify-between p-4 sticky top-0 z-50 w-full transition-colors duration-300 bg-white/5 backdrop-blur-lg border-b border-black/20 dark:bg-gray-900/5 dark:border-white/20"
  >
    <button
      ref="hamburgerBtn"
      class="group/btn lg:hidden p-2 cursor-pointer relative rounded-xl transition-colors duration-300 hover:bg-black/5 focus-visible:bg-black/5 focus-visible:outline-none dark:hover:bg-white/8 dark:focus-visible:bg-white/8"
      :aria-label="$t('nav.toggleMenu')"
      :aria-expanded="isMenuOpen"
      @click="onHamburgerClick"
    >
      <span
        class="relative inline-block w-[26px] h-[20px] align-middle"
        aria-hidden="true"
      >
        <span
          class="absolute left-0 right-0 h-[2.5px] bg-current rounded-full origin-center transition-all duration-500 ease-[cubic-bezier(0.65,0.05,0.36,1)] motion-reduce:transition-none top-0"
          :class="isMenuOpen ? 'translate-y-[8.75px] rotate-45' : ''"
        ></span>
        <span
          class="absolute left-0 right-0 h-[2.5px] bg-current rounded-full origin-center transition-all duration-500 ease-[cubic-bezier(0.65,0.05,0.36,1)] motion-reduce:transition-none top-1/2"
          :class="isMenuOpen ? 'opacity-0 -translate-y-1/2 scale-x-0' : '-translate-y-1/2 w-[75%] group-hover/btn:w-full'"
        ></span>
        <span
          class="absolute left-0 right-0 h-[2.5px] bg-current rounded-full origin-center transition-all duration-500 ease-[cubic-bezier(0.65,0.05,0.36,1)] motion-reduce:transition-none bottom-0"
          :class="isMenuOpen ? 'w-full -translate-y-[8.75px] -rotate-45' : 'w-[55%] group-hover/btn:w-full'"
        ></span>
      </span>
    </button>

    <nav
      class="hidden lg:flex items-center justify-center gap-14 xl:gap-24 flex-1"
      aria-label="Main Navigation"
    >
      <NuxtLink
        v-for="link in leftLinks"
        :key="link.to"
        :to="link.to"
        :data-active="activeId === link.section || undefined"
        :aria-current="activeId === link.section ? 'true' : undefined"
        class="group/nav relative flex items-center gap-2 py-1 text-base font-medium tracking-tight text-gray-700 transition-colors duration-200 hover:text-primary-600 dark:text-gray-200 dark:hover:text-primary-300 data-[active]:text-primary-600 dark:data-[active]:text-primary-300"
        @click="closeMenu"
      >
        <Icon
          :name="link.icon"
          class="h-4 w-4 shrink-0 opacity-60 transition-opacity duration-200 group-hover/nav:opacity-100 group-data-[active]/nav:opacity-100"
          aria-hidden="true"
        />
        <span>{{ $t(link.label) }}</span>
        <span
          class="pointer-events-none absolute -bottom-1 left-0 right-0 h-[2px] origin-left scale-x-0 rounded-full bg-primary-500 transition-transform duration-300 ease-out group-hover/nav:scale-x-100 group-data-[active]/nav:scale-x-100 dark:bg-primary-300"
          aria-hidden="true"
        />
      </NuxtLink>
      <NuxtLink
        to="#intro"
        :aria-label="$t('nav.home')"
        class="shrink-0"
        @click="closeMenu"
      >
        <NuxtImg
          src="/bj.png"
          :alt="$t('nav.logoAlt')"
          class="h-12 w-auto transform hover:scale-110 transition-transform duration-300"
          format="webp"
        />
      </NuxtLink>
      <NuxtLink
        v-for="link in rightLinks"
        :key="link.to"
        :to="link.to"
        :data-active="activeId === link.section || undefined"
        :aria-current="activeId === link.section ? 'true' : undefined"
        class="group/nav relative flex items-center gap-2 py-1 text-base font-medium tracking-tight text-gray-700 transition-colors duration-200 hover:text-primary-600 dark:text-gray-200 dark:hover:text-primary-300 data-[active]:text-primary-600 dark:data-[active]:text-primary-300"
        @click="closeMenu"
      >
        <Icon
          :name="link.icon"
          class="h-4 w-4 shrink-0 opacity-60 transition-opacity duration-200 group-hover/nav:opacity-100 group-data-[active]/nav:opacity-100"
          aria-hidden="true"
        />
        <span>{{ $t(link.label) }}</span>
        <span
          class="pointer-events-none absolute -bottom-1 left-0 right-0 h-[2px] origin-left scale-x-0 rounded-full bg-primary-500 transition-transform duration-300 ease-out group-hover/nav:scale-x-100 group-data-[active]/nav:scale-x-100 dark:bg-primary-300"
          aria-hidden="true"
        />
      </NuxtLink>
    </nav>
    <button
      type="button"
      class="cmdk-hint hidden md:inline-flex absolute right-20 top-1/2 -translate-y-1/2 items-center gap-2 px-3 py-1.5 rounded-lg border border-black/5 bg-black/[0.03] text-gray-700 transition-colors duration-200 hover:border-primary-200 hover:bg-primary-50 hover:text-primary-700 dark:border-white/5 dark:bg-white/[0.04] dark:text-gray-200 dark:hover:border-primary-400/30 dark:hover:bg-primary-900/30 dark:hover:text-primary-200"
      :aria-label="$t('cmdk.openHint')"
      @click="openCommandPalette"
    >
      <Icon
        name="lucide:search"
        size="16"
        aria-hidden="true"
      />
      <span class="text-sm opacity-80">{{ $t('cmdk.search') }}</span>
      <kbd class="font-mono text-[0.7rem] py-[0.15rem] px-[0.45rem] rounded-[0.3rem] bg-black/[0.06] border border-black/10 leading-none dark:bg-white/[0.08] dark:border-white/[0.14]">{{ modKey }} K</kbd>
    </button>
    <button
      ref="themeButton"
      :aria-label="$t('nav.toggleTheme')"
      class="grid h-10 w-10 place-items-center rounded-full border border-black/5 bg-black/[0.03] text-gray-700 transition-colors duration-300 hover:border-primary-200 hover:bg-primary-50 hover:text-primary-700 dark:border-white/5 dark:bg-white/[0.04] dark:text-gray-200 dark:hover:border-primary-400/30 dark:hover:bg-primary-900/30 dark:hover:text-primary-200"
      @click="toggleTheme"
    >
      <span
        ref="iconWrapper"
        class="flex"
      >
        <Icon
          :name="
            colorMode.value === 'light'
              ? 'lucide:sun'
              : 'lucide:moon'
          "
          size="20"
          class="text-current"
          aria-hidden="true"
        />
      </span>
    </button>
    <div
      ref="mobileMenu"
      class="absolute left-4 right-4 top-[calc(100%+8px)] p-4 rounded-2xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-2xl border border-black/10 dark:border-white/10 z-40 lg:hidden origin-top-left transition-all duration-400 ease-[cubic-bezier(0.34,1.56,0.64,1)] motion-reduce:transition-none"
      :class="isMenuOpen ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto' : 'opacity-0 -translate-y-2 scale-96 pointer-events-none'"
      role="dialog"
      aria-modal="true"
      :aria-hidden="!isMenuOpen"
      :inert="!isMenuOpen"
      :aria-label="$t('nav.toggleMenu')"
    >
      <div class="mobile-link opacity-0 will-change-[transform,opacity] flex items-center justify-between gap-3 pb-3 mb-3 border-b border-black/10 dark:border-white/10">
        <a
          href="#intro"
          class="flex items-center gap-3 group"
          :aria-label="$t('nav.home')"
          @click="closeMenu"
        >
          <NuxtImg
            src="/bj.png"
            :alt="$t('nav.logoAlt')"
            class="h-10 w-auto group-hover:scale-110 transition-transform duration-300"
            format="webp"
            loading="eager"
          />
          <span class="font-semibold text-base text-gray-900 dark:text-gray-50">
            {{ $t('global.name') }}
          </span>
        </a>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
        <a
          v-for="link in links"
          :key="link.to"
          :href="link.to"
          :data-active="activeId === link.section || undefined"
          :aria-current="activeId === link.section ? 'true' : undefined"
          class="mobile-link opacity-0 will-change-[transform,opacity] group w-full py-3 px-3 rounded-xl flex items-center gap-3 transition-colors duration-200 hover:bg-primary-50 dark:hover:bg-white/5 data-[active]:bg-primary-50 dark:data-[active]:bg-primary-900/30"
          @click="closeMenu"
        >
          <span class="w-9 h-9 grid place-items-center rounded-lg bg-primary-50 text-primary-700 transition-transform duration-300 shrink-0 group-hover:scale-110 group-data-[active]:scale-110 group-data-[active]:bg-primary-100 dark:bg-primary-900/40 dark:text-primary-300 dark:group-data-[active]:bg-primary-900/60">
            <Icon
              :name="link.icon"
              size="18"
              aria-hidden="true"
            />
          </span>
          <span class="font-medium text-base truncate text-gray-800 group-data-[active]:text-primary-700 dark:text-gray-100 dark:group-data-[active]:text-primary-200">{{ $t(link.label) }}</span>
          <Icon
            name="lucide:arrow-right"
            size="16"
            class="ml-auto shrink-0 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 group-data-[active]:opacity-100 group-data-[active]:translate-x-0 transition-all duration-300 text-primary-600 dark:text-primary-300"
            aria-hidden="true"
          />
        </a>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'
import type { gsap } from 'gsap'

const colorMode = useColorMode()
const { open: openCommandPalette } = useCommandPalette()
const modKey = import.meta.client && /Mac|iPhone|iPad/.test(navigator.platform) ? '⌘' : 'Ctrl'

const iconWrapper = useTemplateRef('iconWrapper')
const mobileMenu = useTemplateRef<HTMLElement>('mobileMenu')
const themeButton = useTemplateRef('themeButton')
const hamburgerBtn = useTemplateRef<HTMLElement>('hamburgerBtn')
const isMenuOpen = shallowRef(false)

const { $gsap } = useNuxtApp() as unknown as { $gsap: typeof gsap }

const toggleTheme = () => {
  $gsap.to(iconWrapper.value, {
    rotation: colorMode.value === 'light' ? 90 : -90,
    opacity: 0,
    duration: 0.4,
    ease: 'power2.inOut',
    onComplete: () => {
      colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
      $gsap.fromTo(
        iconWrapper.value,
        {
          rotation: colorMode.value === 'light' ? -90 : 90,
          opacity: 0,
        },
        { rotation: 0, opacity: 1, duration: 0.4, ease: 'power2.inOut' },
      )
    },
  })
}

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const closeMenu = () => {
  isMenuOpen.value = false
}

watch(isMenuOpen, async (open) => {
  if (!open || !mobileMenu.value) return
  await nextTick()
  const items = mobileMenu.value.querySelectorAll('.mobile-link')
  $gsap.fromTo(
    items,
    { x: -28, opacity: 0 },
    {
      x: 0,
      opacity: 1,
      duration: 0.55,
      ease: 'power3.out',
      stagger: 0.07,
      delay: 0.15,
    },
  )
})

const clickStamps: number[] = []
const easterEggActive = shallowRef(false)

const onHamburgerClick = () => {
  toggleMenu()

  const now = Date.now()
  clickStamps.push(now)
  while (clickStamps.length > 5) clickStamps.shift()

  if (
    clickStamps.length === 5
    && now - clickStamps[0]! < 2000
    && !easterEggActive.value
  ) {
    clickStamps.length = 0
    triggerEasterEgg()
  }
}

const triggerEasterEgg = () => {
  if (!import.meta.client) return
  easterEggActive.value = true

  const emojis = ['⚔️', '🛡️', '🐉', '🎲', '✨', '🧙', '🏰', '🔮', '📜']
  const count = 28
  const container = document.createElement('div')
  container.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:9999;overflow:hidden;'
  document.body.appendChild(container)

  for (let i = 0; i < count; i++) {
    const el = document.createElement('span')
    el.textContent = emojis[Math.floor(Math.random() * emojis.length)] ?? '✨'
    el.style.cssText = `position:absolute;top:-48px;left:${Math.random() * 100}vw;font-size:${22 + Math.random() * 24}px;will-change:transform,opacity;user-select:none;`
    container.appendChild(el)

    $gsap.to(el, {
      y: window.innerHeight + 120,
      x: (Math.random() - 0.5) * 200,
      rotation: Math.random() * 720 - 360,
      opacity: 0,
      duration: 2.4 + Math.random() * 1.8,
      ease: 'power1.in',
      delay: Math.random() * 0.7,
    })
  }

  window.setTimeout(() => {
    container.remove()
    easterEggActive.value = false
  }, 5000)
}

onClickOutside(mobileMenu, () => closeMenu(), { ignore: [themeButton, hamburgerBtn] })

interface NavLink {
  to: string
  section: string
  label: string
  icon: string
}

const links: NavLink[] = [
  { to: '#references', section: 'references', label: 'nav.references', icon: 'lucide:message-square-quote' },
  { to: '#stack', section: 'stack', label: 'nav.stack', icon: 'lucide:layers' },
  { to: '#contact', section: 'contact', label: 'nav.contact', icon: 'lucide:mail' },
  { to: '#about', section: 'about', label: 'nav.about', icon: 'lucide:circle-user-round' },
]

const midIndex = Math.floor(links.length / 2)
const leftLinks = links.slice(0, midIndex)
const rightLinks = links.slice(midIndex)

const { activeId } = useActiveSection(
  links.map(l => ({ id: l.section, labelKey: l.label })),
)
</script>
