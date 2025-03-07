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
          :key="project.id"
          class="flex items-center mb-20 relative"
          :class="{ 'flex-row-reverse': index % 2 === 0 }"
        >
          <div class="project-item w-1/2 px-8">
            <NuxtImg
              :src="project.image"
              :alt="project.title"
              class="w-full h-48 object-cover rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
            />
            <h3
              class="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100 mt-6"
            >
              {{ project.title }}
            </h3>
            <p class="text-base text-gray-600 dark:text-gray-300 mt-2">
              {{ project.description }}
            </p>
            <span
              class="inline-flex items-center mt-3 px-3 py-1 bg-gray-200 dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 rounded-full"
            >
              {{ project.timeline }}
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
import { onMounted } from "vue";

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    id: "1",
    title: "Škola života - web revamp",
    description:
      "První web s PHP backendem pro neziskovou, charitativní organizaci",
    image: "https://via.placeholder.com/400x300?text=SkolaZivota",
    timeline: "Květen 2024",
  },
  {
    id: "2",
    title: "Milk World",
    description: "Funkční e-shop v PHP, Nette explorer.",
    image: "https://via.placeholder.com/400x300?text=MilkWorld",
    timeline: "Červen 2024",
  },
  {
    id: "3",
    title: "TINT s.r.o shadow project",
    description: "Stínový návrh pro IT společnost, postaveno na míru.",
    image: "https://via.placeholder.com/400x300?text=TINT",
    timeline: "Září 2024",
  },
  {
    id: "4",
    title: "HexCodium",
    description: "Kurzová platforma, posun do full Nette, custom měna, RBAC...",
    image: "https://via.placeholder.com/400x300?text=Portfolio",
    timeline: "Září 2024",
  },
  {
    id: "5",
    title: "Matchmaker (unfinished)",
    description: "Liveservice app, full Nette + pgSQL.",
    image: "https://via.placeholder.com/400x300?text=Matchmaker",
    timeline: "Prosinec 2024",
  },
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
