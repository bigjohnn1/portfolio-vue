<template>
  <header
    class="relative mx-auto p-4 sticky top-0 z-50 w-full transition-colors duration-300 bg-white/10 backdrop-blur-lg border-b border-black/20 dark:bg-gray-900/50 dark:border-white flex items-center justify-between"
  >
    <button
      class="hamburger-btn xl:hidden p-2 cursor-pointer"
      @click="toggleMenu"
    >
      <span ref="hamburgerIcon" class="inline-block">
        <Icon
          :name="isMenuOpen ? 'mingcute:close-fill' : 'mingcute:menu-fill'"
          size="24"
          class="text-current transition-transform duration-300"
        />
      </span>
    </button>

    <nav
      class="hidden xl:flex flex-wrap items-center justify-center space-x-32 flex-1"
    >
      <a
        v-for="link in leftLinks"
        :key="link.to"
        :href="link.to"
        class="text-lg hover:text-fantasy-accent transition-colors dark:hover:text-dark-accent relative duration-300 px-2 py-1 before:content-[''] before:absolute before:w-0 before:h-0.5 before:bottom-[-4px] before:left-0 before:bg-current before:transition-[width] before:duration-300 hover:before:w-full"
        @click="closeMenu"
      >
        {{ $t(link.label) }}
      </a>
      <a href="/" class="logo-link" @click="closeMenu">
        <NuxtImg
          src="/logo_bj.webp"
          alt="Site Logo"
          class="h-12 w-auto transform hover:scale-110 transition-transform duration-300 ml-4"
        />
      </a>
      <a
        v-for="link in rightLinks"
        :key="link.to"
        :href="link.to"
        class="text-lg hover:text-fantasy-accent transition-colors dark:hover:text-dark-accent relative duration-300 px-2 py-1 before:content-[''] before:absolute before:w-0 before:h-0.5 before:bottom-[-4px] before:left-0 before:bg-current before:transition-[width] before:duration-300 hover:before:w-full"
        @click="closeMenu"
      >
        {{ $t(link.label) }}
      </a>
    </nav>

    <button
      @click="toggleTheme"
      class="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-300"
    >
      <span ref="iconWrapper" class="inline-block">
        <Icon
          :name="
            themeStore.currentTheme === 'light'
              ? 'mingcute:sun-fill'
              : 'mingcute:moon-fill'
          "
          size="24"
          class="text-current"
        />
      </span>
    </button>

    <div
      v-if="isMenuOpen"
      v-click-outside="closeMenu"
      ref="mobileMenu"
      class="fixed left-0 top-[64px] w-full h-[calc(100vh-64px)] p-4 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg flex flex-col items-center gap-8 z-50 overflow-y-auto"
    >
      <a
        v-for="link in links"
        :key="link.to"
        :href="link.to"
        class="text-xl w-full text-center py-4 px-6 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 hover:text-light-accent dark:hover:text-dark-accent transition-colors duration-300"
        @click="closeMenu"
      >
        {{ $t(link.label) }}
      </a>
      <a href="/" class="logo-link my-4" @click="closeMenu">
        <NuxtImg
          src="/logo_bj.webp"
          alt="Site Logo"
          class="h-12 w-auto transform hover:scale-110 transition-transform duration-300"
        />
      </a>
    </div>
  </header>
</template>

<script lang="ts" setup>
import { useThemeStore } from "~/stores/theme";
import { gsap } from "gsap";
import { templateRef } from "@vueuse/core";
import { onClickOutside } from "@vueuse/core";

const themeStore = useThemeStore();
const iconWrapper = templateRef("iconWrapper");
const hamburgerIcon = templateRef("hamburgerIcon");
const mobileMenu = templateRef("mobileMenu");
const isMenuOpen = ref(false);

const toggleTheme = () => {
  gsap.to(iconWrapper.value, {
    rotation: themeStore.currentTheme === "light" ? 90 : -90,
    opacity: 0,
    duration: 0.4,
    ease: "power2.inOut",
    onComplete: () => {
      themeStore.toggleTheme();
      gsap.fromTo(
        iconWrapper.value,
        {
          rotation: themeStore.currentTheme === "light" ? -90 : 90,
          opacity: 0,
        },
        { rotation: 0, opacity: 1, duration: 0.4, ease: "power2.inOut" }
      );
    },
  });
};

const toggleMenu = () => {
  if (!isMenuOpen.value) {
    isMenuOpen.value = true;
    gsap.fromTo(
      mobileMenu.value,
      { x: "100%", opacity: 0 },
      { x: "0%", opacity: 1, duration: 0.4, ease: "power2.out" }
    );
  } else {
    gsap.to(mobileMenu.value, {
      x: "100%",
      opacity: 0,
      duration: 0.4,
      ease: "power2.in",
      onComplete: () => {
        isMenuOpen.value = false;
      },
    });
  }
};

const closeMenu = () => {
  if (isMenuOpen.value) {
    toggleMenu();
  }
};

onClickOutside(mobileMenu, () => {
  closeMenu();
});

const links = [
  { to: "#references", label: "nav.references" },
  { to: "#stack", label: "nav.stack" },
  { to: "#contact", label: "nav.contact" },
  { to: "#about", label: "nav.about" },
];

const midIndex = Math.floor(links.length / 2);
const leftLinks = links.slice(0, midIndex);
const rightLinks = links.slice(midIndex);
</script>
