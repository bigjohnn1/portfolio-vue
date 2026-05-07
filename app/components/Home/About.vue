<template>
  <section
    id="about"
    class="relative w-full py-28 bg-base-bg text-base-text z-10 overflow-hidden"
  >
    <div class="max-w-6xl mx-auto px-4">
      <h2
        class="text-4xl md:text-5xl font-bold text-primary-700 dark:text-primary-300 text-center mb-16 tracking-tight animate-title"
      >
        {{ $t("about.title") }}
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        <div class="flex flex-col gap-8">
          <div class="animate-story">
            <h3
              class="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4"
            >
              {{ $t("about.story.title") }}
            </h3>
            <p class="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
              {{ $t("about.story.description") }}
            </p>
          </div>
          <ul class="list-none space-y-6 animate-points">
            <li class="flex items-start gap-4">
              <Icon
                name="mdi:robot-outline"
                size="24"
                class="text-primary-600 dark:text-primary-400 shrink-0"
                aria-hidden="true"
              />
              <div>
                <h4
                  class="text-lg font-medium text-gray-800 dark:text-gray-100"
                >
                  {{ $t("about.points.workflow.title") }}
                </h4>
                <p class="text-gray-600 dark:text-gray-400">
                  {{ $t("about.points.workflow.description") }}
                </p>
              </div>
            </li>
            <li class="flex items-start gap-4">
              <Icon
                name="mdi:rocket-launch"
                size="24"
                class="text-primary-600 dark:text-primary-400 shrink-0"
                aria-hidden="true"
              />
              <div>
                <h4
                  class="text-lg font-medium text-gray-800 dark:text-gray-100"
                >
                  {{ $t("about.points.principles.title") }}
                </h4>
                <p class="text-gray-600 dark:text-gray-400">
                  {{ $t("about.points.principles.description") }}
                </p>
              </div>
            </li>
          </ul>
        </div>
        <div class="animate-facts">
          <h3
            class="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6"
          >
            {{ $t("about.facts.title") }}
          </h3>
          <div class="grid grid-cols-1 gap-6">
            <div
              v-for="fact in facts"
              :key="fact.key"
              ref="factItems"
              class="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg transition-shadow duration-300 fact-item"
            >
              <div class="flex items-center gap-4">
                <Icon
                  :name="fact.icon"
                  size="32"
                  class="text-primary-600 dark:text-primary-400"
                  aria-hidden="true"
                />
                <div>
                  <h4
                    class="text-lg font-medium text-gray-800 dark:text-gray-100"
                  >
                    {{ $t(`about.facts.items.${fact.key}.title`) }}
                  </h4>
                  <p class="text-gray-600 dark:text-gray-400">
                    {{ $t(`about.facts.items.${fact.key}.description`) }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { $gsap } = useNuxtApp()

interface Fact {
  key: string
  icon: string
}

const facts: Fact[] = [
  { key: 'learning', icon: 'mdi:code-tags' },
  { key: 'lifestyle', icon: 'mdi:leaf' },
  { key: 'rpg', icon: 'mdi:sword' },
]

const factItems = ref<HTMLElement[]>([])

onMounted(() => {
  $gsap.from('.animate-title', {
    y: 30,
    opacity: 0,
    duration: 0.8,
    ease: 'power3.out',
    scrollTrigger: { trigger: '.animate-title', start: 'top 90%' },
  })

  $gsap.from('.animate-story', {
    x: -50,
    opacity: 0,
    duration: 0.8,
    ease: 'power3.out',
    scrollTrigger: { trigger: '.animate-story', start: 'top 90%' },
  })

  $gsap.from('.animate-facts', {
    x: -50,
    y: 20,
    opacity: 0,
    duration: 0.8,
    ease: 'power2.out',
    scrollTrigger: { trigger: '.animate-facts', start: 'top 90%' },
  })

  $gsap.from('.animate-points li', {
    x: -20,
    y: 40,
    opacity: 0,
    duration: 0.6,
    stagger: 0.2,
    ease: 'power3.out',
    scrollTrigger: { trigger: '.animate-points', start: 'top 90%' },
  })

  if (factItems.value) {
    factItems.value.forEach((item: HTMLElement) => {
      const onMouseMove = (e: MouseEvent) => {
        const rect: DOMRect = item.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        const centerX = rect.width / 2
        const centerY = rect.height / 2
        const maxTilt = 25

        const tiltX = ((y - centerY) / centerY) * maxTilt
        const tiltY = -((x - centerX) / centerX) * maxTilt

        $gsap.to(item, {
          rotateX: tiltX,
          rotateY: tiltY,
          boxShadow: '0 15px 30px rgba(0, 0, 0, 0.2)',
          duration: 0.3,
          ease: 'power2.out',
        })
      }

      const onMouseLeave = (): void => {
        $gsap.to(item, {
          rotateX: 0,
          rotateY: 0,
          boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
          duration: 0.3,
          ease: 'power2.out',
        })
      }

      item.addEventListener('mousemove', onMouseMove)
      item.addEventListener('mouseleave', onMouseLeave)
    })
  }
})
</script>
