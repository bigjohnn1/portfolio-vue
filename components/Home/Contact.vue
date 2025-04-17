<template>
  <section
    id="contact"
    class="relative w-full min-h-fit py-16 bg-light-bg dark:bg-dark-bg overflow-hidden"
  >
    <div
      class="max-w-6xl mx-auto px-4 flex flex-col lg:flex-row gap-12 relative"
    >
      <div class="lg:w-1/2 flex flex-col gap-8">
        <h2
          class="text-5xl font-bold text-primary-700 dark:text-primary-300 tracking-tight"
        >
          {{ $t("contact.heading") }}
        </h2>
        <p class="text-xl text-fantasy-text leading-relaxed">
          {{ $t("contact.description") }}
        </p>
        <div class="flex flex-col gap-5 text-lg">
          <p>
            <strong class="text-primary-600 dark:text-primary-400">
              <Icon name="mdi:map-marker" size="20" class="mr-2" />
              {{ $t("contact.address") }}:
            </strong>
            Mordor
          </p>
          <p>
            <strong class="text-primary-600 dark:text-primary-400">
              <Icon name="mdi:phone" size="20" class="mr-2" />
              {{ $t("contact.phone") }}:
            </strong>
            <a href="tel:+420123456789" aria-label="Zavolat na +420 123 456 789"
              >+420 123 456 789</a
            >
          </p>
          <p>
            <strong class="text-primary-600 dark:text-primary-400">
              <Icon name="mdi:email" size="20" class="mr-2" />
              {{ $t("contact.email") }}:
            </strong>
            <a href="mailto:bb@email.com" aria-label="Napsat na bb@email.com"
              >bb@email.com</a
            >
          </p>
          <p>
            <strong class="text-primary-600 dark:text-primary-400">
              <Icon name="mdi:clock-outline" size="20" class="mr-2" />
              {{ $t("contact.hours") }}:
            </strong>
            {{ $t("contact.timespan") }}
          </p>
        </div>
        <div class="flex gap-6">
          <a
            v-for="social in socialLinks"
            :key="social.platform"
            :href="social.url"
            target="_blank"
            rel="noopener noreferrer"
            class="text-fantasy-text hover:text-fantasy-accent transition-colors duration-300 transform hover:scale-[1.02]"
          >
            <Icon :name="social.icon" size="36" />
          </a>
        </div>
      </div>
      <div
        class="absolute hidden lg:block top-0 left-1/2 transform -translate-x-1/2 w-8 h-full"
      >
        <svg
          class="w-full h-full fill-current text-primary-200 dark:text-primary-800"
          viewBox="0 0 100 1440"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0 C20,120 80,120 100,240 C80,360 20,360 0,480 C20,600 80,600 100,720 C80,840 20,840 0,960 C20,1080 80,1080 100,1200 C80,1320 20,1320 0,1440 L0,1440 L100,1440 L100,0 Z"
          />
        </svg>
      </div>
      <div class="lg:w-1/2 flex flex-col items-center justify-center gap-6">
        <button
          @click="isOpen = true"
          class="px-8 py-4 bg-primary-600 dark:bg-primary-500 text-lg font-semibold rounded-xl shadow-lg hover:bg-primary-700 dark:hover:bg-primary-400 transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
        >
          {{ $t("contact.button") }}
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
                        class="p-4 rounded-2xl text-base focus-outline-none border-b-2 focus:ring-2 focus:border-primary-500/70 transition-all duration-300 shadow-sm hover:shadow-md"
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
                      @click="isOpen = false"
                      class="px-6 py-3 rounded-xl text-base font-medium hover:bg-fantasy-accent/80 hover:text-white transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md"
                    >
                      {{ $t("contact.cancelButton") }}
                    </button>
                    <button
                      @click="submitForm"
                      class="px-6 py-3 rounded-xl text-base font-medium transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
                    >
                      {{ $t("contact.submitButton") }}
                    </button>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </Dialog>
        </TransitionRoot>
      </div>
    </div>
    <div
      class="fixed bottom-6 right-6 z-50 flex flex-col gap-4 backdrop-blur-lg"
    >
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
const { $i18n } = useNuxtApp();

const isOpen = ref(false);
const form = ref({ name: "", email: "", message: "" });

interface Toast {
  id: number;
  message: string;
  isExiting: boolean;
}

let toasts = reactive<Toast[]>([]);

const submitForm = () => {
  const toastId = Date.now();
  toasts.push({
    id: toastId,
    message: $i18n.t("contact.toastSuccess"),
    isExiting: false,
  });
  isOpen.value = false;
  form.value = { name: "", email: "", message: "" };

  setTimeout(() => {
    const toast = toasts.find((t) => t.id === toastId);
    toast!.isExiting = true;
  }, 2700);
};

const socialLinks = [
  {
    platform: "Instagram",
    url: "https://instagram.com",
    icon: "mdi:instagram",
  },
  { platform: "LinkedIn", url: "https://linkedin.com", icon: "mdi:linkedin" },
  {
    platform: "GitHub",
    url: "https://github.com/bigjohnn1",
    icon: "mdi:github",
  },
];
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
```
