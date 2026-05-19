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
          <div
            ref="projectElements"
            class="w-full md:w-1/2 px-0 md:px-8 z-10"
          >
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

            <dl
              v-if="projectTechGroups(project.tech).length"
              class="mt-5 space-y-2.5"
              :aria-label="$t('projects.techStack')"
            >
              <div
                v-for="group in projectTechGroups(project.tech)"
                :key="group.category"
                class="flex flex-wrap items-center gap-x-3 gap-y-1.5"
              >
                <dt
                  class="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-gray-500 dark:text-gray-400 min-w-[5.25rem]"
                >
                  <span
                    class="h-1.5 w-1.5 rounded-full"
                    :class="CATEGORY_STYLES[group.category].dot"
                    aria-hidden="true"
                  />
                  {{ $t(`projects.tech.${group.category}`) }}
                </dt>
                <dd class="flex flex-wrap gap-1.5">
                  <span
                    v-for="item in group.items"
                    :key="item"
                    class="group/pill inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium rounded-md ring-1 ring-inset shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                    :class="CATEGORY_STYLES[group.category].pill"
                  >
                    <Icon
                      v-if="techIcon(item)"
                      :name="techIcon(item)!"
                      class="h-3.5 w-3.5 opacity-90 transition-transform duration-200 group-hover/pill:scale-110"
                      aria-hidden="true"
                    />
                    {{ item }}
                  </span>
                </dd>
              </div>
            </dl>
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
import type { gsap } from 'gsap'

const { $gsap } = useNuxtApp() as unknown as { $gsap: typeof gsap }

type TechCategory = 'frontend' | 'backend' | 'db' | 'misc'
type ProjectTech = Partial<Record<TechCategory, string[]>>

interface Project {
  key: string
  image: string
  link?: string
  tech?: ProjectTech
}

const TECH_CATEGORIES: TechCategory[] = ['frontend', 'backend', 'db', 'misc']

const CATEGORY_STYLES: Record<TechCategory, { pill: string, dot: string }> = {
  frontend: {
    pill: 'bg-gradient-to-b from-sky-50 to-sky-100/60 text-sky-800 ring-sky-300/60 hover:ring-sky-400 hover:shadow-sky-200/50 dark:from-sky-500/10 dark:to-sky-500/5 dark:text-sky-100 dark:ring-sky-400/30 dark:hover:ring-sky-300/60 dark:hover:shadow-sky-500/20',
    dot: 'bg-sky-500 dark:bg-sky-400',
  },
  backend: {
    pill: 'bg-gradient-to-b from-emerald-50 to-emerald-100/60 text-emerald-800 ring-emerald-300/60 hover:ring-emerald-400 hover:shadow-emerald-200/50 dark:from-emerald-500/10 dark:to-emerald-500/5 dark:text-emerald-100 dark:ring-emerald-400/30 dark:hover:ring-emerald-300/60 dark:hover:shadow-emerald-500/20',
    dot: 'bg-emerald-500 dark:bg-emerald-400',
  },
  db: {
    pill: 'bg-gradient-to-b from-amber-50 to-amber-100/60 text-amber-800 ring-amber-300/60 hover:ring-amber-400 hover:shadow-amber-200/50 dark:from-amber-500/10 dark:to-amber-500/5 dark:text-amber-100 dark:ring-amber-400/30 dark:hover:ring-amber-300/60 dark:hover:shadow-amber-500/20',
    dot: 'bg-amber-500 dark:bg-amber-400',
  },
  misc: {
    pill: 'bg-gradient-to-b from-violet-50 to-violet-100/60 text-violet-800 ring-violet-300/60 hover:ring-violet-400 hover:shadow-violet-200/50 dark:from-violet-500/10 dark:to-violet-500/5 dark:text-violet-100 dark:ring-violet-400/30 dark:hover:ring-violet-300/60 dark:hover:shadow-violet-500/20',
    dot: 'bg-violet-500 dark:bg-violet-400',
  },
}

