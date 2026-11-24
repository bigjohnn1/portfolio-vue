<template>
  <article
    ref="cardEl"
    :aria-labelledby="titleId"
    :class="[
      'group/card relative flex flex-col overflow-hidden rounded-2xl border bg-white/90 shadow-[0_4px_16px_rgba(15,23,42,0.06)] backdrop-blur-sm transition-[transform,box-shadow,border-color] duration-300 ease-out',
      !featured && 'min-h-[33rem] lg:min-h-[35rem]',
      'hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(15,23,42,0.12)] focus-within:-translate-y-1 focus-within:shadow-[0_12px_32px_rgba(15,23,42,0.12)]',
      'motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:focus-within:translate-y-0',
      '[--card-glow:rgba(56,189,248,0.18)] border-gray-200/80 hover:border-gray-300 dark:border-white/[0.08] dark:bg-gray-900/70 dark:hover:border-white/15',
    ]"
  >
    <div
      aria-hidden="true"
      class="pointer-events-none absolute -right-16 -top-16 z-0 h-48 w-48 rounded-full opacity-50 blur-3xl [background:radial-gradient(circle,var(--card-glow),transparent_70%)]"
    />
    <div
      aria-hidden="true"
      :style="spotlightStyle"
      class="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-300 group-hover/card:opacity-100 motion-reduce:hidden [background:radial-gradient(16rem_circle_at_var(--spot-x)_var(--spot-y),var(--card-glow),transparent_70%)]"
    />

    <div
      v-if="!project.image"
      aria-hidden="true"
      class="relative z-10 flex h-52 items-center justify-center gap-4 overflow-hidden border-b border-gray-200/70 bg-gradient-to-br from-gray-50 via-white to-primary-50/60 lg:h-64 dark:border-white/10 dark:from-gray-900 dark:via-gray-900 dark:to-primary-900/20"
    >
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,220,130,0.12),transparent_55%)]" />
      <Icon
        v-if="project.bannerIcon"
        :name="project.bannerIcon"
        class="relative h-16 w-16 text-gray-800 transition-transform duration-500 ease-out group-hover/card:scale-110 motion-reduce:transition-none lg:h-20 lg:w-20 dark:text-gray-100"
      />
      <span
        v-if="te(`projects.items.${project.key}.banner`)"
        class="relative font-mono text-sm font-semibold text-gray-600 lg:text-base dark:text-gray-300"
      >
        {{ t(`projects.items.${project.key}.banner`) }}
      </span>
    </div>

    <div
      v-else
      :class="[
        'relative z-10 overflow-hidden',
        featured && 'border-b border-gray-200/70 dark:border-white/10',
      ]"
    >
      <NuxtImg
        :src="project.image"
        :alt="t(`projects.items.${project.key}.title`)"
        :sizes="featured ? 'sm:100vw md:100vw lg:1120px' : 'sm:100vw md:50vw lg:480px'"
        :class="[
          'w-full object-cover transition-transform duration-500 ease-out group-hover/card:scale-[1.03] group-focus-within/card:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover/card:scale-100',
          featured ? 'aspect-[16/10] object-top sm:aspect-[2/1]' : 'h-52 lg:h-64',
        ]"
        loading="lazy"
        decoding="async"
        format="webp"
      />
      <div
        aria-hidden="true"
        class="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent dark:from-black/40"
      />
    </div>

    <div
      :class="[
        'relative z-10 flex flex-1 flex-col gap-4 p-5 sm:p-6 lg:gap-6',
        // Featured on lg: text, meta and links on the left, the tech list spanning the right column.
        featured ? 'lg:grid lg:grid-cols-2 lg:grid-rows-[auto_auto_auto_1fr] lg:gap-x-14 lg:gap-y-5 lg:p-10' : 'lg:p-8',
      ]"
    >
      <header class="flex flex-col gap-2 lg:gap-3">
        <p
          v-if="te(`projects.items.${project.key}.role`)"
          class="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary-700 dark:text-primary-300"
        >
          {{ t(`projects.items.${project.key}.role`) }}
        </p>
        <h3
          :id="titleId"
          :class="[
            'text-xl font-bold tracking-tight text-gray-900 dark:text-gray-50 md:text-2xl',
            featured ? 'lg:text-[2rem]' : 'lg:text-[1.75rem]',
          ]"
        >
          {{ t(`projects.items.${project.key}.title`) }}
        </h3>

        <div>
          <p
            :id="descId"
            ref="descEl"
            :class="[
              'overflow-hidden text-sm text-gray-600 transition-[max-height] duration-300 ease-out dark:text-gray-300 sm:text-base motion-reduce:transition-none',
              descFull ? 'max-h-[40rem]' : 'max-h-[4.5rem] sm:max-h-[5rem] lg:max-h-[6.5rem]',
              !descFull && descClamped ? '[mask-image:linear-gradient(to_bottom,black_55%,transparent)]' : '',
            ]"
          >
            {{ t(`projects.items.${project.key}.description`) }}
          </p>
          <button
            v-if="!featured && (descClamped || descOpen)"
            type="button"
            :aria-expanded="descOpen"
            :aria-controls="descId"
            class="mt-1.5 inline-flex items-center gap-1 rounded text-xs font-semibold text-primary-600 transition-colors hover:text-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 dark:text-primary-400 dark:hover:text-primary-300 dark:focus-visible:ring-offset-gray-900"
            @click="toggleDesc()"
          >
            {{ descOpen ? t('projects.showLess') : t('projects.showMore') }}
            <Icon
              name="carbon:chevron-down"
              :class="['h-3.5 w-3.5 transition-transform duration-200', descOpen && 'rotate-180']"
              aria-hidden="true"
            />
          </button>
        </div>
      </header>

      <div :class="['mt-auto flex flex-col gap-4 lg:gap-5', featured && 'lg:contents']">
        <div class="flex flex-wrap items-center gap-x-3 gap-y-1.5 border-t border-gray-200/70 pt-4 text-xs font-medium text-gray-500 dark:border-white/10 dark:text-gray-400 lg:pt-5">
          <span class="inline-flex items-center gap-1.5">
            <Icon
              name="carbon:calendar"
              class="h-3.5 w-3.5"
              aria-hidden="true"
            />
            {{ t(`projects.items.${project.key}.timeline`) }}
          </span>

          <span
            v-if="te(`projects.items.${project.key}.status`)"
            class="inline-flex items-center gap-1.5"
            :class="STATUS_TEXT[project.status ?? 'default']"
          >
            <span
              class="h-1.5 w-1.5 rounded-full"
              :class="STATUS_DOT[project.status ?? 'default']"
              aria-hidden="true"
            />
            {{ t(`projects.items.${project.key}.status`) }}
          </span>
        </div>

        <div
          v-if="project.link || project.repo"
          class="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center"
        >
          <NuxtLink
            v-if="project.link"
            :to="project.link"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-700 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 dark:bg-primary-500 dark:hover:bg-primary-400 dark:focus-visible:ring-offset-gray-900 motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:w-auto"
            :aria-label="`${linkLabel} — ${t(`projects.items.${project.key}.title`)} (${t('projects.opensNewTab')})`"
          >
            {{ linkLabel }}
            <Icon
              name="carbon:launch"
              class="h-4 w-4"
              aria-hidden="true"
            />
          </NuxtLink>
          <NuxtLink
            v-if="project.repo"
            :to="project.repo"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex w-full items-center justify-center gap-1.5 rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-800 transition-all duration-200 hover:-translate-y-0.5 hover:border-gray-400 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 dark:border-white/15 dark:text-gray-100 dark:hover:border-white/30 dark:hover:bg-white/5 dark:focus-visible:ring-offset-gray-900 motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:w-auto"
            :aria-label="`${t('projects.sourceCode')} — ${t(`projects.items.${project.key}.title`)} (${t('projects.opensNewTab')})`"
          >
            <Icon
              name="mdi:github"
              class="h-4 w-4"
              aria-hidden="true"
            />
            {{ t('projects.sourceCode') }}
          </NuxtLink>
        </div>

        <dl
          v-if="presentCategories.length"
          :class="['flex flex-col gap-2 lg:gap-3', featured && 'lg:col-start-2 lg:row-span-4 lg:row-start-1']"
          :aria-label="t('projects.techStack')"
        >
          <div
            :id="techId"
            ref="techEl"
            :class="[
              'flex flex-col gap-2 overflow-hidden transition-[max-height] duration-300 ease-out lg:gap-3 motion-reduce:transition-none',
              techFull ? 'max-h-[40rem]' : 'max-h-[6rem] min-h-[6rem] lg:max-h-[7.5rem] lg:min-h-[7.5rem]',
              !techFull && techClamped ? '[mask-image:linear-gradient(to_bottom,black_60%,transparent)]' : '',
            ]"
          >
            <div
              v-for="category in presentCategories"
              :key="category"
              class="flex flex-wrap items-baseline gap-x-3 gap-y-1.5"
            >
              <dt
                :class="[
                  'inline-flex min-w-[5.25rem] items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-gray-500 dark:text-gray-400',
                  // In the wide featured column a short label let its pills sit inline while the others wrapped below.
                  featured && 'basis-full',
                ]"
              >
                <span
                  class="h-1.5 w-1.5 rounded-full"
                  :class="CATEGORY_STYLES[category].dot"
                  aria-hidden="true"
                />
                {{ t(`projects.tech.${category}`) }}
              </dt>
              <dd class="flex flex-wrap gap-1.5">
                <span
                  v-for="item in project.tech![category]"
                  :key="item"
                  class="group/pill inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-medium shadow-sm ring-1 ring-inset transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                  :class="CATEGORY_STYLES[category].pill"
                >
                  <Icon
                    v-if="techIcon(item)"
                    :name="techIcon(item)!"
                    class="h-3.5 w-3.5 opacity-90 transition-transform duration-200 group-hover/pill:scale-110 motion-reduce:transition-none motion-reduce:group-hover/pill:scale-100"
                    aria-hidden="true"
                  />
                  {{ item }}
                </span>
              </dd>
            </div>
          </div>

          <button
            v-if="!featured && (techClamped || techOpen)"
            type="button"
            :aria-expanded="techOpen"
            :aria-controls="techId"
            class="inline-flex w-fit items-center gap-1 rounded text-xs font-semibold text-primary-600 transition-colors hover:text-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 dark:text-primary-400 dark:hover:text-primary-300 dark:focus-visible:ring-offset-gray-900"
            @click="toggleTech()"
          >
            {{ techOpen ? t('projects.showLess') : t('projects.moreTech', { count: restCount }) }}
            <Icon
              name="carbon:chevron-down"
              :class="['h-3.5 w-3.5 transition-transform duration-200', techOpen && 'rotate-180']"
              aria-hidden="true"
            />
          </button>
        </dl>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { useMouseInElement, useResizeObserver, useToggle } from '@vueuse/core'
