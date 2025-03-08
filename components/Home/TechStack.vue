<template>
  <div>
    <section
      class="tech-stack relative w-full py-16 bg-base-bg text-base-text overflow-hidden"
    >
      <div class="max-w-5xl mx-auto px-4">
        <h2
          class="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100 text-center mb-12"
        >
          {{ $t("techStack.title") }}
        </h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div
            v-for="(tech, index) in techStack"
            :key="tech.key"
            class="tech-item flex flex-col items-center p-4 bg-gray-200 dark:bg-gray-700 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
            :ref="(el) => (techItems[index] = el as Element)"
          >
            <Icon
              :name="tech.icon"
              class="h-12 w-12 mb-4 text-gray-700 dark:text-gray-200"
            />
            <span class="text-lg font-medium text-gray-800 dark:text-gray-100">
              {{ $t(`techStack.items.${tech.key}.name`) }}
            </span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { gsap } from "gsap";
import tippy from "tippy.js";
import type { Instance } from "tippy.js";
import "tippy.js/dist/tippy.css";

const { $i18n } = useNuxtApp();

const techStack = [
  { key: "vue", icon: "logos:vue" },
  { key: "nuxt", icon: "logos:nuxt-icon" },
  { key: "tailwind", icon: "logos:tailwindcss-icon" },
  { key: "gsap", icon: "logos:gsap-icon" },
  { key: "typescript", icon: "logos:typescript-icon" },
  { key: "php", icon: "logos:php" },
  { key: "nette", icon: "logos:nette" },
  { key: "postgresql", icon: "logos:postgresql" },
  { key: "linux", icon: "logos:linux-tux" },
  { key: "windows", icon: "logos:microsoft-windows" },
];

const techItems = ref<(Element | null)[]>([]);
const tippyInstances = ref<Instance[]>([]);

onMounted(() => {
  techItems.value.forEach((item, index) => {
    if (!item) return;
    gsap.from(item, {
      opacity: 0,
      y: 50,
      duration: 0.8,
      ease: "power2.out",
      delay: index * 0.1,
    });

    const instance = tippy(item, {
      content: $i18n.t(`techStack.items.${techStack[index].key}.description`),
      placement: "top",
      theme: "light",
    });
    tippyInstances.value[index] = instance;
  });

  watch($i18n.locale, () => {
    techItems.value.forEach((item, index) => {
      if (tippyInstances.value[index]) {
        tippyInstances.value[index].setContent(
          $i18n.t(`techStack.items.${techStack[index].key}.description`)
        );
      }
    });
  });
});
</script>

<style lang="scss" scoped>
.tech-stack {
  background-color: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(8px);

  html[class="dark"] & {
    background-color: rgba(0, 0, 0, 0.1);
  }
}

.tech-item {
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
}
</style>
