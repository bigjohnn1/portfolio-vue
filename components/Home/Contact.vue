<template>
  <section
    id="contact"
    class="relative w-full min-h-screen py-16 bg-base-bg text-base-text overflow-hidden"
  >
    <div
      class="max-w-6xl mx-auto px-4 flex flex-col lg:flex-row gap-8 relative"
    >
      <div class="lg:w-1/2 flex flex-col gap-6">
        <h2 class="text-4xl font-bold">Kontakt</h2>
        <p class="text-lg">
          Dotaz, návrhy, spolupráce - není problém! Napište mi rovnou nebo mě
          kontaktujte na sociálních sítích.
        </p>
        <div class="flex flex-col gap-4">
          <p><strong>Jméno:</strong> Bg john</p>
          <p><strong>Adresa:</strong>Mordor</p>
          <p><strong>Telefon:</strong> +420 123 456 789</p>
          <p><strong>Email:</strong> bb@email.com</p>
        </div>
        <div class="flex gap-4">
          <a
            href="https://instagram.com"
            target="_blank"
            class="text-gray-600 dark:text-gray-400 hover:text-light-accent dark:hover:text-dark-accent transition-colors"
          >
            <Icon name="mdi:instagram" size="32" />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            class="text-gray-600 dark:text-gray-400 hover:text-light-accent dark:hover:text-dark-accent transition-colors"
          >
            <Icon name="mdi:linkedin" size="32" />
          </a>
        </div>
      </div>
      <div
        class="absolute hidden lg:block top-0 left-1/2 transform -translate-x-1/2 w-1 h-full"
      >
        <svg
          class="w-full h-full fill-current text-gray-200 dark:text-gray-800"
          viewBox="0 0 100 1440"
          preserveAspectRatio="none"
        >
          <path d="M0,0 C100,480 0,960 100,1440 L100,1440 L0,1440 Z" />
        </svg>
      </div>
      <div class="lg:w-1/2 flex flex-col items-center justify-center gap-4">
        <button
          @click="isOpen = true"
          class="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Napište mi
        </button>
        <TransitionRoot :show="isOpen" as="template">
          <Dialog as="div" class="relative z-50" @close="isOpen = false">
            <TransitionChild
              as="template"
              enter="ease-out duration-300"
              enter-from="opacity-0"
              enter-to="opacity-100"
              leave="ease-in duration-200"
              leave-from="opacity-100"
              leave-to="opacity-0"
            >
              <div
                class="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
              />
            </TransitionChild>
            <div class="fixed inset-0 flex items-center justify-center p-4">
              <TransitionChild
                as="template"
                enter="ease-out duration-300"
                enter-from="opacity-0 scale-95"
                enter-to="opacity-100 scale-100"
                leave="ease-in duration-200"
                leave-from="opacity-100 scale-100"
                leave-to="opacity-0 scale-95"
              >
                <DialogPanel
                  class="w-full max-w-md bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg flex flex-col gap-4"
                >
                  <DialogTitle class="text-xl font-semibold"
                    >Kontaktujte mě</DialogTitle
                  >
                  <div class="flex flex-col gap-3">
                    <label class="flex flex-col gap-1">
                      <span class="text-sm font-medium">Vaše jméno</span>
                      <input
                        v-model="form.name"
                        type="text"
                        placeholder="Vaše jméno"
                        required
                        class="p-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-base-text focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </label>
                    <label class="flex flex-col gap-1">
                      <span class="text-sm font-medium">Váš email</span>
                      <input
                        v-model="form.email"
                        type="email"
                        placeholder="Váš email"
                        required
                        class="p-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-base-text focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </label>
                    <label class="flex flex-col gap-1">
                      <span class="text-sm font-medium">Vaše zpráva</span>
                      <textarea
                        v-model="form.message"
                        placeholder="Vaše zpráva"
                        required
                        rows="4"
                        class="p-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-base-text resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </label>
                  </div>
                  <div class="flex gap-4 justify-end">
                    <button
                      @click="isOpen = false"
                      class="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors"
                    >
                      Zrušit
                    </button>
                    <button
                      @click="submitForm"
                      class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Odeslat
                    </button>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </Dialog>
        </TransitionRoot>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionRoot,
  TransitionChild,
} from "@headlessui/vue";

const isOpen = ref(false);
const form = ref({ name: "", email: "", message: "" });

const submitForm = () => {
  console.log("Formulář odeslán:", form.value);
  isOpen.value = false;
  form.value = { name: "", email: "", message: "" };
};
</script>
