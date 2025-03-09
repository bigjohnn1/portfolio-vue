<template>
  <section
    class="relative w-full min-h-screen bg-base-bg text-base-text py-16 overflow-hidden"
  >
    <div class="max-w-4xl mx-auto px-4">
      <div class="relative">
        <div
          class="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-gray-400 to-gray-600 dark:from-gray-500 dark:to-gray-700"
        ></div>
        <div
          v-for="(project, index) in projects"
          :key="project.key"
          class="flex items-center mb-20 relative"
          :class="{ 'flex-row-reverse': index % 2 === 0 }"
        >
          <div class="project-item w-1/2 px-8">
            <NuxtImg
              :src="project.image"
              :alt="$t(`projects.items.${project.key}.title`)"
              class="w-full h-48 object-cover rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
            />
            <h3
              class="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100 mt-6"
            >
              {{ $t(`projects.items.${project.key}.title`) }}
            </h3>
            <p class="text-base text-gray-600 dark:text-gray-300 mt-2">
              {{
                truncate($t(`projects.items.${project.key}.description`), 90)
              }}
            </p>
            <span
              class="inline-flex items-center mt-3 px-3 py-1 bg-gray-200 dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 rounded-full"
            >
              {{ $t(`projects.items.${project.key}.timeline`) }}
              <Icon
                name="carbon:calendar"
                class="ml-2 h-6 w-6 text-gray-700 dark:text-gray-200"
              />
            </span>
          </div>
          <div class="w-1/2 flex justify-center relative">
            <div
              class="absolute top-1/2 transform -translate-y-1/2 w-8 h-px bg-gray-500 dark:bg-gray-400"
            ></div>
            <div
              class="w-5 h-5 bg-gray-800 dark:bg-gray-200 rounded-full z-10 border-2 border-gray-400 dark:border-gray-500 shadow-md"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function truncate(str: string, n: number): string {
  return str.length > n ? str.substr(0, n) + "..." : str;
}

const projects = [
  { key: "skola-zivota", image: "skolazivota.png" },
  {
    key: "milk-world",
    image: "https://via.placeholder.com/400x300?text=MilkWorld",
  },
  { key: "tint-shadow", image: "tint.png" },
  { key: "hexcodium", image: "hexcodium.png" },
  { key: "matchmaker", image: "Matchmaker.png" },
];

onMounted(() => {
  const projectItems = document.querySelectorAll(".project-item");

  projectItems.forEach((item, index) => {
    gsap.from(item, {
      x: index % 2 === 0 ? 100 : -100,
      opacity: 0,
      duration: 0.8,
      ease: "power2.out",
      scrollTrigger: {
        trigger: item,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none reverse",
      },
    });
  });
});
</script>