import type { Project, TechCategory } from '~/types/project'
import { TECH_CATEGORIES } from '~/types/project'

const { project, featured = false } = defineProps<{
  project: Project
  /** Lead card above the timeline: full-width screenshot banner, text and tech side by side on lg, nothing clamped. */
  featured?: boolean
}>()

const { t, te } = useI18n()

const linkLabel = computed(() =>
  te(`projects.items.${project.key}.linkLabel`)
    ? t(`projects.items.${project.key}.linkLabel`)
    : t('projects.liveDemo'),
)

const titleId = useId()
const descId = useId()
const techId = useId()

const cardEl = useTemplateRef<HTMLElement>('cardEl')
const { elementX, elementY } = useMouseInElement(cardEl)
const spotlightStyle = computed(() => ({
  '--spot-x': `${elementX.value}px`,
  '--spot-y': `${elementY.value}px`,
}))

const descEl = useTemplateRef<HTMLElement>('descEl')
const [descOpen, toggleDesc] = useToggle(false)
const descFull = computed(() => featured || descOpen.value)
const descClamped = shallowRef(false)
useResizeObserver(descEl, () => {
  const el = descEl.value
  if (!el || descFull.value) return
  descClamped.value = el.scrollHeight - el.clientHeight > 1
})

const presentCategories = computed(() =>
  TECH_CATEGORIES.filter(c => (project.tech?.[c]?.length ?? 0) > 0),
)
const restCount = computed(() =>
  presentCategories.value
    .slice(2)
    .reduce((sum, c) => sum + (project.tech?.[c]?.length ?? 0), 0),
)

