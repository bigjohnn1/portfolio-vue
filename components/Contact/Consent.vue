<template>
  <Dialog
    as="div"
    class="relative z-50"
    @close="$emit('close')"
  >
    <TransitionChild
      as="template"
      enter="ease-out duration-300"
      enter-from="opacity-0"
      enter-to="opacity-100"
      leave="ease-in"
      leave-from="opacity-100"
      leave-to="opacity-0"
    >
      <div
        class="fixed inset-0 bg-black/70 backdrop-blur-md transition-opacity"
      />
    </TransitionChild>
    <div class="fixed inset-0 flex items-center justify-center p-6">
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0 scale-90"
        enter-to="opacity-100 scale-100"
        leave="ease-in duration-100"
        leave-from="opacity-100 scale-100"
        leave-to="opacity-0 scale-90"
      >
        <DialogPanel
          class="w-full max-w-lg bg-white dark:bg-fantasy-bg p-10 rounded-3xl shadow-2xl flex flex-col gap-8 border backdrop-blur-sm"
        >
          <DialogTitle class="text-3xl font-bold tracking-tight">
            {{ $t("consent.title") }}
          </DialogTitle>
          <div class="flex flex-col gap-4 text-lg text-fantasy-text">
            <p>{{ $t("consent.description1") }}</p>
            <p>{{ $t("consent.description2") }}</p>
          </div>
          <div class="flex justify-end">
            <button
              :aria-label="$t('consent.closeButton')"
              class="px-6 py-3 rounded-xl text-base font-medium hover:bg-fantasy-accent/80 hover:text-white transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md"
              @click="$emit('close')"
            >
              {{ $t("consent.closeButton") }}
            </button>
          </div>
        </DialogPanel>
      </TransitionChild>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
} from '@headlessui/vue'

defineEmits<{
  (e: 'close'): void
}>()
</script>
