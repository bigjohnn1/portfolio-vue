<template>
  <section
    class="relative w-full py-20 bg-base-bg text-base-text z-10 overflow-hidden"
    id="about"
  >
    <div class="max-w-6xl mx-auto px-4">
      <h2
        class="text-4xl md:text-5xl font-bold text-primary-700 dark:text-primary-300 text-center mb-16 tracking-tight animate-title"
      >
        {{ $t("about.title") }}
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        <div class="flex flex-col gap-8">
          <div class="animate-story">
            <h3
              class="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4"
            >
              {{ $t("about.story.title") }}
            </h3>
            <p class="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
              {{ $t("about.story.description") }}
            </p>
          </div>
          <ul class="list-none space-y-6 animate-points">
            <li class="flex items-start gap-4">
              <Icon
                name="mdi:school"
                size="24"
                class="text-primary-600 dark:text-primary-400 shrink-0"
              />
              <div>
                <h4
                  class="text-lg font-medium text-gray-800 dark:text-gray-100"
                >
                  {{ $t("about.points.education.title") }}
                </h4>
                <p class="text-gray-600 dark:text-gray-400">
                  {{ $t("about.points.education.description") }}
                </p>
              </div>
            </li>
            <li class="flex items-start gap-4">
              <Icon
                name="mdi:briefcase"
                size="24"
                class="text-primary-600 dark:text-primary-400 shrink-0"
              />
              <div>
                <h4
                  class="text-lg font-medium text-gray-800 dark:text-gray-100"
                >
                  {{ $t("about.points.experience.title") }}
                </h4>
                <p class="text-gray-600 dark:text-gray-400">
                  {{ $t("about.points.experience.description") }}
                </p>
              </div>
            </li>
          </ul>
        </div>
        <div class="animate-facts">
          <h3
            class="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6"
          >
            {{ $t("about.facts.title") }}
          </h3>
          <div class="grid grid-cols-1 gap-6">
            <div
              v-for="fact in facts"
              :key="fact.key"
              class="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div class="flex items-center gap-4">
                <Icon
                  :name="fact.icon"
                  size="32"
                  class="text-primary-600 dark:text-primary-400"
                />
                <div>
                  <h4
                    class="text-lg font-medium text-gray-800 dark:text-gray-100"
                  >
                    {{ $t(`about.facts.items.${fact.key}.title`) }}
                  </h4>
                  <p class="text-gray-600 dark:text-gray-400">
                    {{ $t(`about.facts.items.${fact.key}.description`) }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted } from "vue";
const { $gsap } = useNuxtApp();

const facts = [
  { key: "coding", icon: "mdi:code-tags" },
  { key: "lifestyle", icon: "mdi:leaf" },
  { key: "rpg", icon: "mdi:sword" },
];

onMounted(() => {
  $gsap.from(".animate-title", {
    y: 30,
    opacity: 0,
    duration: 0.8,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".animate-title",
      start: "top 80%",
    },
  });

  $gsap.from(".animate-story", {
    x: -50,
    opacity: 0,
    duration: 0.8,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".animate-story",
      start: "top 80%",
    },
  });

  $gsap.from(".animate-points li", {
    y: 20,
    opacity: 0,
    duration: 0.6,
    stagger: 0.2,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".animate-points",
      start: "top 80%",
    },
  });

  $gsap.from(".animate-facts > div", {
    scale: 0.9,
    opacity: 0,
    duration: 0.6,
    stagger: 0.2,
    ease: "back.out(1.7)",
    scrollTrigger: {
      trigger: ".animate-facts",
      start: "top 80%",
    },
  });
});
</script>
