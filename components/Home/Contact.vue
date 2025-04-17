<template>
  <section
    id="contact"
    class="relative w-full min-h-fit py-16 bg-light-bg dark:bg-dark-bg overflow-hidden"
  >
    <div
      class="max-w-6xl mx-auto px-4 flex flex-col lg:flex-row gap-12 relative min-h-[inherit]"
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
        class="absolute hidden lg:block top-0 left-1/2 transform -translate-x-1/2 w-1 h-full"
      >
        <svg
          class="w-full h-full fill-current bg-light-bg dark:bg-dark-bg"
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
          {{ $t("contact.button") }}
        </button>
        <TransitionRoot :show="isOpen" as="template">
          <FormContact @close="isOpen = false" @submit="handleClose()" />
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

<script setup>
import { TransitionRoot } from "@headlessui/vue";
const { $i18n } = useNuxtApp();

const isOpen = shallowRef(false);
const toasts = reactive([]);

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

const addToast = () => {
  const toastId = Date.now();
  toasts.push({
    id: toastId,
    message: $i18n.t("contact.toastSuccess"),
    isExiting: false,
  });

  setTimeout(() => {
    const toast = toasts.find((t) => t.id === toastId);
    toast.isExiting = true;
  }, 2700);
};

const handleClose = () => {
  addToast();
  isOpen.value = false;
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
