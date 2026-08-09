<template>
  <section
    id="activity"
    class="relative w-full overflow-hidden py-section-y bg-white dark:bg-transparent"
  >
    <div
      ref="rootEl"
      class="relative z-10 mx-auto max-w-6xl px-section-x"
    >
      <header class="flex flex-col items-center text-center">
        <span class="inline-flex items-center gap-2 rounded-full border border-primary-500/25 bg-primary-500/5 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-primary-700 dark:border-primary-300/25 dark:bg-primary-300/5 dark:text-primary-300">
          <span
            aria-hidden="true"
            class="relative flex h-2 w-2"
          >
            <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500/70 motion-reduce:hidden" />
            <span class="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          {{ $t('github.kicker') }}
        </span>

        <h2 class="mt-4 flex items-center gap-3 text-d-md font-bold text-gray-900 dark:text-gray-50">
          <Icon
            name="simple-icons:github"
            size="28"
            aria-hidden="true"
            class="hidden text-gray-800 sm:block dark:text-gray-100"
          />
          {{ $t('github.title') }}
        </h2>

        <p class="mt-3 max-w-prose text-lg text-gray-600 dark:text-gray-400">
          {{ $t('github.description') }}
        </p>
      </header>

      <div
        v-if="hasFailed"
        class="mt-12 flex flex-col items-center gap-4 rounded-2xl border border-dashed border-gray-300 bg-gray-50/70 px-6 py-10 text-center dark:border-white/10 dark:bg-white/[0.03]"
      >
        <Icon
          name="lucide:cloud-off"
          size="28"
          aria-hidden="true"
          class="text-gray-400 dark:text-gray-500"
        />
        <p class="text-sm text-gray-600 dark:text-gray-400">
          {{ $t('github.state.error') }}
        </p>
        <div class="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            class="inline-flex items-center gap-2 rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors duration-200 hover:border-primary-500 hover:text-primary-700 dark:border-white/15 dark:text-gray-200 dark:hover:border-primary-300 dark:hover:text-primary-200"
            @click="execute()"
          >
            <Icon
              name="lucide:rotate-cw"
              size="15"
              aria-hidden="true"
            />
            {{ $t('github.state.retry') }}
          </button>
          <NuxtLink
            :to="profileUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-2 rounded-full bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition-colors duration-200 hover:bg-primary-700"
          >
            <Icon
              name="simple-icons:github"
              size="15"
              aria-hidden="true"
            />
            {{ $t('github.profileCta') }}
          </NuxtLink>
        </div>
      </div>

      <div
        v-else-if="isLoading"
        class="mt-12 animate-pulse motion-reduce:animate-none"
        aria-hidden="true"
      >
        <div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div
            v-for="placeholder in 4"
            :key="placeholder"
            class="h-28 rounded-2xl bg-gray-200/70 dark:bg-white/5"
          />
        </div>
        <div class="mt-5 grid gap-5 lg:grid-cols-3">
          <div class="h-72 rounded-2xl bg-gray-200/70 lg:col-span-2 dark:bg-white/5" />
          <div class="h-72 rounded-2xl bg-gray-200/70 dark:bg-white/5" />
        </div>
      </div>

      <div
        v-else-if="stats"
        class="mt-12"
      >
        <ul class="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <li
            v-for="tile in statTiles"
            :key="tile.key"
            ref="statCards"
            class="group relative overflow-hidden rounded-2xl border border-gray-200/80 bg-white/90 p-5 shadow-[0_1px_3px_rgba(15,23,42,0.05),0_12px_30px_-20px_rgba(15,23,42,0.35)] transition-colors duration-300 hover:border-primary-400/60 dark:border-white/10 dark:bg-gray-900/70 dark:backdrop-blur-sm dark:hover:border-primary-300/40"
          >
            <span
              aria-hidden="true"
              class="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-primary-500/10 blur-2xl transition-opacity duration-500 group-hover:opacity-100 dark:bg-primary-300/10"
            />
            <Icon
              :name="tile.icon"
              size="18"
              aria-hidden="true"
              class="text-primary-600 dark:text-primary-300"
            />
            <p class="mt-3 text-3xl font-bold tabular-nums tracking-tight text-gray-900 dark:text-gray-50">
              {{ formatNumber(tile.value) }}
            </p>
            <p class="mt-1 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-gray-500 dark:text-gray-400">
              {{ $t(`github.stats.${tile.key}.label`) }}
            </p>
            <p class="mt-1 text-xs text-gray-500/90 dark:text-gray-500">
              {{ tile.hint }}
            </p>
          </li>
        </ul>

        <div class="mt-5 grid gap-5 lg:grid-cols-3">
          <article class="rounded-2xl border border-gray-200/80 bg-white/90 p-5 shadow-[0_1px_3px_rgba(15,23,42,0.05),0_12px_30px_-20px_rgba(15,23,42,0.35)] lg:col-span-2 lg:p-6 dark:border-white/10 dark:bg-gray-900/70 dark:backdrop-blur-sm">
            <header class="flex flex-wrap items-baseline justify-between gap-2">
              <h3 class="text-base font-semibold text-gray-900 dark:text-gray-50">
                {{ $t('github.calendar.title') }}
              </h3>
              <p class="text-xs font-medium text-gray-500 dark:text-gray-400">
                {{ $t('github.calendar.total', { count: formatNumber(calendarTotal) }) }}
              </p>
            </header>

            <div class="mt-4 -mx-1 overflow-x-auto px-1 pb-1">
              <svg
                :viewBox="`0 0 ${svgWidth} ${SVG_HEIGHT}`"
                role="img"
                :aria-label="$t('github.calendar.aria', { count: formatNumber(calendarTotal) })"
                class="h-auto w-full min-w-[38rem]"
              >
                <text
                  v-for="month in monthLabels"
                  :key="`m-${month.x}`"
                  :x="month.x"
                  :y="10"
                  class="fill-gray-500 text-[9px] font-medium dark:fill-gray-400"
                >
                  {{ month.label }}
                </text>

                <text
                  v-for="weekday in weekdayLabels"
                  :key="`w-${weekday.y}`"
                  :x="0"
                  :y="weekday.y"
                  class="fill-gray-500 text-[9px] font-medium dark:fill-gray-400"
                >
                  {{ weekday.label }}
                </text>

                <g
                  v-for="column in weekColumns"
                  :key="column.key"
                  ref="weekGroups"
                >
                  <rect
                    v-for="cell in column.cells"
                    :key="cell.date"
                    :x="cell.x"
                    :y="cell.y"
                    :width="CELL_SIZE"
                    :height="CELL_SIZE"
                    rx="2.5"
                    :class="LEVEL_CLASSES[cell.level]"
                  >
                    <title>{{ cell.tooltip }}</title>
                  </rect>
                </g>
              </svg>
            </div>

            <div class="mt-3 flex items-center justify-end gap-1.5 text-[0.68rem] font-medium text-gray-500 dark:text-gray-400">
              <span>{{ $t('github.calendar.less') }}</span>
              <svg
                :width="5 * 14"
                height="12"
                aria-hidden="true"
              >
                <rect
                  v-for="level in LEVELS"
                  :key="`l-${level}`"
                  :x="level * 14"
                  y="1"
                  :width="CELL_SIZE"
                  :height="CELL_SIZE"
                  rx="2.5"
                  :class="LEVEL_CLASSES[level]"
                />
              </svg>
              <span>{{ $t('github.calendar.more') }}</span>
            </div>

            <div
              v-if="languages.length"
              class="mt-6 border-t border-gray-200/70 pt-5 dark:border-white/10"
            >
              <h4 class="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-gray-500 dark:text-gray-400">
                {{ $t('github.languages.title') }}
              </h4>
              <div class="mt-3 flex h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-white/10">
                <span
                  v-for="language in languages"
                  :key="language.name"
                  :style="{ width: `${language.percent}%`, backgroundColor: language.color }"
                  :title="`${language.name} · ${language.percent}%`"
                />
              </div>
              <ul class="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
                <li
                  v-for="language in languages"
                  :key="language.name"
                  class="inline-flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400"
                >
                  <span
                    aria-hidden="true"
                    class="h-2 w-2 rounded-full"
                    :style="{ backgroundColor: language.color }"
                  />
                  <span class="font-medium text-gray-800 dark:text-gray-200">{{ language.name }}</span>
                  <span class="tabular-nums">{{ language.percent }}%</span>
                </li>
              </ul>
            </div>
          </article>

          <article class="flex flex-col rounded-2xl border border-gray-200/80 bg-white/90 p-5 shadow-[0_1px_3px_rgba(15,23,42,0.05),0_12px_30px_-20px_rgba(15,23,42,0.35)] lg:p-6 dark:border-white/10 dark:bg-gray-900/70 dark:backdrop-blur-sm">
            <h3 class="flex items-center gap-2 text-base font-semibold text-gray-900 dark:text-gray-50">
              <Icon
                name="lucide:git-commit-horizontal"
                size="17"
                aria-hidden="true"
                class="text-primary-600 dark:text-primary-300"
              />
              {{ $t('github.commits.title') }}
            </h3>

            <p
              v-if="!commitLog.length"
              class="mt-4 text-sm text-gray-500 dark:text-gray-400"
            >
              {{ $t('github.commits.empty') }}
            </p>

            <ol
              v-else
              class="mt-4 space-y-3"
            >
              <li
                v-for="commit in commitLog"
                :key="commit.sha"
                class="group relative border-l border-gray-200 pl-4 dark:border-white/10"
              >
                <span
                  aria-hidden="true"
                  class="absolute -left-[3px] top-1.5 h-1.5 w-1.5 rounded-full bg-primary-500 transition-transform duration-300 group-hover:scale-150 motion-reduce:transition-none dark:bg-primary-300"
                />
                <NuxtLink
                  :to="commit.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="block text-sm font-medium leading-snug text-gray-800 transition-colors duration-200 hover:text-primary-700 dark:text-gray-200 dark:hover:text-primary-200"
                >
                  {{ commit.message }}
                </NuxtLink>
                <p class="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[0.7rem] text-gray-500 dark:text-gray-500">
                  <span class="font-mono text-gray-600 dark:text-gray-400">{{ commit.sha }}</span>
                  <span aria-hidden="true">·</span>
                  <span class="truncate">{{ commit.repo }}</span>
                  <span aria-hidden="true">·</span>
                  <NuxtTime
                    :datetime="commit.date"
                    :locale="intlLocale"
                    relative
                  />
                </p>
              </li>
            </ol>

            <footer class="mt-auto flex flex-wrap items-center justify-between gap-2 pt-5 text-[0.7rem] text-gray-500 dark:text-gray-500">
              <span class="inline-flex items-center gap-1.5">
                <Icon
                  name="lucide:refresh-cw"
                  size="12"
                  aria-hidden="true"
                />
                {{ $t('github.state.updated') }}
                <NuxtTime
                  :datetime="fetchedAt"
                  :locale="intlLocale"
                  relative
                />
              </span>
              <NuxtLink
                :to="profileUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-1.5 font-semibold text-primary-700 transition-colors duration-200 hover:text-primary-800 dark:text-primary-300 dark:hover:text-primary-200"
              >
                {{ $t('github.profileCta') }}
                <Icon
                  name="lucide:arrow-up-right"
                  size="13"
                  aria-hidden="true"
                />
              </NuxtLink>
            </footer>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useElementVisibility, usePreferredReducedMotion } from '@vueuse/core'
