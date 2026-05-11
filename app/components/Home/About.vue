<template>
  <section
    id="about"
    class="relative w-full py-24 md:py-32 bg-base-bg text-base-text overflow-hidden"
  >
    <div class="relative max-w-6xl mx-auto px-4">
      <h2 class="text-4xl md:text-5xl font-bold text-primary-700 dark:text-primary-300 text-center tracking-tight mb-14 md:mb-20">
        {{ $t('about.title') }}
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-start">
        <HomeAboutCard />

        <div class="flex flex-col gap-6 facts-column">
          <h3 class="text-2xl font-semibold text-gray-800 dark:text-gray-100">
            {{ $t('about.facts.title') }}
          </h3>
          <div
            v-for="fact in facts"
            :key="fact.key"
            ref="factItems"
            class="fact-item p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700"
          >
            <div class="flex items-start gap-4">
              <span class="w-11 h-11 grid place-items-center rounded-xl bg-primary-50 dark:bg-primary-900 shrink-0">
                <Icon
                  :name="fact.icon"
                  size="22"
                  class="text-primary-600 dark:text-primary-300"
                  aria-hidden="true"
                />
              </span>
              <div>
                <h4 class="text-lg font-medium text-gray-900 dark:text-gray-50">
                  {{ $t(`about.facts.items.${fact.key}.title`) }}
                </h4>
                <p class="mt-1 text-gray-600 dark:text-gray-400 leading-relaxed">
                  {{ $t(`about.facts.items.${fact.key}.description`) }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { gsap } from 'gsap'

const { $gsap } = useNuxtApp() as unknown as { $gsap: typeof gsap }

interface Fact {
  key: string
  icon: string
}

const facts: Fact[] = [
  { key: 'learning', icon: 'mdi:code-tags' },
  { key: 'lifestyle', icon: 'mdi:leaf' },
  { key: 'rpg', icon: 'mdi:sword' },
]

const factItems = useTemplateRef<HTMLElement[]>('factItems')

onMounted(() => {
  if (!factItems.value) return

  factItems.value.forEach((item: HTMLElement) => {
    const onMouseMove = (e: MouseEvent) => {
      const rect = item.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const tiltX = ((y - rect.height / 2) / (rect.height / 2)) * 12
      const tiltY = -((x - rect.width / 2) / (rect.width / 2)) * 12

      $gsap.to(item, {
        rotateX: tiltX,
        rotateY: tiltY,
        duration: 0.3,
        ease: 'power2.out',
      })
    }

    const onMouseLeave = () => {
      $gsap.to(item, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.4,
        ease: 'power2.out',
      })
    }

    item.addEventListener('mousemove', onMouseMove)
    item.addEventListener('mouseleave', onMouseLeave)
  })
})
</script>

<style scoped>
.facts-column {
  perspective: 1200px;
}

.fact-item {
  transform-style: preserve-3d;
  will-change: transform;
  transition: box-shadow 0.3s ease;
}

.fact-item:hover {
  box-shadow: 0 18px 36px rgba(0, 0, 0, 0.15);
}
</style>
