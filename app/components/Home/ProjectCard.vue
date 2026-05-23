<template>
  <article
    ref="cardEl"
    :aria-labelledby="titleId"
    :class="[
      'group/card relative flex min-h-[33rem] flex-col overflow-hidden rounded-2xl border bg-white/90 shadow-[0_4px_16px_rgba(15,23,42,0.06)] backdrop-blur-sm transition-[transform,box-shadow,border-color] duration-300 ease-out lg:min-h-[35rem]',
      'hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(15,23,42,0.12)] focus-within:-translate-y-1 focus-within:shadow-[0_12px_32px_rgba(15,23,42,0.12)]',
      'motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:focus-within:translate-y-0',
      project.kind === 'experiment'
        ? '[--card-glow:rgba(167,139,250,0.20)] border-violet-200/70 hover:border-violet-300 dark:border-violet-400/25 dark:bg-violet-950/30 dark:hover:border-violet-300/50'
        : '[--card-glow:rgba(56,189,248,0.18)] border-gray-200/80 hover:border-gray-300 dark:border-white/[0.08] dark:bg-gray-900/70 dark:hover:border-white/15',
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
      v-if="project.kind === 'experiment'"
      aria-hidden="true"
      class="pointer-events-none absolute inset-x-0 top-0 z-20 h-px bg-gradient-to-r from-transparent via-violet-400/70 to-transparent dark:via-violet-300/50"
    />

    <div class="relative z-10 overflow-hidden">
      <NuxtImg
        :src="project.image"
        :alt="t(`projects.items.${project.key}.title`)"
        sizes="sm:100vw md:50vw lg:480px"
        class="h-52 w-full object-cover transition-transform duration-500 ease-out group-hover/card:scale-[1.03] group-focus-within/card:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover/card:scale-100 lg:h-64"
        loading="lazy"
        decoding="async"
        format="webp"
      />
      <div
        aria-hidden="true"
        class="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent dark:from-black/40"
      />
    </div>

    <div class="relative z-10 flex flex-1 flex-col gap-4 p-5 sm:p-6 lg:gap-6 lg:p-8">
      <header class="flex flex-col gap-2 lg:gap-3">
        <div class="flex flex-wrap items-center gap-2">
          <h3
            :id="titleId"
            class="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-50 md:text-2xl lg:text-[1.75rem]"
          >
            {{ t(`projects.items.${project.key}.title`) }}
          </h3>
          <span
            v-if="project.kind === 'experiment'"
            class="inline-flex items-center gap-1 rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-violet-800 ring-1 ring-inset ring-violet-300/60 dark:bg-violet-500/15 dark:text-violet-100 dark:ring-violet-400/40"
          >
            <Icon
              name="game-icons:test-tubes"
              class="h-3 w-3"
              aria-hidden="true"
            />
            {{ t('projects.experiments.badge') }}
          </span>
        </div>

        <div>
          <p
            :id="descId"
            ref="descEl"
            :class="[
              'overflow-hidden text-sm text-gray-600 transition-[max-height] duration-300 ease-out dark:text-gray-300 sm:text-base motion-reduce:transition-none',
              descOpen ? 'max-h-[40rem]' : 'max-h-[4.5rem] sm:max-h-[5rem] lg:max-h-[6.5rem]',
              !descOpen && descClamped ? '[mask-image:linear-gradient(to_bottom,black_55%,transparent)]' : '',
            ]"
          >
            {{ t(`projects.items.${project.key}.description`) }}
          </p>
          <button
            v-if="descClamped || descOpen"
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

      <div class="mt-auto flex flex-col gap-4 lg:gap-5">
        <div class="flex flex-wrap items-center gap-2">
          <span class="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-200">
            <Icon
              name="carbon:calendar"
              class="h-3.5 w-3.5"
              aria-hidden="true"
            />
            {{ t(`projects.items.${project.key}.timeline`) }}
          </span>

          <span
            v-if="te(`projects.items.${project.key}.status`)"
            class="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset"
            :class="STATUS_STYLES[project.status ?? 'default']"
          >
            <span
              class="h-1.5 w-1.5 rounded-full"
              :class="STATUS_DOT[project.status ?? 'default']"
              aria-hidden="true"
            />
            {{ t(`projects.items.${project.key}.status`) }}
          </span>

          <NuxtLink
            v-if="project.link"
            :to="project.link"
            target="_blank"
            rel="noopener noreferrer"
            class="ml-auto inline-flex items-center gap-1.5 rounded-full bg-primary-600 px-3 py-1 text-xs font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-700 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 dark:bg-primary-500 dark:hover:bg-primary-400 dark:focus-visible:ring-offset-gray-900 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            :aria-label="`${t('projects.liveDemo')} — ${t(`projects.items.${project.key}.title`)} (${t('projects.opensNewTab')})`"
          >
            {{ t('projects.liveDemo') }}
            <Icon
              name="carbon:launch"
              class="h-3.5 w-3.5"
              aria-hidden="true"
            />
          </NuxtLink>
        </div>

        <dl
          v-if="presentCategories.length"
          class="flex flex-col gap-2 lg:gap-3"
          :aria-label="t('projects.techStack')"
        >
          <div
            v-for="category in previewCategories"
            :key="category"
            class="flex flex-wrap items-baseline gap-x-3 gap-y-1.5"
          >
            <dt class="inline-flex min-w-[5.25rem] items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-gray-500 dark:text-gray-400">
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

          <CollapsibleRoot
            v-if="restCategories.length"
            v-model:open="techOpen"
            class="flex flex-col gap-2 lg:gap-3"
          >
            <CollapsibleContent class="reka-collapsible overflow-hidden">
              <div class="flex flex-col gap-2 pt-2 lg:gap-3">
                <div
                  v-for="category in restCategories"
                  :key="category"
                  class="flex flex-wrap items-baseline gap-x-3 gap-y-1.5"
                >
                  <dt class="inline-flex min-w-[5.25rem] items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-gray-500 dark:text-gray-400">
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
            </CollapsibleContent>

            <CollapsibleTrigger
              class="inline-flex w-fit items-center gap-1 rounded text-xs font-semibold text-primary-600 transition-colors hover:text-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 dark:text-primary-400 dark:hover:text-primary-300 dark:focus-visible:ring-offset-gray-900"
            >
              {{ techOpen ? t('projects.showLess') : t('projects.moreTech', { count: restCount }) }}
              <Icon
                name="carbon:chevron-down"
                :class="['h-3.5 w-3.5 transition-transform duration-200', techOpen && 'rotate-180']"
                aria-hidden="true"
              />
            </CollapsibleTrigger>
          </CollapsibleRoot>
        </dl>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { useMouseInElement, useResizeObserver, useToggle } from '@vueuse/core'