import type { ContributionLevel, GithubStats } from '~~/shared/github'

const { t, locale } = useI18n()
const { $gsap } = useNuxtApp()
const config = useRuntimeConfig()

const CELL_SIZE = 11
const CELL_STEP = 14
const OFFSET_X = 28
const OFFSET_Y = 18
const SVG_HEIGHT = OFFSET_Y + 7 * CELL_STEP
const LEVELS: ContributionLevel[] = [0, 1, 2, 3, 4]

const LEVEL_CLASSES: Record<ContributionLevel, string> = {
  0: 'fill-gray-200 dark:fill-white/[0.07]',
  1: 'fill-primary-200 dark:fill-primary-900',
  2: 'fill-primary-400 dark:fill-primary-700',
  3: 'fill-primary-500 dark:fill-primary-500',
  4: 'fill-primary-700 dark:fill-primary-300',
}

const rootEl = useTemplateRef<HTMLElement>('rootEl')
const statCards = useTemplateRef<HTMLElement[]>('statCards')
const weekGroups = useTemplateRef<SVGGElement[]>('weekGroups')

const isVisible = useElementVisibility(rootEl)
const reducedMotion = usePreferredReducedMotion()

const { data, status, execute } = useFetch<GithubStats>('/api/github/stats', {
  server: false,
  lazy: true,
  immediate: false,
})

