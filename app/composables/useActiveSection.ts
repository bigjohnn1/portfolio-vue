import { useIntersectionObserver } from '@vueuse/core'

export interface SectionDef {
  id: string
  labelKey: string
}

export const useActiveSection = (sections: SectionDef[], rootMargin = '-45% 0px -50% 0px') => {
  const activeId = shallowRef<string>(sections[0]?.id ?? '')

  onMounted(() => {
    if (!import.meta.client) return
    nextTick(() => {
      sections.forEach((s) => {
        const el = document.getElementById(s.id)
        if (!el) return
        useIntersectionObserver(
          el,
          ([entry]) => {
            if (entry?.isIntersecting) activeId.value = s.id
          },
          { threshold: 0, rootMargin },
        )
      })
    })
  })

  return { activeId }
}
