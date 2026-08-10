<template>
  <section
    id="references"
    class="relative w-full min-h-screen bg-base-bg text-base-text py-16 overflow-hidden dark:bg-transparent"
  >
    <div class="max-w-6xl mx-auto px-4">
      <div class="relative">
        <div
          class="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-gray-400 to-gray-600 dark:from-gray-500 dark:to-gray-700"
          aria-hidden="true"
        ></div>

        <template
          v-for="entry in timelineEntries"
          :key="entry.key"
        >
          <div
            v-if="entry.type === 'header'"
            class="relative z-20 my-16 md:my-20 md:mx-auto md:max-w-2xl md:text-center px-0 md:px-8"
          >
            <div
              class="hidden md:flex items-center gap-5 mb-10"
              aria-hidden="true"
            >
              <span class="relative h-px flex-1 overflow-hidden">
                <span
                  class="absolute inset-0 animate-marching-dashes-reverse bg-[length:14px_1px] bg-repeat-x bg-[linear-gradient(to_right,rgba(167,139,250,0.7)_50%,transparent_50%)] dark:bg-[linear-gradient(to_right,rgba(167,139,250,0.5)_50%,transparent_50%)] motion-reduce:animate-none"
                />
              </span>

              <span class="relative inline-flex items-center gap-2.5 rounded-full bg-base-bg px-5 py-2 text-[15px] font-mono font-semibold uppercase leading-none tracking-[0.28em] ring-1 ring-violet-200/60 dark:ring-violet-400/20">
                <span class="animate-lab-text-shimmer bg-[length:200%_100%] bg-clip-text text-transparent bg-gradient-to-r from-violet-700 via-fuchsia-600 to-violet-700 dark:from-violet-200 dark:via-fuchsia-200 dark:to-violet-200 motion-reduce:animate-none [text-shadow:0_0_18px_rgba(167,139,250,0.15)]">
                  Experimental · Zone
                </span>
              </span>

              <span class="relative h-px flex-1 overflow-hidden">
                <span
                  class="absolute inset-0 animate-marching-dashes bg-[length:14px_1px] bg-repeat-x bg-[linear-gradient(to_right,rgba(167,139,250,0.7)_50%,transparent_50%)] dark:bg-[linear-gradient(to_right,rgba(167,139,250,0.5)_50%,transparent_50%)] motion-reduce:animate-none"
                />
              </span>
            </div>

            <div
              class="relative rounded-2xl border border-violet-200/60 dark:border-violet-400/20 bg-base-bg/95 backdrop-blur-sm px-6 py-7 md:px-10 md:py-9 shadow-[0_6px_24px_rgba(0,0,0,0.06)] dark:shadow-[0_6px_24px_rgba(0,0,0,0.4)]"
            >
              <div
                class="flex items-center justify-center gap-2.5 mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-violet-700 dark:text-violet-300"
                aria-hidden="true"
              >
                <Icon
                  name="game-icons:test-tubes"
                  class="h-4 w-4"
                />
                <span>{{ $t('projects.experiments.kicker') }}</span>
              </div>
              <h3
                class="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100"
              >
                {{ $t('projects.experiments.title') }}
              </h3>
              <p
                class="text-sm md:text-base text-gray-600 dark:text-gray-300 mt-3 max-w-prose md:mx-auto"
              >
                {{ $t('projects.experiments.description') }}
              </p>
            </div>
          </div>

          <div
            v-else
            class="flex flex-col md:flex-row items-center mb-16 md:mb-20 relative"
            :class="{ 'md:flex-row-reverse': entry.index % 2 === 0 }"
          >
            <div
              ref="projectElements"
              class="w-full md:w-1/2 px-0 md:px-8 z-10"
            >
              <HomeProjectCard :project="entry.project" />
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
                :class="{ '!bg-violet-500 dark:!bg-violet-400 !border-violet-300 dark:!border-violet-600': entry.project.kind === 'experiment' }"
              />
            </div>
          </div>
        </template>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { gsap } from 'gsap'
import type { Project } from '~/types/project'

const { $gsap } = useNuxtApp()

type TimelineEntry
  = | { type: 'header', key: string }
    | { type: 'project', key: string, index: number, project: Project }

const productionProjects: Project[] = [
  {
    key: 'topiqu',
    image: 'topiqu.png',
    link: 'https://topiqu.com/en',
    status: 'beta',
    tech: {
      frontend: ['Nuxt 4.2', 'Vue 3.5', 'Tailwind', 'Pinia', 'TipTap', 'VueUse'],
      backend: ['Nitro', 'Bun', 'Vercel', 'Auth.js', 'AI SDK', 'xAI', 'Stripe', 'AWS S3'],
      db: ['NeonDB', 'PostgreSQL', 'Prisma', 'ZenStack'],
      misc: ['TypeScript', 'Zod', 'Vitest', 'Playwright'],
    },
  },
  {
    key: 'v-okamihu',
    image: 'v-okamihu.png',
    link: 'https://vokamihu.sk/',
    tech: {
      frontend: ['Vue', 'Tailwind'],
      backend: ['Nuxt', 'Nitro'],
      db: ['Prisma', 'ZenStack'],
      misc: ['TypeScript'],
    },
  },
  {
    key: 'hexcodium',
    image: 'hexcodium.png',
    tech: {
      frontend: ['Latte', 'SCSS'],
      backend: ['PHP 8.1', 'Nette'],
      db: ['MySQL', 'Nette Database'],
      misc: ['Tracy', 'mPDF', 'Datagrid'],
    },
  },
  {
    key: 'skola-zivota',
    image: 'skolazivota.png',
    tech: {
      frontend: ['JavaScript', 'TinyMCE'],
      backend: ['PHP'],
      db: ['MySQL'],
    },
  },
]

const experimentProjects: Project[] = [
  {
    key: 'nimblo',
    image: 'nimblo.png',
    link: 'https://app.nimblo.io',
    status: 'production',
    kind: 'experiment',
    tech: {
      frontend: [
        'React 18.2',
        'Vite',
        'Tailwind 3.4',
        'Radix UI',
        'TipTap',
        'Framer Motion',
      ],
      backend: ['Hono', 'Cloudflare Workers'],
      db: ['Cloudflare D1', 'KV', 'R2'],
      misc: ['TypeScript', 'Zod', 'TanStack Query', 'Stripe'],
    },
  },
  {
    key: 'fastproject',
    image: 'fastproject.png',
    link: 'https://app.fastproject.io',
    status: 'internal',
    kind: 'experiment',
    tech: {
      frontend: [
        'React 18.2',
        'Vite',
        'Tailwind 3.4',
        'Radix UI',
        'TipTap',
        'Framer Motion',
      ],
      backend: ['Hono', 'Cloudflare Workers'],
      db: ['Cloudflare D1', 'KV', 'R2'],
      misc: ['TypeScript', 'Zod', 'TanStack Query', 'Stripe'],
    },
  },
]

const timelineEntries = computed<TimelineEntry[]>(() => {
  const entries: TimelineEntry[] = []
  let index = 0
  for (const project of productionProjects) {
    entries.push({ type: 'project', key: project.key, index: index++, project })
  }
  if (experimentProjects.length > 0) {
    entries.push({ type: 'header', key: '__experiments-header' })
    for (const project of experimentProjects) {
      entries.push({ type: 'project', key: project.key, index: index++, project })
    }
  }
  return entries
})

const projectElements = useTemplateRef<HTMLElement[]>('projectElements')

let ctx: gsap.Context | undefined

onMounted(() => {
  ctx = $gsap.context(() => {
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
            start: 'top 80%',
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
            start: 'top 85%',
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