const stopVisibilityWatch = watch(isVisible, (visible) => {
  if (!visible) return
  stopVisibilityWatch()
  execute()
})

const stats = computed(() => data.value ?? null)
const calendarTotal = computed(() => stats.value?.calendar.total ?? 0)
const languages = computed(() => stats.value?.languages ?? [])
const commitLog = computed(() => stats.value?.commits ?? [])
const fetchedAt = computed(() => stats.value?.fetchedAt ?? new Date().toISOString())
const hasFailed = computed(() => status.value === 'error')
const isLoading = computed(() => !stats.value && !hasFailed.value)
const profileUrl = computed(() => stats.value?.profileUrl ?? `https://github.com/${config.public.github.username}`)

const intlLocale = computed(() => toIntlLocale(locale.value))
const numberFormatter = computed(() => new Intl.NumberFormat(intlLocale.value))
const dateFormatter = computed(() => new Intl.DateTimeFormat(intlLocale.value, { dateStyle: 'medium' }))
const monthFormatter = computed(() => new Intl.DateTimeFormat(intlLocale.value, { month: 'short' }))
const weekdayFormatter = computed(() => new Intl.DateTimeFormat(intlLocale.value, { weekday: 'short' }))

const formatNumber = (value: number) => numberFormatter.value.format(value)