const TECH_ICONS: Record<string, string> = {
  'react': 'simple-icons:react',
  'vue': 'simple-icons:vuedotjs',
  'nuxt': 'simple-icons:nuxtdotjs',
  'nitro': 'simple-icons:nuxtdotjs',
  'vite': 'simple-icons:vite',
  'tailwind': 'simple-icons:tailwindcss',
  'tailwindcss': 'simple-icons:tailwindcss',
  'unocss': 'simple-icons:unocss',
  'sass': 'simple-icons:sass',
  'scss': 'simple-icons:sass',
  'latte': 'carbon:code',
  'typescript': 'simple-icons:typescript',
  'javascript': 'simple-icons:javascript',
  'php': 'simple-icons:php',
  'nette': 'carbon:cube',
  'hono': 'simple-icons:hono',
  'bun': 'simple-icons:bun',
  'vercel': 'simple-icons:vercel',
  'cloudflare workers': 'simple-icons:cloudflare',
  'cloudflare': 'simple-icons:cloudflare',
  'cloudflare d1': 'simple-icons:cloudflare',
  'kv': 'simple-icons:cloudflare',
  'r2': 'simple-icons:cloudflare',
  'mysql': 'simple-icons:mysql',
  'postgresql': 'simple-icons:postgresql',
  'neondb': 'simple-icons:neon',
  'prisma': 'simple-icons:prisma',
  'zenstack': 'carbon:layers',
  'nette database': 'carbon:data-base',
  'zod': 'simple-icons:zod',
  'tracy': 'carbon:debug',
  'mpdf': 'carbon:document-pdf',
  'datagrid': 'carbon:data-table',
  'tinymce': 'simple-icons:tinymce',
  'html': 'simple-icons:html5',
  'pinia': 'simple-icons:pinia',
  'tiptap': 'simple-icons:tiptap',
  'vueuse': 'simple-icons:vueuse',
  'radix ui': 'simple-icons:radixui',
  'radix': 'simple-icons:radixui',
  'framer motion': 'simple-icons:framer',
  'framer': 'simple-icons:framer',
  'three.js': 'simple-icons:threedotjs',
  'threejs': 'simple-icons:threedotjs',
  'tanstack query': 'simple-icons:reactquery',
  'tanstack table': 'simple-icons:reactquery',
  'stripe': 'simple-icons:stripe',
  'auth.js': 'carbon:user-multiple',
  'ai sdk': 'carbon:machine-learning-model',
  'xai': 'simple-icons:x',
  'aws s3': 'simple-icons:amazons3',
  's3': 'simple-icons:amazons3',
  'aws ses': 'simple-icons:amazonsimpleemailservice',
  'ses': 'simple-icons:amazonsimpleemailservice',
  'sharp': 'carbon:image',
  'playwright': 'simple-icons:playwright',
  'vitest': 'simple-icons:vitest',
  'mjml': 'carbon:email',
  'react query': 'simple-icons:reactquery',
  'react hook form': 'simple-icons:reacthookform',
  'recharts': 'carbon:chart-line',
  'chart.js': 'simple-icons:chartdotjs',
  'chartjs': 'simple-icons:chartdotjs',
}

const stripVersion = (name: string) =>
  name
    .toLowerCase()
    .replace(/\s*v?\d+(\.\d+)*\s*$/i, '')
    .trim()

const techIcon = (name: string) => TECH_ICONS[stripVersion(name)]

const projects: Project[] = [
  {
    key: 'nimblo',
    image: 'nimblo.png',
    link: 'https://app.nimblo.io',
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
    key: 'topiqu',
    image: 'topiqu.png',
    link: 'https://reachio.topiqu.com',
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

const projectTechGroups = (tech?: ProjectTech) =>
  TECH_CATEGORIES.flatMap((category) => {
    const items = tech?.[category]
    return items && items.length > 0 ? [{ category, items }] : []
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
