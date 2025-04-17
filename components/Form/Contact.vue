<template>
  <Dialog as="div" class="relative z-50" @close="emit('close')">
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
        leave="ease-in"
        leave-from="opacity-100 scale-100"
        leave-to="opacity-0 scale-90"
      >
        <DialogPanel
          class="w-full max-w-lg bg-white dark:bg-fantasy-bg p-10 rounded-3xl shadow-2xl flex flex-col gap-8 border backdrop-blur-sm"
        >
          <DialogTitle class="text-3xl font-bold tracking-tight">
            {{ $t("contact.dialogTitle") }}
          </DialogTitle>
          <div class="flex flex-col gap-6">
            <label class="flex flex-col gap-3">
              <span
                class="text-sm font-medium uppercase tracking-wide opacity-80"
              >
                {{ $t("contact.name") }}
              </span>
              <input
                v-model="form.name"
                type="text"
                :placeholder="$t('contact.namePlaceholder')"
                class="p-4 rounded-2xl text-base focus:outline-none border-b-2 focus:ring-2 focus:border-primary-500/70 transition-all duration-300 shadow-sm hover:shadow-md"
              />
            </label>
            <label class="flex flex-col gap-3">
              <span
                class="text-sm font-medium uppercase tracking-wide opacity-80"
              >
                {{ $t("contact.email") }}
              </span>
              <input
                v-model="form.email"
                type="email"
                :placeholder="$t('contact.emailPlaceholder')"
                class="p-4 rounded-2xl text-base focus:outline-none focus:ring-2 border-b-2 focus:border-primary-500/70 transition-all duration-300 shadow-sm hover:shadow-md"
              />
            </label>
            <label class="flex flex-col gap-3">
              <span
                class="text-sm font-medium uppercase tracking-wide opacity-80"
              >
                {{ $t("contact.message") }}
              </span>
              <textarea
                v-model="form.message"
                rows="5"
                :placeholder="$t('contact.messagePlaceholder')"
                class="p-4 rounded-2xl text-base resize-none border-b-2 focus:outline-none focus:ring-2 focus:border-primary-500/70 transition-all duration-300 shadow-sm hover:shadow-md"
              />
            </label>
          </div>
          <div class="flex gap-4 justify-end">
            <button
              @click="emit('close')"
              class="px-6 py-3 rounded-xl text-base font-medium hover:bg-fantasy-accent/80 hover:text-white transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md"
            >
              {{ $t("contact.cancelButton") }}
            </button>
            <button
              @click="emit('submit')"
              class="px-6 py-3 rounded-xl text-base font-medium transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
            >
              {{ $t("contact.submitButton") }}
            </button>
          </div>
        </DialogPanel>
      </TransitionChild>
    </div>
  </Dialog>
</template>

<script setup>
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
} from "@headlessui/vue";

const emit = defineEmits(["close", "submit"]);

const form = ref({
  name: "",
  email: "",
  message: "",
});
</script>
