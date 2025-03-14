<template>
  <header
    class="relative mx-auto p-6 sticky top-0 z-50 w-full md:w-3/4 transition-colors duration-300 flex flex-wrap items-center justify-center"
  >
    <div class="flex items-center justify-center flex-1 min-w-0">
      <nav
        class="hidden xl:flex flex-wrap items-center justify-center space-x-32"
      >
        <NuxtLink
          v-for="link in leftLinks"
          :key="link.to"
          :to="link.to"
          class="nav-link hover:text-light-accent dark:hover:text-dark-accent"
          @click="closeMenu"
        >
          {{ $t(link.label) }}
        </NuxtLink>
        <NuxtLink to="/" class="logo-link" @click="closeMenu">
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
          @click="closeMenu"
        >
          {{ $t(link.label) }}
        </NuxtLink>
      </nav>
    </div>

    <div class="flex items-center space-x-2">
      <button class="hamburger-btn xl:hidden" @click="toggleMenu">
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
      class="mobile-menu"
    >
      <NuxtLink
        v-for="link in links"
        :key="link.to"
        :to="link.to"
        class="nav-link hover:text-light-accent dark:hover:text-dark-accent"
        @click="closeMenu"
      >
        {{ $t(link.label) }}
      </NuxtLink>
      <NuxtLink to="/" class="logo-link" @click="closeMenu">
        <NuxtImg
          src="/logo_bj.webp"
          alt="Site Logo"
          class="h-12 w-auto transform hover:scale-110 transition-transform duration-300"
        />
      </NuxtLink>
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
  position: sticky;
  top: 0;
  z-index: 50;

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
  padding: 0.5rem 0;

  &::after {
    content: "";
    position: absolute;
    width: 0;
    height: 2px;
    bottom: -4px;
    left: 0;
    background-color: currentColor;
    transition: width 0.3s ease;
  }

  &:hover::after {
    width: 100%;
  }
}

.logo-link {
  text-decoration: none;
}

.hamburger-btn {
  display: none;
  position: fixed;
  left: 1rem;
  z-index: 60;
  padding: 0.5rem;
  border: none;
  cursor: pointer;
}

.mobile-menu {
  position: fixed;
  width: 80%;
  max-width: 320px;
  height: auto;
  min-height: 50vh;
  padding: 3rem 2rem;
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  z-index: 50;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  overflow-y: auto;
  border-radius: 1rem;

  html[class="dark"] & {
    background-color: rgba(17, 24, 39, 0.95);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.4);
  }

  .nav-link {
    font-size: 20px;
    padding: 1rem 1.5rem;
    width: 100%;
    text-align: center;
    border-radius: 0.5rem;
    transition:
      background-color 0.3s ease,
      color 0.3s ease;

    &:hover {
      background-color: rgba(0, 0, 0, 0.05);
      html[class="dark"] & {
        background-color: rgba(255, 255, 255, 0.1);
      }
    }
  }

  .logo-link {
    margin: 1rem 0;
  }
}

@media (max-width: 1279px) {
  .hamburger-btn {
    display: block;
  }

  nav {
    display: none;
  }

  .mobile-menu {
    display: flex;
  }
}

@media (min-width: 1280px) {
  .mobile-menu {
    display: none !important;
  }
}

@media (max-width: 640px) {
  .hamburger-btn {
    left: 0.5rem;
    top: 0.5rem;
    padding: 0.4rem;
  }

  .mobile-menu {
    width: 90%;
    padding: 3rem 1.5rem;
    min-height: 60vh;
  }
}

.theme-switcher {
  padding: 0.5rem;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 9999px;
  transition: all 0.3s ease;

  html[class="dark"] & {
    background-color: rgba(17, 24, 39, 0.5);
  }

  &:hover {
    background-color: rgba(255, 255, 255, 0.3);
    html[class="dark"] & {
      background-color: rgba(17, 24, 39, 0.7);
    }
  }
}
</style>
