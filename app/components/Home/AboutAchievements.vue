<template>
  <div
    ref="rootEl"
    class="relative mt-14 md:mt-20"
  >
    <header class="flex flex-col items-center text-center">
      <span class="inline-flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-amber-600 dark:text-amber-300">
        <Icon
          name="simple-icons:anthropic"
          size="14"
          aria-hidden="true"
        />
        {{ $t('about.achievements.kicker') }}
      </span>
      <h3 class="mt-2 flex items-center gap-3 text-2xl font-bold tracking-tight text-gray-900 md:text-3xl dark:text-gray-50">
        <span
          aria-hidden="true"
          class="hidden h-px w-8 bg-gradient-to-r from-transparent to-amber-400/70 sm:block"
        />
        {{ $t('about.achievements.title') }}
        <span
          aria-hidden="true"
          class="hidden h-px w-8 bg-gradient-to-l from-transparent to-amber-400/70 sm:block"
        />
      </h3>
    </header>

    <ul class="mt-9 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <li
        v-for="cert in achievements"
        :key="cert.key"
        ref="cardEls"
        class="group relative isolate flex flex-col overflow-hidden rounded-2xl border border-amber-300/50 bg-gradient-to-b from-amber-50/80 to-white p-5 shadow-[0_1px_3px_rgba(120,53,15,0.05),0_10px_30px_-16px_rgba(180,120,10,0.25)] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:border-amber-400/80 hover:shadow-[0_1px_3px_rgba(120,53,15,0.05),0_18px_40px_-16px_rgba(217,150,20,0.4)] motion-reduce:transition-none motion-reduce:hover:translate-y-0 dark:border-amber-400/20 dark:from-amber-500/[0.07] dark:to-gray-900/70 dark:hover:border-amber-300/40"
      >
        <span
          aria-hidden="true"
          class="pointer-events-none absolute -inset-y-2 -left-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-amber-200/50 to-transparent transition-[left] duration-700 ease-out group-hover:left-[150%] motion-reduce:hidden dark:via-amber-100/10"
        />

        <div class="flex items-start justify-between">
          <span class="relative grid h-12 w-12 place-items-center">
            <svg
              viewBox="0 0 48 48"
              class="absolute inset-0 h-12 w-12 text-amber-400 drop-shadow-sm transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:rotate-[30deg] motion-reduce:transition-none dark:text-amber-300/80"
              aria-hidden="true"
            >
              <polygon
                points="24,3 40,13 40,35 24,45 8,35 8,13"
                fill="currentColor"
                fill-opacity="0.12"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linejoin="round"
              />
            </svg>
            <Icon
              :name="cert.icon"
              size="22"
              class="relative z-10 text-amber-700 dark:text-amber-200"
              aria-hidden="true"
            />
          </span>

          <span class="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[0.62rem] font-bold uppercase tracking-wider text-amber-700 ring-1 ring-inset ring-amber-500/25 dark:bg-amber-400/10 dark:text-amber-200 dark:ring-amber-300/25">
            <Icon
              name="lucide:check"
              size="11"
              aria-hidden="true"
            />
            {{ $t('about.achievements.unlocked') }}
          </span>
        </div>

        <p class="mt-4 text-[0.95rem] font-semibold leading-snug text-gray-900 dark:text-gray-50">
          {{ $t(`about.achievements.items.${cert.key}.name`) }}
        </p>

        <p class="mt-auto flex items-center gap-1.5 pt-3 text-xs font-medium text-gray-500 dark:text-gray-400">
          <Icon
            name="simple-icons:anthropic"
            size="12"
            aria-hidden="true"
          />
          {{ $t('about.achievements.issuer') }}
        </p>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
const { $gsap } = useNuxtApp()

interface Achievement {
  key: string
  icon: string
}

const achievements: Achievement[] = [
  { key: 'api', icon: 'lucide:braces' },
  { key: 'skills', icon: 'lucide:sparkles' },
  { key: 'claudeCode', icon: 'lucide:square-terminal' },
  { key: 'mcp', icon: 'lucide:network' },
]

const rootEl = useTemplateRef<HTMLElement>('rootEl')
const cardEls = useTemplateRef<HTMLElement[]>('cardEls')

onMounted(() => {
  if (!cardEls.value?.length) return
  $gsap.from(cardEls.value, {
    y: 24,
    opacity: 0,
    duration: 0.7,
    ease: 'power3.out',
    stagger: 0.09,
    scrollTrigger: { trigger: rootEl.value, start: 'top 85%' },
  })
})
</script>
