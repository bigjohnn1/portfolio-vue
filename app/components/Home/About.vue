<template>
  <section
    id="about"
    class="relative w-full overflow-hidden bg-base-bg py-24 text-base-text dark:bg-transparent md:py-32"
  >
    <div class="relative mx-auto max-w-6xl px-4">
      <h2 class="mb-14 text-center text-4xl font-bold tracking-tight text-primary-700 md:mb-20 md:text-5xl dark:text-primary-300">
        {{ $t('about.title') }}
      </h2>

      <div class="grid grid-cols-1 items-start gap-12 md:grid-cols-2 lg:gap-16">
        <HomeAboutCard />

        <div class="flex flex-col gap-6">
          <h3 class="text-2xl font-semibold text-gray-800 dark:text-gray-100">
            {{ $t('about.facts.title') }}
          </h3>

          <HomeAboutFactCard
            v-for="fact in facts"
            :key="fact.key"
            :fact="fact"
          />
        </div>
      </div>

      <HomeAboutAchievements />
    </div>
  </section>
</template>

<script setup lang="ts">
type FactKey = 'learning' | 'lifestyle' | 'rpg'

interface Fact {
  key: FactKey
  rail: string
  accentRgbLight: string
  accentRgbDark: string
}

const facts: Fact[] = [
  {
    key: 'learning',
    rail: 'bg-gradient-to-b from-indigo-400 to-indigo-600',
    accentRgbLight: '99 102 241',
    accentRgbDark: '129 140 248',
  },
  {
    key: 'lifestyle',
    rail: 'bg-gradient-to-b from-amber-400 to-amber-600',
    accentRgbLight: '245 158 11',
    accentRgbDark: '251 191 36',
  },
  {
    key: 'rpg',
    rail: 'bg-gradient-to-b from-violet-400 to-violet-600',
    accentRgbLight: '139 92 246',
    accentRgbDark: '167 139 250',
  },
]
</script>