const techEl = useTemplateRef<HTMLElement>('techEl')
const [techOpen, toggleTech] = useToggle(false)
const techFull = computed(() => featured || techOpen.value)
const techClamped = shallowRef(false)
useResizeObserver(techEl, () => {
  const el = techEl.value
  if (!el || techFull.value) return
  techClamped.value = el.scrollHeight - el.clientHeight > 1
})

const STATUS_TEXT: Record<NonNullable<Project['status']> | 'default', string> = {
  production: 'text-emerald-700 dark:text-emerald-300',
  beta: 'text-amber-700 dark:text-amber-300',
  internal: 'text-sky-700 dark:text-sky-300',
  merged: 'text-violet-700 dark:text-violet-300',
  default: 'text-gray-600 dark:text-gray-300',
}

const STATUS_DOT: Record<NonNullable<Project['status']> | 'default', string> = {
  production: 'bg-emerald-500 dark:bg-emerald-300',
  beta: 'bg-amber-500 dark:bg-amber-300',
  internal: 'bg-sky-500 dark:bg-sky-300',
  merged: 'bg-violet-500 dark:bg-violet-300',
  default: 'bg-gray-500 dark:bg-gray-300',
}

const CATEGORY_STYLES: Record<TechCategory, { pill: string, dot: string }> = {
  frontend: {
    pill: 'bg-gradient-to-b from-sky-50 to-sky-100/60 text-sky-800 ring-sky-300/60 hover:ring-sky-400 hover:shadow-sky-200/50 dark:from-sky-500/15 dark:to-sky-500/5 dark:text-sky-50 dark:ring-sky-400/40 dark:hover:ring-sky-300/70 dark:hover:shadow-sky-500/20',
    dot: 'bg-sky-500 dark:bg-sky-300',
  },
  backend: {
    pill: 'bg-gradient-to-b from-emerald-50 to-emerald-100/60 text-emerald-800 ring-emerald-300/60 hover:ring-emerald-400 hover:shadow-emerald-200/50 dark:from-emerald-500/15 dark:to-emerald-500/5 dark:text-emerald-50 dark:ring-emerald-400/40 dark:hover:ring-emerald-300/70 dark:hover:shadow-emerald-500/20',
    dot: 'bg-emerald-500 dark:bg-emerald-300',
  },
  db: {
    pill: 'bg-gradient-to-b from-amber-50 to-amber-100/60 text-amber-800 ring-amber-300/60 hover:ring-amber-400 hover:shadow-amber-200/50 dark:from-amber-500/15 dark:to-amber-500/5 dark:text-amber-50 dark:ring-amber-400/40 dark:hover:ring-amber-300/70 dark:hover:shadow-amber-500/20',
    dot: 'bg-amber-500 dark:bg-amber-300',
  },
  misc: {
    pill: 'bg-gradient-to-b from-violet-50 to-violet-100/60 text-violet-800 ring-violet-300/60 hover:ring-violet-400 hover:shadow-violet-200/50 dark:from-violet-500/15 dark:to-violet-500/5 dark:text-violet-50 dark:ring-violet-400/40 dark:hover:ring-violet-300/70 dark:hover:shadow-violet-500/20',
    dot: 'bg-violet-500 dark:bg-violet-300',
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
  'tinymce': 'carbon:edit',
  'html': 'simple-icons:html5',
  'pinia': 'simple-icons:pinia',
  'tiptap': 'carbon:text-creation',
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
  'better auth': 'carbon:user-multiple',
  'ai sdk': 'carbon:machine-learning-model',
  'nuxt ui': 'simple-icons:nuxtdotjs',
  'pgvector': 'simple-icons:postgresql',
  'redis': 'simple-icons:redis',
  'docker': 'simple-icons:docker',
  'dokploy': 'selfhst:dokploy',
  'sentry': 'simple-icons:sentry',
  'kea': 'carbon:data-structured',
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
</script>
