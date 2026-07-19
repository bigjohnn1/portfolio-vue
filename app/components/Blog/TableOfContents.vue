<template>
  <nav
    v-if="flattenedLinks.length > 0"
    class="sticky top-32 max-h-[calc(100vh-8rem)] overflow-y-auto overscroll-contain pr-4 -mr-4
           [&::-webkit-scrollbar]:w-1
           [&::-webkit-scrollbar-track]:bg-transparent
           [&::-webkit-scrollbar-thumb]:bg-gray-200/60
           dark:[&::-webkit-scrollbar-thumb]:bg-gray-700/50
           hover:[&::-webkit-scrollbar-thumb]:bg-gray-300
           dark:hover:[&::-webkit-scrollbar-thumb]:bg-gray-600
           [&::-webkit-scrollbar-thumb]:rounded-full"
  >
    <p class="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 mb-6 pl-5">
      {{ $t('blog.tableOfContents') || 'Obsah' }}
    </p>

    <ul class="relative border-l border-gray-200/50 dark:border-gray-800/50 flex flex-col">
      <li
        v-for="link in flattenedLinks"
        :key="link.id"
        class="relative"
      >
        <div
          class="absolute inset-0 bg-gradient-to-r from-primary-500/10 dark:from-primary-400/10 to-transparent transition-opacity duration-700 ease-out rounded-r-lg pointer-events-none"
          :class="activeId === link.id ? 'opacity-100' : 'opacity-0'"
          aria-hidden="true"
        ></div>

        <div
          class="absolute left-0 top-0 w-[2px] bg-primary-600 dark:bg-primary-400 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] -ml-[1px]"
          :class="activeId === link.id ? 'h-full shadow-[0_0_12px_rgb(var(--color-primary-500)_/_0.4)]' : 'h-0 top-1/2'"
          aria-hidden="true"
        ></div>

        <a
          :href="`#${link.id}`"
          class="block py-2.5 pr-3 transition-all duration-500 ease-out relative z-10"
          :class="[
            activeId === link.id
              ? 'text-gray-900 dark:text-white font-semibold translate-x-1.5'
              : 'text-gray-500 dark:text-gray-500 hover:text-gray-800 dark:hover:text-gray-300 hover:translate-x-1',
            link.depth === 2 ? 'pl-5 text-sm' : 'pl-8 text-xs',
          ]"
          @click="scrollTo(link.id, $event)"
        >
          {{ link.text }}
        </a>
      </li>
    </ul>
  </nav>
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

const activeId = ref('')

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
  }, 100)
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
