<template>
  <header
    class="flex items-center justify-between p-4 sticky top-0 z-50 w-full transition-colors duration-300 bg-white/5 backdrop-blur-lg border-b border-black/20 dark:bg-gray-900/5 dark:border-white/20"
  >
    <button
      ref="hamburgerBtn"
      class="hamburger-btn lg:hidden p-2 cursor-pointer relative"
      :aria-label="$t('nav.toggleMenu')"
      :aria-expanded="isMenuOpen"
      @click="onHamburgerClick"
    >
      <span
        class="hamburger-lines"
        :class="{ 'is-open': isMenuOpen }"
        aria-hidden="true"
      >
        <span class="line line-top"></span>
        <span class="line line-mid"></span>
        <span class="line line-bot"></span>
      </span>
    </button>

    <nav
      class="hidden lg:flex flex-wrap items-center justify-center space-x-16 xl:space-x-32 flex-1"
      aria-label="Main Navigation"
    >
      <NuxtLink
        v-for="link in leftLinks"
        :key="link.to"
        :to="link.to"
        class="flex items-center text-lg hover:text-fantasy-accent transition-colors dark:hover:text-dark-accent px-2 py-1 nav-link"
        @click="closeMenu"
      >
        <Icon
          :name="link.icon"
          class="w-6 h-6"
          aria-hidden="true"
        />
        <span class="ml-3">{{ $t(link.label) }}</span>
      </NuxtLink>
      <NuxtLink
        to="#intro"
        :aria-label="$t('nav.home')"
        @click="closeMenu"
      >
        <NuxtImg
          src="/bj.png"
          :alt="$t('nav.logoAlt')"
          class="h-12 w-auto transform hover:scale-110 transition-transform duration-300 ml-4"
          format="webp"
        />
      </NuxtLink>
      <NuxtLink
        v-for="link in rightLinks"
        :key="link.to"
        :href="link.to"
        class="flex items-center text-lg hover:text-fantasy-accent transition-colors dark:hover:text-dark-accent px-2 py-1 nav-link"
        @click="closeMenu"
      >
        <Icon
          :name="link.icon"
          class="w-6 h-6"
          aria-hidden="true"
        />
        <span class="ml-3">{{ $t(link.label) }}</span>
      </NuxtLink>
    </nav>
    <button
      type="button"
      class="cmdk-hint hidden md:inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 mr-2"
      :aria-label="$t('cmdk.openHint')"
      @click="openCommandPalette"
    >
      <Icon
        name="mdi:magnify"
        size="16"
        aria-hidden="true"
      />
      <span class="text-sm opacity-70">{{ $t('cmdk.search') }}</span>
      <kbd class="cmdk-hint-kbd">{{ modKey }} K</kbd>
    </button>
    <button
      ref="themeButton"
      :aria-label="$t('nav.toggleTheme')"
      class="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-300"
      @click="toggleTheme"
    >
      <span
        ref="iconWrapper"
        class="flex"
      >
        <Icon
          :name="
            colorMode.value === 'light'
              ? 'mingcute:sun-fill'
              : 'mingcute:moon-fill'
          "
          size="24"
          class="text-current"
          aria-hidden="true"
        />
      </span>
    </button>
    <div
      ref="mobileMenu"
      class="mobile-menu absolute left-4 right-4 top-[calc(100%+8px)] p-4 rounded-2xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-2xl border border-black/10 dark:border-white/10 z-40 lg:hidden"
      :class="{ 'is-open': isMenuOpen }"
      role="dialog"
      aria-modal="true"
      :aria-hidden="!isMenuOpen"
      :inert="!isMenuOpen"
      :aria-label="$t('nav.toggleMenu')"
    >
      <div class="mobile-link flex items-center justify-between gap-3 pb-3 mb-3 border-b border-black/10 dark:border-white/10">
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
          class="mobile-link group w-full py-3 px-3 rounded-xl flex items-center gap-3 hover:bg-primary-50 dark:hover:bg-white/5 transition-colors duration-200"
          @click="closeMenu"
        >
          <span class="w-9 h-9 grid place-items-center rounded-lg bg-primary-50 dark:bg-primary-900 text-primary-700 dark:text-primary-300 group-hover:scale-110 transition-transform duration-300 shrink-0">
            <Icon
              :name="link.icon"
              size="20"
              aria-hidden="true"
            />
          </span>
          <span class="font-medium text-base truncate">{{ $t(link.label) }}</span>
          <Icon
            name="mdi:arrow-right"
            size="16"
            class="ml-auto shrink-0 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-primary-600 dark:text-primary-300"
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

