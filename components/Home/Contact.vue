<template>
  <section
    id="contact"
    class="relative w-full min-h-screen py-16 bg-light-bg dark:bg-dark-bg overflow-hidden"
  >
    <div
      class="max-w-6xl mx-auto px-4 flex flex-col lg:flex-row gap-12 relative"
    >
      <div class="lg:w-1/2 flex flex-col gap-8">
        <h2
          class="text-5xl font-bold text-primary-700 dark:text-primary-300 tracking-tight"
        >
          Kontakt
        </h2>
        <p class="text-xl text-fantasy-text leading-relaxed">
          Dotaz, návrhy, spolupráce - není problém! Napište mi rovnou nebo mě
          kontaktujte na sociálních sítích.
        </p>
        <div class="flex flex-col gap-5 text-lg">
          <p>
            <strong class="text-primary-600 dark:text-primary-400"
              >Jméno:</strong
            >
            Bg john
          </p>
          <p>
            <strong class="text-primary-600 dark:text-primary-400"
              >Adresa:</strong
            >
            Mordor
          </p>
          <p>
            <strong class="text-primary-600 dark:text-primary-400"
              >Telefon:</strong
            >
            +420 123 456 789
          </p>
          <p>
            <strong class="text-primary-600 dark:text-primary-400"
              >Email:</strong
            >
            bb@email.com
          </p>
        </div>
        <div class="flex gap-6">
          <a
            href="https://instagram.com"
            target="_blank"
            class="text-fantasy-text hover:text-fantasy-accent transition-colors duration-300 transform hover:scale-[1.02]"
          >
            <Icon name="mdi:instagram" size="36" />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            class="text-fantasy-text hover:text-fantasy-accent transition-colors duration-300 transform hover:scale-[1.02]"
          >
            <Icon name="mdi:linkedin" size="36" />
          </a>
        </div>
      </div>
      <div
        class="absolute hidden lg:block top-0 left-1/2 transform -translate-x-1/2 w-1 h-full"
      >
        <svg
          class="w-full h-full fill-current text-primary-200 dark:text-primary-800"
          viewBox="0 0 100 1440"
          preserveAspectRatio="none"
        >
          <path d="M0,0 C100,480 0,960 100,1440 L100,1440 L0,1440 Z" />
        </svg>
      </div>
      <div class="lg:w-1/2 flex flex-col items-center justify-center gap-6">
        <button
          @click="isOpen = true"
          class="px-8 py-4 bg-primary-600 dark:bg-primary-500 text-lg font-semibold rounded-xl shadow-lg hover:bg-primary-700 dark:hover:bg-primary-400 transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
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
                  class="w-full max-w-lg bg-white dark:bg-fantasy-bg p-8 rounded-2xl shadow-2xl flex flex-col gap-6 border border-primary-200 dark:border-primary-800"
                >
                  <DialogTitle
                    class="text-2xl font-bold text-primary-700 dark:text-primary-300"
                    >Kontaktujte mě</DialogTitle
                  >
                  <div class="flex flex-col gap-5">
                    <label class="flex flex-col gap-2">
                      <span class="text-sm font-semibold">Vaše jméno</span>
                      <input
                        v-model="form.name"
                        type="text"
                        placeholder="Vaše jméno"
                        class="p-4 border border-primary-200 dark:border-primary-800 rounded-xl bg-light-bg dark:bg-dark-bg text-base focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                      />
                    </label>
                    <label class="flex flex-col gap-2">
                      <span class="text-sm font-semibold">Váš email</span>
                      <input
                        v-model="form.email"
                        type="email"
                        placeholder="Váš email"
                        class="p-4 border border-primary-200 dark:border-primary-800 rounded-xl bg-light-bg dark:bg-dark-bg text-base focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                      />
                    </label>
                    <label class="flex flex-col gap-2">
                      <span class="text-sm font-semibold">Vaše zpráva</span>
                      <textarea
                        v-model="form.message"
                        placeholder="Vaše zpráva"
                        rows="5"
                        class="p-4 border border-primary-200 dark:border-primary-800 rounded-xl bg-light-bg dark:bg-dark-bg text-base resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                      />
                    </label>
                  </div>
                  <div class="flex gap-4 justify-end">
                    <button
                      @click="isOpen = false"
                      class="px-6 py-3 bg-fantasy-text/20 dark:bg-fantasy-text/30 rounded-xl text-base hover:bg-fantasy-accent hover:text-white transition-all duration-300"
                    >
                      Zrušit
                    </button>
                    <button
                      @click="submitForm"
                      class="px-6 py-3 bg-primary-600 dark:bg-primary-500 rounded-xl text-base hover:bg-primary-700 dark:hover:bg-primary-400 transition-all duration-300 shadow-md hover:shadow-lg"
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
    <div class="fixed bottom-6 right-6 z-50 flex flex-col gap-4">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg animate-slide-in"
        :class="{ 'animate-slide-out': toast.isExiting }"
      >
        <Icon name="mdi:check-circle" size="24" class="text-green-400" />
        <span>{{ toast.message }}</span>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionRoot,
  TransitionChild,
} from "@headlessui/vue";

const isOpen = ref(false);
const form = ref({ name: "", email: "", message: "" });

interface Toast {
  id: number;
  message: string;
  isExiting: boolean;
}

let toasts = reactive<Toast[]>([]);

const submitForm = () => {
  // console.log("Formulář odeslán:", form.value);
  const toastId = Date.now();
  toasts.push({
    id: toastId,
    message: "Zpráva byla úspěšně odeslána!",
    isExiting: false,
  });
  isOpen.value = false;
  form.value = { name: "", email: "", message: "" };

  setTimeout(() => {
    const toast = toasts.find((t) => t.id === toastId);
    toast!.isExiting = true;
  }, 2700);
};
</script>

<style scoped>
.animate-slide-in {
  animation: slideIn 0.3s ease-out;
}

.animate-slide-out {
  animation: slideOut 0.3s ease-in forwards;
}

@keyframes slideIn {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes slideOut {
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(20px);
    opacity: 0;
  }
}
</style>