import { CollapsibleContent, CollapsibleRoot, CollapsibleTrigger } from 'reka-ui'
import type { Project, TechCategory } from '~/types/project'
import { TECH_CATEGORIES } from '~/types/project'

const { project } = defineProps<{ project: Project }>()

const { t, te } = useI18n()

const titleId = useId()
const descId = useId()

const cardEl = useTemplateRef<HTMLElement>('cardEl')
const { elementX, elementY } = useMouseInElement(cardEl)
const spotlightStyle = computed(() => ({
  '--spot-x': `${elementX.value}px`,
  '--spot-y': `${elementY.value}px`,
}))

const descEl = useTemplateRef<HTMLElement>('descEl')
const [descOpen, toggleDesc] = useToggle(false)
const descClamped = shallowRef(false)
useResizeObserver(descEl, () => {
  const el = descEl.value
  if (!el || descOpen.value) return
  descClamped.value = el.scrollHeight - el.clientHeight > 1
})

const presentCategories = computed(() =>
  TECH_CATEGORIES.filter(c => (project.tech?.[c]?.length ?? 0) > 0),
)
const previewCategories = computed(() => presentCategories.value.slice(0, 2))
const restCategories = computed(() => presentCategories.value.slice(2))
const restCount = computed(() =>
  restCategories.value.reduce((sum, c) => sum + (project.tech?.[c]?.length ?? 0), 0),
)
const [techOpen] = useToggle(false)

const STATUS_STYLES: Record<NonNullable<Project['status']> | 'default', string> = {
  production: 'bg-emerald-50 text-emerald-800 ring-emerald-300/60 dark:bg-emerald-500/15 dark:text-emerald-100 dark:ring-emerald-400/40',
  beta: 'bg-amber-50 text-amber-800 ring-amber-300/60 dark:bg-amber-500/15 dark:text-amber-100 dark:ring-amber-400/40',
  internal: 'bg-sky-50 text-sky-800 ring-sky-300/60 dark:bg-sky-500/15 dark:text-sky-100 dark:ring-sky-400/40',
  default: 'bg-gray-100 text-gray-700 ring-gray-300/60 dark:bg-gray-700/50 dark:text-gray-200 dark:ring-gray-500/50',
}

const STATUS_DOT: Record<NonNullable<Project['status']> | 'default', string> = {
  production: 'bg-emerald-500 dark:bg-emerald-300',
  beta: 'bg-amber-500 dark:bg-amber-300',
  internal: 'bg-sky-500 dark:bg-sky-300',
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
</script>

<style>
.reka-collapsible[data-state='open'] {
  animation: reka-collapsible-down 300ms ease-out;
}
.reka-collapsible[data-state='closed'] {
  animation: reka-collapsible-up 300ms ease-out;
}

@keyframes reka-collapsible-down {
  from {
    height: 0;
  }
  to {
    height: var(--reka-collapsible-content-height);
  }
}

@keyframes reka-collapsible-up {
  from {
    height: var(--reka-collapsible-content-height);
  }
  to {
    height: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .reka-collapsible[data-state='open'],
  .reka-collapsible[data-state='closed'] {
    animation: none;
  }
}
</style>
