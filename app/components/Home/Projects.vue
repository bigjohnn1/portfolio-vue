<template>
  <section
    id="references"
    class="relative w-full min-h-screen bg-base-bg text-base-text py-16 overflow-hidden dark:bg-transparent"
  >
    <div class="max-w-6xl mx-auto px-4">
      <header class="mx-auto mb-12 max-w-2xl text-center md:mb-14">
        <h2 class="text-4xl font-bold tracking-tight text-primary-700 md:text-5xl dark:text-primary-300">
          {{ $t('projects.title') }}
        </h2>
        <p class="mt-4 text-base text-gray-600 md:text-lg dark:text-gray-300">
          {{ $t('projects.description') }}
        </p>
      </header>

      <div
        ref="featuredElement"
        class="mb-16 md:mb-24"
      >
        <HomeProjectCard
          :project="featuredProject"
          featured
        />
      </div>

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
          <div
            ref="projectElements"
            class="w-full md:w-1/2 px-0 md:px-8 z-10"
          >
            <HomeProjectCard :project="project" />
          </div>

          <div
            class="hidden md:flex w-1/2 justify-center relative"
            aria-hidden="true"
          >
            <div
              class="absolute top-1/2 transform -translate-y-1/2 w-8 h-px bg-gray-500 dark:bg-gray-400"
            />
            <div
              class="w-5 h-5 bg-gray-800 dark:bg-gray-200 rounded-full z-10 border-2 border-gray-400 dark:border-gray-500 shadow-md"
            />
          </div>
        </div>
      </div>

      <div class="mx-auto max-w-2xl border-t border-gray-200 pt-8 text-center dark:border-white/10">
        <h3 class="text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-500 dark:text-gray-400">
          {{ $t('projects.earlier.title') }}
        </h3>
        <p class="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
          {{ $t('projects.earlier.description') }}
        </p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { gsap } from 'gsap'
import type { Project } from '~/types/project'

const { $gsap } = useNuxtApp()

// Three tiers: Topiqu (ongoing, the main proof) as the featured card, the rest in the timeline
// ordered by end date, newest first, and the 2024 PHP projects as one line under it (projects.earlier).
const featuredProject: Project = {
  key: 'topiqu',
  image: 'topiqu-editor.png',
  link: 'https://topiqu.com/en',
  repo: 'https://github.com/Topiqu/app',
  status: 'beta',
  tech: {
    frontend: ['Nuxt 4', 'Vue 3.5', 'Nuxt UI 4', 'Tailwind 4', 'Pinia', 'TipTap'],
    backend: ['Nitro', 'Bun', 'Better Auth', 'AI SDK', 'Stripe', 'AWS S3'],
    db: ['PostgreSQL', 'ZenStack', 'pgvector', 'Redis'],
    misc: ['TypeScript', 'Zod', 'Vitest', 'Playwright', 'Docker', 'Dokploy', 'Sentry'],
  },
}

const projects: Project[] = [
  {
    key: 'posthog',
    bannerIcon: 'simple-icons:posthog',
    link: 'https://github.com/PostHog/posthog/pull/58224',
    status: 'merged',
    tech: {
      frontend: ['React', 'Kea'],
      misc: ['TypeScript'],
    },
  },
  {
    key: 'nimblo',
    image: 'nimblo.png',
    link: 'https://app.nimblo.io',
    status: 'production',
    tech: {
      frontend: ['React 18.2', 'Vite', 'Tailwind 3.4', 'Radix UI', 'TipTap', 'TanStack Query'],
      backend: ['Hono', 'Cloudflare Workers', 'Stripe'],
      db: ['Cloudflare D1', 'KV', 'R2'],
      misc: ['TypeScript', 'Zod'],
    },
  },
  {
    key: 'fastproject',
    image: 'fastproject.png',
    link: 'https://app.fastproject.io',
    status: 'internal',
    tech: {
      frontend: ['React 18.2', 'Vite', 'Tailwind 3.4', 'Radix UI', 'TanStack Query'],
      backend: ['Hono', 'Cloudflare Workers', 'Stripe'],
      db: ['Cloudflare D1', 'KV', 'R2'],
      misc: ['TypeScript', 'Zod'],
    },
  },
  {
    key: 'v-okamihu',
    image: 'v-okamihu.png',
    link: 'https://vokamihu.sk/',
    tech: {
      frontend: ['Vue 3', 'Pinia', 'Tailwind'],
      backend: ['Nuxt', 'Nitro'],
      db: ['Prisma', 'ZenStack'],
      misc: ['TypeScript'],
    },
  },
]

const featuredElement = useTemplateRef<HTMLElement>('featuredElement')
const projectElements = useTemplateRef<HTMLElement[]>('projectElements')

let ctx: gsap.Context | undefined

onMounted(() => {
  ctx = $gsap.context(() => {
    if (featuredElement.value) {
      $gsap.from(featuredElement.value, {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: featuredElement.value,
          start: 'top 95%',
          toggleActions: 'play none none reverse',
        },
      })
    }

    if (!projectElements.value) return

    const mm = $gsap.matchMedia()

    mm.add('(min-width: 768px)', () => {
      projectElements.value!.forEach((item, index) => {
        $gsap.from(item, {
          x: index % 2 === 0 ? 100 : -100,
          opacity: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 95%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse',
          },
        })
      })
    })

    mm.add('(max-width: 767px)', () => {
      projectElements.value!.forEach((item) => {
        $gsap.from(item, {
          y: 50,
          opacity: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 95%',
            end: 'bottom 15%',
            toggleActions: 'play none none reverse',
          },
        })
      })
    })
  })
})

onUnmounted(() => {
  if (ctx) ctx.revert()
})
</script>
