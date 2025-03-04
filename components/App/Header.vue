<template>
  <header
    class="relative p-6 overflow-hidden sticky top-0 z-50 bg-light-bg dark:bg-dark-bg transition-colors duration-300"
  >
    <div class="absolute inset-0 pointer-events-none">
      <div
        class="absolute top-[-40%] left-0 w-full h-[180%] bg-[radial-gradient(circle_at_center,#E5E7EB_0%,#D1D5DB_50%,#F9FAFB_100%)] dark:bg-[radial-gradient(circle_at_center,#374151_0%,#1F2937_50%,#111827_100%)]"
      ></div>
      <div
        class="absolute inset-0 bg-gradient-to-b from-[rgba(249,250,251,0.5)] to-[rgba(249,250,251,0.5)] dark:from-[rgba(17,24,39,0.5)] dark:to-[rgba(17,24,39,0.5)]"
      ></div>
    </div>
    <div class="relative z-10 flex justify-around items-center gap-8">
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
        <button
          @click="toggleTheme"
          class="ml-4 px-3 py-1 rounded bg-light-accent dark:bg-dark-accent text-white hover:bg-opacity-80 transition-colors"
        >
          {{ themeStore.currentTheme === "light" ? "Dark" : "Light" }}
        </button>
      </nav>
    </div>
  </header>
</template>

<script lang="ts" setup>
import { useThemeStore } from "~/stores/theme";

const themeStore = useThemeStore();

const toggleTheme = () => {
  themeStore.toggleTheme();
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
</style>
