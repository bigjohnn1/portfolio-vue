<!-- components/LangSwitcher.vue -->
<template>
  <ClientOnly>
    <div class="lang-switcher relative">
      <button
        @click="toggleDropdown"
        class="w-32 py-2 pl-3 pr-8 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600 hover:bg-gray-300 dark:hover:bg-gray-600 flex items-center justify-between transition-all duration-300"
      >
        <span class="flex items-center">
          <Icon :name="currentLocale.icon" class="h-5 w-5 mr-2" />
          {{ currentLocale.name }}
        </span>
        <Icon
          :name="isOpen ? 'mingcute:up-fill' : 'mingcute:down-fill'"
          class="h-4 w-4 text-gray-700 dark:text-gray-300"
        />
      </button>
      <ul
        v-if="isOpen"
        ref="dropdown"
        class="absolute w-32 mt-1 rounded-lg bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 shadow-lg z-10"
      >
        <li
          v-for="locale in availableLocales"
          :key="locale.code"
          @click="switchLocale(locale.code)"
          class="px-3 py-2 flex items-center hover:bg-gray-300 dark:hover:bg-gray-600 cursor-pointer transition-colors duration-200"
        >
          <Icon :name="locale.icon" class="h-5 w-5 mr-2" />
          {{ locale.name }}
        </li>
      </ul>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import { gsap } from "gsap";

const { $i18n } = useNuxtApp();
const availableLocales = $i18n.locales;
const isOpen = ref(false);
const dropdown = ref(null);

const currentLocale = computed(() => {
  const found = availableLocales.value.find(
    (locale) => locale.code === $i18n.locale.value
  );
  return found || availableLocales.value[0];
});

const toggleDropdown = async () => {
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    await nextTick();
    animateDropdownOpen();
  } else {
    animateDropdownClose();
  }
};

const switchLocale = (localeCode: string) => {
  $i18n.setLocale(localeCode);
  isOpen.value = false;
  animateDropdownClose();
};

const animateDropdownOpen = () => {
  if (dropdown.value) {
    gsap.fromTo(
      dropdown.value,
      { opacity: 0, y: -10, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.3, ease: "power2.out" }
    );
  }
};

const animateDropdownClose = () => {
  if (dropdown.value) {
    gsap.to(dropdown.value, {
      opacity: 0,
      y: -10,
      scale: 0.95,
      duration: 0.2,
      ease: "power2.in",
    });
  }
};

onMounted(() => {
  const button = document.querySelector(".lang-switcher button");
  if (button) {
    gsap.from(button, {
      y: -10,
      opacity: 0,
      duration: 0.4,
      ease: "power2.out",
    });
  }
});
</script>

<style lang="scss" scoped>
.lang-switcher {
  position: relative;
  display: inline-block;
}

button {
  cursor: pointer;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

li {
  &:last-child {
    border-bottom-left-radius: 0.5rem;
    border-bottom-right-radius: 0.5rem;
  }
}
</style>
