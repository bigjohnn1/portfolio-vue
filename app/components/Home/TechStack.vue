<template>
  <section
    id="stack"
    class="tech-stack relative w-full py-16 bg-base-bg text-base-text overflow-hidden dark:bg-transparent"
  >
    <div class="max-w-5xl mx-auto px-4">
      <header class="text-center mb-12">
        <h2 class="text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-100">
          {{ $t("techStack.title") }}
        </h2>
        <p class="text-lg text-gray-600 dark:text-gray-400 mt-3">
          {{ $t("techStack.description") }}
        </p>
      </header>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div
          v-for="(tech) in techStack"
          :key="tech.key"
          ref="techItems"
          class="tech-item flex flex-col items-center p-4 bg-gray-200 dark:bg-gray-700 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
        >
          <Icon
            :name="tech.icon"
            class="h-12 w-12 mb-4 text-gray-700 dark:text-gray-200"
            aria-hidden="true"
          />
          <span class="text-lg font-medium text-gray-800 dark:text-gray-100">
            {{ $t(`techStack.items.${tech.key}.name`) }}
          </span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import tippy from 'tippy.js'
import type { Instance } from 'tippy.js'
import 'tippy.js/dist/tippy.css'

const { t, locale } = useI18n()
const techStack = [
  { key: 'vue', icon: 'logos:vue' },
  { key: 'nuxt', icon: 'logos:nuxt-icon' },
  { key: 'typescript', icon: 'logos:typescript-icon' },
  { key: 'javascript', icon: 'logos:javascript' },
  { key: 'react', icon: 'logos:react' },
  { key: 'nextjs', icon: 'logos:nextjs-icon' },
  { key: 'nodejs', icon: 'logos:nodejs-icon' },
  { key: 'postgresql', icon: 'logos:postgresql' },
  { key: 'zenstack', icon: 'logos:prisma' },
  { key: 'nitro', icon: 'unjs:nitro' },
  { key: 'php', icon: 'logos:php' },
  { key: 'tailwind', icon: 'logos:tailwindcss-icon' },
  { key: 'unocss', icon: 'logos:unocss' },
  { key: 'bun', icon: 'logos:bun' },
  { key: 'linux', icon: 'logos:linux-tux' },
  { key: 'cloudflare', icon: 'logos:cloudflare-icon' },
  { key: 'vercel', icon: 'logos:vercel-icon' },
  { key: 'git', icon: 'logos:git-icon' },
]

const techItems = ref<HTMLElement[]>([])
const tippyInstances = ref<Instance[]>([])

onMounted(() => {
  if (techItems.value) {
    techItems.value.forEach((item, i) => {
      const tech = techStack[i]
      if (tech) {
        const instance = tippy(item, {
          content: t(`techStack.items.${tech.key}.description`),
          placement: 'top',
          theme: 'light',
        })
        tippyInstances.value[i] = instance
      }
    })
  }

  watch(locale, () => {
    if (techItems.value) {
      techItems.value.forEach((item, i) => {
        const tech = techStack[i]
        const instance = tippyInstances.value[i]
        if (tech && instance) {
          instance.setContent(
            t(`techStack.items.${tech.key}.description`),
          )
        }
      })
    }
  })
})
</script>
