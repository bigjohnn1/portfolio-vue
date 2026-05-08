<template>
  <div
    v-if="flattenedLinks.length > 0"
    class="sticky top-32 overflow-hidden flex flex-col max-h-[calc(100vh-10rem)]"
  >
    <!-- Header -->
    <div class="flex items-center gap-2 px-4 py-3 bg-gray-100 dark:bg-gray-900 rounded-t-xl border border-b-0 border-gray-200 dark:border-gray-700 font-mono text-xs text-gray-500 dark:text-gray-400 shadow-sm">
      <div class="flex gap-1.5">
        <div class="w-3 h-3 rounded-full bg-red-400 border border-red-500/20"></div>
        <div class="w-3 h-3 rounded-full bg-yellow-400 border border-yellow-500/20"></div>
        <div class="w-3 h-3 rounded-full bg-green-400 border border-green-500/20"></div>
      </div>
      <span class="ml-2 flex-1 font-semibold text-gray-700 dark:text-gray-300">~/TOC.sh</span>
      <Icon
        name="carbon:terminal"
        class="w-4 h-4 opacity-50"
      />
    </div>

    <!-- Body -->
    <nav class="flex-1 overflow-y-auto bg-white/50 dark:bg-gray-800/30 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-b-xl p-5 custom-scrollbar shadow-sm">
      <ul class="relative border-l-2 border-gray-100 dark:border-gray-700/50 ml-2 space-y-3">
        <li
          v-for="link in flattenedLinks"
          :key="link.id"
          class="relative group"
        >
          <!-- Active Line Indicator -->
          <div
            class="absolute w-4 h-[2px] bg-gray-200 dark:bg-gray-700 top-1/2 -translate-y-1/2 transition-all duration-300 rounded-r"
            :class="{ '!bg-primary-500 shadow-[0_0_8px_rgba(var(--color-primary-500),0.6)]': activeId === link.id }"
          ></div>

          <!-- Node Dot -->
          <div
            class="absolute w-2.5 h-2.5 rounded-full border-2 border-white dark:border-gray-900 bg-gray-300 dark:bg-gray-600 -left-[7px] top-1/2 -translate-y-1/2 transition-all duration-300 z-10"
            :class="{ '!bg-primary-500 !border-primary-100 dark:!border-primary-900 shadow-[0_0_10px_rgba(var(--color-primary-500),1)] scale-125': activeId === link.id, 'group-hover:bg-primary-400': activeId !== link.id }"
          ></div>

          <a
            :href="`#${link.id}`"
            class="block pl-6 pr-2 py-1 text-sm font-mono transition-all duration-200 hover:translate-x-1"
            :class="[
              activeId === link.id
                ? 'text-primary-600 dark:text-primary-400 font-bold'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100',
            ]"
            :style="{ marginLeft: `${(link.depth - 2) * 1.5}rem` }"
            @click="scrollTo(link.id, $event)"
          >
            <span
              class="mr-1 opacity-40 transition-opacity"
              :class="{ '!opacity-100 text-primary-500': activeId === link.id }"
            >>_</span>
            <span>{{ link.text }}</span>
          </a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup lang="ts">
interface TocLink {
  id: string
  depth: number
  text: string
  children?: TocLink[]
}

const props = defineProps<{
  toc?: {
    links?: TocLink[]
  }
}>()

const activeId = shallowRef('')

const flattenedLinks = computed(() => {
  const result: TocLink[] = []

  const flatten = (links: TocLink[]) => {
    for (const link of links) {
      result.push(link)
      if (link.children) {
        flatten(link.children)
      }
    }
  }

  if (props.toc?.links) {
    flatten(props.toc.links)
  }
  return result
})

let observer: IntersectionObserver | null = null

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      const visibleEntries = entries.filter(entry => entry.isIntersecting)
      if (visibleEntries.length > 0 && visibleEntries[0]) {
        activeId.value = visibleEntries[0].target.id
      }
    },
    {
      rootMargin: '0px 0px -80% 0px',
      threshold: 0,
    },
  )

  setTimeout(() => {
    flattenedLinks.value.forEach((link) => {
      const el = document.getElementById(link.id)
      if (el) observer?.observe(el)
    })
  }, 1000)
})

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
  }
})

const scrollTo = (id: string, e: Event) => {
  e.preventDefault()
  const el = document.getElementById(id)
  if (el) {
    const headerOffset = 100
    const elementPosition = el.getBoundingClientRect().top
    const offsetPosition = elementPosition + window.scrollY - headerOffset

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth',
    })

    activeId.value = id

    history.pushState(null, '', `#${id}`)
  }
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.3);
  border-radius: 20px;
}
.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(75, 85, 99, 0.5);
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: rgba(156, 163, 175, 0.5);
}
</style>
