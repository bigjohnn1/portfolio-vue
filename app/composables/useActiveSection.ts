import { useEventListener, useThrottleFn } from '@vueuse/core'

export interface SectionDef {
  id: string
  labelKey: string
}

export const useActiveSection = (sections: SectionDef[], lineRatio = 0.4) => {
  const activeId = shallowRef<string>(sections[0]?.id ?? '')
  const progress = shallowRef(0)

  const resolve = () => {
    const count = sections.length
    if (count === 0) return

    const lineDoc = window.scrollY + window.innerHeight * lineRatio
    const tops = sections.map((s) => {
      const el = document.getElementById(s.id)
      return el ? el.getBoundingClientRect().top + window.scrollY : null
    })

    let index = 0
    for (let i = 0; i < count; i++) {
      const top = tops[i]
      if (top != null && top <= lineDoc) index = i
    }

    let within = 0
    const current = tops[index]
    const next = tops[index + 1]
    if (current != null && next != null && next > current) {
      within = Math.min(1, Math.max(0, (lineDoc - current) / (next - current)))
    }

    const atBottom
      = window.innerHeight + window.scrollY
        >= document.documentElement.scrollHeight - 2
    if (atBottom) {
      index = count - 1
      within = 0
    }

    activeId.value = sections[index]?.id ?? activeId.value
    progress.value = count > 1 ? (index + within) / (count - 1) : 1
  }

  onMounted(() => {
    if (!import.meta.client) return
    const update = useThrottleFn(resolve, 100)
    nextTick(resolve)
    useEventListener(window, 'scroll', update, { passive: true })
    useEventListener(window, 'resize', update, { passive: true })
  })

  return { activeId, progress }
}
