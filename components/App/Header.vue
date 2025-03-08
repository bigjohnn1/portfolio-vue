<template>
  <header
    class="relative mx-auto p-6 sticky top-0 z-50 w-3/4 transition-colors duration-300"
  >
    <div class="relative z-10 flex items-center justify-center">
      <nav class="flex space-x-32">
        <NuxtLink
          v-for="link in leftLinks"
          :key="link.to"
          :to="link.to"
          class="nav-link hover:text-light-accent dark:hover:text-dark-accent"
        >
          {{ $t(link.label) }}
        </NuxtLink>
        <NuxtLink to="/" class="logo-link">
          <NuxtImg
            src="/logo_bj.webp"
            alt="Site Logo"
            class="h-12 w-auto transform hover:scale-110 transition-transform duration-300"
          />
        </NuxtLink>
        <NuxtLink
          v-for="link in rightLinks"
          :key="link.to"
          :to="link.to"
          class="nav-link hover:text-light-accent dark:hover:text-dark-accent"
        >
          {{ $t(link.label) }}
        </NuxtLink>
      </nav>
      <AppLocaleSwitcher class="ml-4" />
      <button
        @click="toggleTheme"
        class="theme-switcher absolute right-6 p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-300"
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
    </div>
  </header>
</template>

<script lang="ts" setup>
import { useThemeStore } from "~/stores/theme";
import { gsap } from "gsap";
import { templateRef } from "@vueuse/core";

const themeStore = useThemeStore();
const iconWrapper = templateRef("iconWrapper");

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

const links = [
  { to: "/contact", label: "nav.contact" },
  { to: "/references", label: "nav.references" },
  { to: "/progress", label: "nav.progress" },
  { to: "/about", label: "nav.about" },
];

const midIndex = Math.floor(links.length / 2);
const leftLinks = links.slice(0, midIndex);
const rightLinks = links.slice(midIndex);
</script>

<style lang="scss" scoped>
header {
  background-color: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);

  &::after {
    content: "";
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 100%;
    height: 1px;
    background: linear-gradient(to right, transparent, rgba(0, 0, 0, 0.5));
  }

  html[class="dark"] & {
    background-color: rgba(17, 24, 39, 0.5);
    border-bottom: 1px solid rgb(255, 255, 255);

    &::after {
      background: linear-gradient(
        to right,
        transparent,
        rgba(255, 255, 255, 0.5)
      );
    }
  }
}

.nav-link {
  font-size: 18px;
  text-decoration: none;
  position: relative;
  transition: color 0.3s ease;
}

.nav-link::after {
  content: "";
  position: absolute;
  width: 0;
  height: 2px;
  bottom: -4px;
  left: 0;
  background-color: currentColor;
  transition: width 0.3s ease;
}

.nav-link:hover::after {
  width: 100%;
}

.logo-link {
  text-decoration: none;
}

.theme-switcher {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
