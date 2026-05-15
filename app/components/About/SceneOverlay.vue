<template>
  <DialogRoot v-model:open="isOpen">
    <DialogPortal>
      <Transition
        enter-active-class="transition-opacity duration-300 ease-out motion-reduce:duration-200"
        leave-active-class="transition-opacity duration-300 ease-in motion-reduce:duration-200"
        enter-from-class="opacity-0"
        leave-to-class="opacity-0"
      >
        <DialogOverlay
          v-if="isOpen"
          class="fixed inset-0 z-[80] bg-black/85 backdrop-blur-sm"
        />
      </Transition>
      <Transition
        :css="false"
        @enter="onEnter"
        @leave="onLeave"
      >
        <DialogContent
          v-if="isOpen"
          class="fixed inset-0 z-[81] overflow-hidden focus:outline-none"
          :aria-label="t('scene.title')"
        >
          <p class="sr-only">
            {{ t('scene.description') }}
          </p>

          <div
            ref="stageEl"
            class="absolute inset-0 origin-center will-change-transform"
          >
            <LazyCanvasAboutScene aria-hidden="true" />
          </div>

          <div
            ref="scanlineEl"
            class="pointer-events-none absolute left-0 right-0 top-1/2 z-[82] h-[2px] -translate-y-1/2 bg-white opacity-0 shadow-[0_0_24px_8px_rgba(255,255,255,0.85)] mix-blend-screen"
            aria-hidden="true"
          />
          <div
            ref="flashEl"
            class="pointer-events-none absolute inset-0 z-[82] bg-white opacity-0"
            aria-hidden="true"
          />

          <button
            type="button"
            class="absolute top-4 right-4 sm:top-6 sm:right-6 z-10 w-11 h-11 grid place-items-center rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:outline-none"
            :aria-label="t('scene.close')"
            @click="close"
          >
            <Icon
              name="mdi:close"
              size="22"
              aria-hidden="true"
            />
          </button>

          <div class="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white/80 text-xs backdrop-blur pointer-events-none">
            <kbd class="font-mono opacity-90">ESC</kbd>
            <span class="opacity-80">{{ t('scene.escHint') }}</span>
          </div>
        </DialogContent>
      </Transition>
    </DialogPortal>
  </DialogRoot>
</template>

<script setup lang="ts">
import {
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
} from 'reka-ui'
import { usePreferredReducedMotion } from '@vueuse/core'

const { t } = useI18n()
const { isOpen, close } = useScene()
const { $gsap } = useNuxtApp()
const reducedMotion = usePreferredReducedMotion()

const stageEl = useTemplateRef<HTMLElement>('stageEl')
const scanlineEl = useTemplateRef<HTMLElement>('scanlineEl')
const flashEl = useTemplateRef<HTMLElement>('flashEl')

const onEnter = (_el: Element, done: () => void) => {
  if (!stageEl.value || !scanlineEl.value || !flashEl.value) {
    done()
    return
  }

  if (reducedMotion.value === 'reduce') {
    $gsap.set([stageEl.value, scanlineEl.value, flashEl.value], { clearProps: 'all' })
    $gsap.set(stageEl.value, { autoAlpha: 1 })
    done()
    return
  }

  const tl = $gsap.timeline({ onComplete: done })

  $gsap.set(stageEl.value, {
    scaleY: 0.004,
    scaleX: 0.6,
    autoAlpha: 1,
    filter: 'brightness(2.4) blur(0px)',
  })
  $gsap.set(scanlineEl.value, { opacity: 0, scaleX: 0 })
  $gsap.set(flashEl.value, { opacity: 0 })

  tl.to(scanlineEl.value, { opacity: 1, scaleX: 1, duration: 0.22, ease: 'power3.out' }, 0)
    .to(stageEl.value, { scaleX: 1, duration: 0.28, ease: 'power3.out' }, 0.05)
    .to(stageEl.value, { scaleY: 1, duration: 0.55, ease: 'expo.out' }, 0.18)
    .to(scanlineEl.value, { opacity: 0, duration: 0.35, ease: 'power2.out' }, 0.35)
    .to(flashEl.value, { opacity: 0.45, duration: 0.08, ease: 'power2.in' }, 0.22)
    .to(flashEl.value, { opacity: 0, duration: 0.4, ease: 'power2.out' }, 0.32)
    .to(stageEl.value, { filter: 'brightness(1) blur(0px)', duration: 0.5, ease: 'power2.out' }, 0.25)
}

const onLeave = (_el: Element, done: () => void) => {
  if (!stageEl.value || !scanlineEl.value || !flashEl.value) {
    done()
    return
  }

  if (reducedMotion.value === 'reduce') {
    $gsap.to(stageEl.value, { autoAlpha: 0, duration: 0.2, onComplete: done })
    return
  }

  const tl = $gsap.timeline({ onComplete: done })

  tl.to(stageEl.value, { scaleY: 0.004, duration: 0.32, ease: 'power3.in' }, 0)
    .to(scanlineEl.value, { opacity: 1, scaleX: 1, duration: 0.2, ease: 'power2.out' }, 0.05)
    .to(stageEl.value, { scaleX: 0, duration: 0.32, ease: 'power3.in' }, 0.32)
    .to(scanlineEl.value, { scaleX: 0, duration: 0.28, ease: 'power3.in' }, 0.36)
    .to([stageEl.value, scanlineEl.value], { autoAlpha: 0, duration: 0.18, ease: 'power1.in' }, 0.6)
}
</script>
