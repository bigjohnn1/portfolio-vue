<template>
  <section
    id="references"
    class="relative w-full min-h-screen bg-base-bg text-base-text py-16 overflow-hidden"
  >
    <div class="max-w-4xl mx-auto px-4">
      <div class="relative">
        <div
          class="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-gray-400 to-gray-600 dark:from-gray-500 dark:to-gray-700"
          aria-hidden="true"
        ></div>

        <div
          v-for="(project, index) in projects"
          :key="project.key"
          class="flex flex-col md:flex-row items-center mb-16 md:mb-20 relative"
          :class="{ 'md:flex-row-reverse': index % 2 === 0 }"
        >
          <div ref="projectElements" class="w-full md:w-1/2 px-0 md:px-8 z-10">
            <NuxtImg
              :src="project.image"
              :alt="$t(`projects.items.${project.key}.title`)"
              sizes="sm:100vw md:50vw lg:400px"
              class="w-full h-56 md:h-48 object-cover rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.15)] dark:shadow-[0_4px_12px_rgba(255,255,255,0.1)] hover:shadow-[0_6px_16px_rgba(0,0,0,0.25)] dark:hover:shadow-[0_6px_16px_rgba(255,255,255,0.15)] transition-shadow duration-300"
              loading="lazy"
              decoding="async"
              format="webp"
            />

            <h3
              class="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100 mt-6"
            >
              {{ $t(`projects.items.${project.key}.title`) }}
            </h3>

            <p
              class="text-base text-gray-600 dark:text-gray-300 mt-2 line-clamp-3"
            >
              {{ $t(`projects.items.${project.key}.description`) }}
            </p>

            <div class="flex flex-wrap gap-3 mt-4 items-center">
              <span
                class="inline-flex items-center px-3 py-1 bg-gray-200 dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 rounded-full"
              >
                {{ $t(`projects.items.${project.key}.timeline`) }}
                <Icon
                  name="carbon:calendar"
                  class="ml-2 h-5 w-5 text-gray-700 dark:text-gray-200"
                  aria-hidden="true"
                />
              </span>

              <NuxtLink
                v-if="project.link"
                :to="project.link"
                target="_blank"
                class="inline-flex items-center px-3 py-1 bg-primary-600 dark:bg-primary-500 text-sm font-medium text-white rounded-full hover:bg-primary-700 dark:hover:bg-primary-400 transition-colors shadow-sm hover:shadow-md"
              >
                {{ $t("projects.liveDemo") }}
                <Icon
                  name="carbon:launch"
                  class="ml-2 h-4 w-4"
                  aria-hidden="true"
                />
              </NuxtLink>
            </div>
          </div>

          <div
            class="hidden md:flex w-1/2 justify-center relative"
            aria-hidden="true"
          >
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
import type { gsap } from "gsap";

const { $gsap } = useNuxtApp() as unknown as { $gsap: typeof gsap };

interface Project {
  key: string;
  image: string;
  link?: string;
}

const projects: Project[] = [
  { key: "nimblo", image: "nimblo.png", link: "https://app.nimblo.io" },
  {
    key: "fastproject",
    image: "fastproject.png",
    link: "https://app.fastproject.io",
  },
  { key: "topiqu", image: "topiqu.png", link: "https://reachio.topiqu.com" },
  {
    key: "v-okamihu",
    image: "v-okamihu.png",
    link: "https://vokamihu.sk/",
  },
  { key: "hexcodium", image: "hexcodium.png" },
  { key: "skola-zivota", image: "skolazivota.png" },
];

const projectElements = useTemplateRef<HTMLElement[]>("projectElements");

let ctx: gsap.Context | undefined;

onMounted(() => {
  ctx = $gsap.context(() => {
    if (!projectElements.value) return;

    const mm = $gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      projectElements.value!.forEach((item, index) => {
        $gsap.from(item, {
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

    mm.add("(max-width: 767px)", () => {
      projectElements.value!.forEach((item) => {
        $gsap.from(item, {
          y: 50,
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: item,
            start: "top 85%",
            end: "bottom 15%",
            toggleActions: "play none none reverse",
          },
        });
      });
    });
  });
});

onUnmounted(() => {
  if (ctx) ctx.revert();
});
</script>
