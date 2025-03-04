<template>
  <header
    class="relative p-6 overflow-hidden sticky top-0 z-50 bg-light-bg dark:bg-dark-bg transition-colors duration-300"
  >
    <div class="relative z-10 flex items-center justify-center">
      <nav class="flex space-x-24">
        <NuxtLink
          v-for="link in leftLinks"
          :key="link.to"
          :to="link.to"
          class="nav-link text-light-text dark:text-dark-text hover:text-light-accent dark:hover:text-dark-accent"
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
          class="nav-link text-light-text dark:text-dark-text hover:text-light-accent dark:hover:text-dark-accent"
        >
          {{ $t(link.label) }}
        </NuxtLink>
      </nav>
      <button
        ref="themeButton"
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

const themeStore = useThemeStore();
const themeButton = ref(null);
const iconWrapper = ref(null);

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
