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
        <p class="text-lg text-gray-600 dark:text-gray-400 text-center mb-8">
          {{ $t("techStack.description") }}
        </p>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div
            v-for="(tech, i) in techStack"
            :key="tech.key"
            class="tech-item flex flex-col items-center p-4 bg-gray-200 dark:bg-gray-700 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
            :ref="(el) => (techItems[i] = el as Element)"
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
import tippy from "tippy.js";
import type { Instance } from "tippy.js";
import "tippy.js/dist/tippy.css";

const { $i18n } = useNuxtApp();
const techStack = [
  { key: "vue", icon: "logos:vue" },
  { key: "nuxt", icon: "logos:nuxt-icon" },
  { key: "tailwind", icon: "logos:tailwindcss-icon" },
  { key: "typescript", icon: "logos:typescript-icon" },
  { key: "php", icon: "logos:php" },
  { key: "postgresql", icon: "logos:postgresql" },
  { key: "html", icon: "logos:html-5" },
  { key: "javascript", icon: "logos:javascript" },
  { key: "mysql", icon: "logos:mysql" },
  { key: "scss", icon: "logos:sass" },
  { key: "git", icon: "logos:git-icon" },
  { key: "docker", icon: "logos:docker-icon" },
  { key: "powershell", icon: "ic:baseline-terminal" },
  { key: "prisma", icon: "logos:prisma" },
  { key: "redis", icon: "logos:redis" },
];

const techItems = ref<(Element | null)[]>([]);
const tippyInstances = ref<Instance[]>([]);

onMounted(() => {
  techItems.value.forEach((item, i) => {
    const instance = tippy(item!, {
      content: $i18n.t(`techStack.items.${techStack[i].key}.description`),
      placement: "top",
      theme: "light",
    });
    tippyInstances.value[i] = instance;
  });

  watch($i18n.locale, () => {
    techItems.value.forEach((item, i) => {
      tippyInstances.value[i].setContent(
        $i18n.t(`techStack.items.${techStack[i].key}.description`)
      );
    });
  });
});
</script>