const links = [
  { to: '#references', label: 'nav.references', icon: 'mdi:book-open-variant' },
  { to: '#stack', label: 'nav.stack', icon: 'mdi:stack-overflow' },
  { to: '#contact', label: 'nav.contact', icon: 'mdi:email-outline' },
  { to: '#about', label: 'nav.about', icon: 'mdi:information-outline' },
]

const midIndex = Math.floor(links.length / 2)
const leftLinks = links.slice(0, midIndex)
const rightLinks = links.slice(midIndex)
</script>

<style lang="scss" scoped>
@mixin nav-link {
  position: relative;
  &::before {
    content: "";
    position: absolute;
    width: 0;
    height: 2px;
    bottom: -4px;
    left: 0;
    background: currentColor;
    transition: all 0.3s ease;
  }
  &:hover::before {
    width: 100%;
  }
}

.nav-link {
  @include nav-link;
}

.cmdk-hint-kbd {
  font-family: ui-monospace, monospace;
  font-size: 0.7rem;
  padding: 0.15rem 0.45rem;
  border-radius: 0.3rem;
  background: rgba(0, 0, 0, 0.07);
  border: 1px solid rgba(0, 0, 0, 0.1);
  line-height: 1;
}

:global(.dark) .cmdk-hint-kbd {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.14);
}

.hamburger-btn {
  border-radius: 12px;
  transition: background-color 0.3s ease;

  &:hover,
  &:focus-visible {
    background-color: rgba(0, 0, 0, 0.05);
    outline: none;
  }
}

:global(.dark) .hamburger-btn:hover,
:global(.dark) .hamburger-btn:focus-visible {
  background-color: rgba(255, 255, 255, 0.08);
}

.hamburger-lines {
  position: relative;
  display: inline-block;
  width: 26px;
  height: 20px;
  vertical-align: middle;
}

.line {
  position: absolute;
  left: 0;
  right: 0;
  height: 2.5px;
  background: currentColor;
  border-radius: 999px;
  transform-origin: center;
  transition:
    transform 0.5s cubic-bezier(0.65, 0.05, 0.36, 1),
    opacity 0.25s ease,
    width 0.4s cubic-bezier(0.65, 0.05, 0.36, 1);
}

.line-top    { top: 0; }
.line-mid    { top: 50%; transform: translateY(-50%); width: 75%; }
.line-bot    { bottom: 0; width: 55%; }

.hamburger-btn:hover .line-mid,
.hamburger-btn:hover .line-bot {
  width: 100%;
}

.is-open .line-top {
  transform: translateY(8.75px) rotate(45deg);
}
.is-open .line-mid {
  opacity: 0;
  transform: translateY(-50%) scaleX(0);
}
.is-open .line-bot {
  width: 100%;
  transform: translateY(-8.75px) rotate(-45deg);
}

.mobile-menu {
  opacity: 0;
  transform: translateY(-8px) scale(0.96);
  transform-origin: top left;
  transition:
    opacity 0.3s ease,
    transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  pointer-events: none;
}

.mobile-menu.is-open {
  opacity: 1;
  transform: translateY(0) scale(1);
  pointer-events: auto;
}

.mobile-link {
  opacity: 0;
  will-change: transform, opacity;
}

@media (prefers-reduced-motion: reduce) {
  .line,
  .mobile-menu {
    transition: none;
  }
}
</style>
