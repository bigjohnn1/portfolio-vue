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
        enter-active-class="transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] motion-reduce:duration-200 motion-reduce:ease-out"
        leave-active-class="transition-all duration-300 ease-in motion-reduce:duration-200"
        enter-from-class="opacity-0 scale-90 motion-reduce:scale-100"
        leave-to-class="opacity-0 scale-95 motion-reduce:scale-100"
      >
        <DialogContent
          v-if="isOpen"
          class="fixed inset-0 z-[81] overflow-hidden focus:outline-none"
          :aria-label="t('scene.title')"
        >
          <p class="sr-only">
            {{ t('scene.description') }}
          </p>

          <LazyCanvasAboutScene aria-hidden="true" />

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

const { t } = useI18n()
const { isOpen, close } = useScene()
</script>
