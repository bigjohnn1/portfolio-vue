<template>
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
          :key="tech.name"
          class="tech-item flex flex-col items-center p-4 bg-gray-200 dark:bg-gray-700 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
          :ref="(el) => (techItems[index] = el)"
        >
          <Icon
            :name="tech.icon"
            class="h-12 w-12 mb-4 text-gray-700 dark:text-gray-200"
          />
          <span class="text-lg font-medium text-gray-800 dark:text-gray-100">
            {{ tech.name }}
          </span>
          <span class="text-sm text-gray-500 dark:text-gray-400 mt-2">
            {{ tech.experience }}
          </span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { gsap } from "gsap";
import tippy from "tippy.js";
import "tippy.js/dist/tippy.css";

const techStack = [
  {
    name: "Vue.js",
    icon: "logos:vue",
    description: "Reaktivní framework pro UI",
    experience: "2 roky",
  },
  {
    name: "Nuxt.js",
    icon: "logos:nuxt-icon",
    description: "Framework pro Vue aplikace",
    experience: "1 rok",
  },
];

const techItems = ref<Element[]>([]);

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

    tippy(item, {
      content: techStack[index].description,
      placement: "top",
      theme: "light",
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
