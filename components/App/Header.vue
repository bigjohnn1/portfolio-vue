<template>
  <header
    class="relative mx-auto p-6 sticky top-0 z-50 w-full md:w-3/4 transition-colors duration-300 flex flex-wrap items-center justify-center bg-white/10 backdrop-blur-lg border-b border-black/20 dark:bg-gray-900/50 dark:border-white"
  >
    <div class="flex items-center justify-center flex-1 min-w-0">
      <nav
        class="hidden xl:flex flex-wrap items-center justify-center space-x-32"
      >
        <a
          v-for="link in leftLinks"
          :key="link.to"
          :href="link.to"
          class="text-lg hover:text-light-accent dark:hover:text-dark-accent relative transition-colors duration-300 px-2 py-1 after:content-[''] after:absolute after:w-0 after:h-0.5 after:bottom-[-4px] after:left-0 after:bg-current after:transition-[width] after:duration-300 hover:after:w-full"
          @click="closeMenu"
        >
          {{ $t(link.label) }}
        </a>
        <a href="/" class="logo-link" @click="closeMenu">
          <NuxtImg
            src="/logo_bj.webp"
            alt="Site Logo"
            class="h-12 w-auto transform hover:scale-110 transition-transform duration-300"
          />
        </a>
        <a
          v-for="link in rightLinks"
          :key="link.to"
          :href="link.to"
          class="text-lg hover:text-light-accent dark:hover:text-dark-accent relative transition-colors duration-300 px-2 py-1 after:content-[''] after:absolute after:w-0 after:h-0.5 after:bottom-[-4px] after:left-0 after:bg-current after:transition-[width] after:duration-300 hover:after:w-full"
          @click="closeMenu"
        >
          {{ $t(link.label) }}
        </a>
      </nav>
    </div>

    <div class="flex items-center space-x-2">
      <button
        class="hamburger-btn xl:hidden fixed left-4 top-4 z-60 p-2 cursor-pointer"
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
    </div>

    <button
      @click="toggleTheme"
      class="theme-switcher absolute top-6 right-6 p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-300"
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
      class="mobile-menu fixed w-4/5 max-w-xs min-h-[50vh] p-12 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg flex flex-col justify-center items-center gap-8 z-50 shadow-lg rounded-xl overflow-y-auto sm:w-11/12 sm:min-h-[60vh] sm:p-8 sm:gap-6"
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
import { onClickOutside, useElementBounding } from "@vueuse/core";

const themeStore = useThemeStore();
const iconWrapper = templateRef("iconWrapper");
const hamburgerIcon = templateRef("hamburgerIcon");
const mobileMenu = templateRef("mobileMenu");
const isMenuOpen = ref(false);

const { height: menuHeight } = useElementBounding(mobileMenu);

const centerMenu = () => {
  if (mobileMenu.value) {
    const viewportHeight = window.innerHeight;
    const topPosition = (viewportHeight - menuHeight.value) / 2;
    mobileMenu.value.style.top = `${topPosition}px`;
  }
};

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
    gsap.to(hamburgerIcon.value, {
      rotation: 90,
      duration: 0.3,
      ease: "power2.inOut",
    });
    gsap.fromTo(
      mobileMenu.value,
      { x: "100%", opacity: 0 },
      {
        x: "0%",
        opacity: 1,
        duration: 0.4,
        ease: "power2.out",
        onStart: centerMenu,
      }
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
    gsap.to(hamburgerIcon.value, {
      rotation: 0,
      duration: 0.3,
      ease: "power2.inOut",
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

watch([menuHeight], () => {
  if (isMenuOpen.value) centerMenu();
});

const links = [
  { to: "#contact", label: "nav.contact" },
  { to: "#references", label: "nav.references" },
  { to: "#stack", label: "nav.stack" },
  { to: "#about", label: "nav.about" },
];

const midIndex = Math.floor(links.length / 2);
const leftLinks = links.slice(0, midIndex);
const rightLinks = links.slice(midIndex);
</script>