const statTiles = computed(() => {
  const totals = stats.value?.totals
  const streak = stats.value?.streak

  return [
    {
      key: 'contributions',
      icon: 'lucide:activity',
      value: totals?.contributions ?? 0,
      hint: t('github.stats.contributions.hint'),
    },
    {
      key: 'commits',
      icon: 'lucide:git-commit-horizontal',
      value: totals?.commits ?? 0,
      hint: t('github.stats.commits.hint'),
    },
    {
      key: 'streak',
      icon: 'lucide:flame',
      value: streak?.current ?? 0,
      hint: t('github.stats.streak.hint', { count: streak?.longest ?? 0 }),
    },
    {
      key: 'repositories',
      icon: 'lucide:folder-git-2',
      value: totals?.repositories ?? 0,
      hint: t('github.stats.repositories.hint'),
    },
  ]
})

const weekColumns = computed(() =>
  (stats.value?.calendar.weeks ?? []).map((week, weekIndex) => ({
    key: week[0]?.date ?? `week-${weekIndex}`,
    cells: week.map((day) => {
      const date = new Date(`${day.date}T00:00:00Z`)
      return {
        date: day.date,
        level: day.level,
        x: OFFSET_X + weekIndex * CELL_STEP,
        y: OFFSET_Y + date.getUTCDay() * CELL_STEP,
        tooltip: day.count === 0
          ? t('github.calendar.tooltipNone', { date: dateFormatter.value.format(date) })
          : t('github.calendar.tooltip', { count: day.count, date: dateFormatter.value.format(date) }),
      }
    }),
  })),
)

const svgWidth = computed(() => OFFSET_X + Math.max(weekColumns.value.length, 1) * CELL_STEP)

const monthLabels = computed(() => {
  const labels: { x: number, label: string }[] = []
  let lastMonth = -1

  weekColumns.value.forEach((column, index) => {
    const first = column.cells[0]
    if (!first) return

    const date = new Date(`${first.date}T00:00:00Z`)
    const month = date.getUTCMonth()
    if (month === lastMonth) return

    lastMonth = month
    if (index === weekColumns.value.length - 1) return
    labels.push({ x: OFFSET_X + index * CELL_STEP, label: monthFormatter.value.format(date) })
  })

  return labels
})

const weekdayLabels = computed(() =>
  [1, 3, 5].map(row => ({
    y: OFFSET_Y + row * CELL_STEP + CELL_SIZE - 1,
    label: weekdayFormatter.value.format(new Date(Date.UTC(2024, 0, 7 + row))),
  })),
)

watch(stats, async (value) => {
  if (!value || reducedMotion.value === 'reduce') return
  await nextTick()

  if (statCards.value?.length) {
    $gsap.from(statCards.value, {
      y: 20,
      opacity: 0,
      duration: 0.6,
      ease: 'power3.out',
      stagger: 0.07,
    })
  }

  if (weekGroups.value?.length) {
    $gsap.from(weekGroups.value, {
      opacity: 0,
      scaleY: 0.4,
      transformOrigin: 'center',
      duration: 0.5,
      ease: 'power2.out',
      stagger: 0.008,
    })
  }
})
</script>
