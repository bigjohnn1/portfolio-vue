<template>
  <section
    id="contact"
    class="relative w-full min-h-fit py-16 bg-base-bg overflow-hidden"
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
        <div class="flex flex-col items-center gap-4">
          <Icon
            name="mdi:email-outline"
            size="48"
            class="text-primary-600 dark:text-primary-400"
          />
          <h3 class="text-2xl font-semibold">
            {{ $t("contact.formHeading") }}
          </h3>
        </div>
        <button
          @click="isOpen = true"
          class="px-8 py-4 text-lg font-semibold rounded-xl shadow-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl"
        >
          {{ $t("contact.button") }}
        </button>
        <TransitionRoot :show="isOpen" as="template">
          <ContactForm @close="isOpen = false" @success="handleSuccess" />
        </TransitionRoot>
      </div>
    </div>
    <div
      class="fixed bottom-6 right-6 z-50 flex flex-col gap-4 backdrop-blur-lg"
    >
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="toast-item flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg"
      >
        <Icon name="mdi:check-circle" size="24" class="text-green-400" />
        <span>{{ toast.message }}</span>
      </div>
    </div>
  </section>
</template>

<script setup>
import { socialLinks } from "~/consts/socials";
import { TransitionRoot } from "@headlessui/vue";
const { $i18n, $gsap } = useNuxtApp();

const isOpen = shallowRef(false);
const toasts = reactive([]);

const addToast = () => {
  const toastId = Date.now();
  toasts.push({
    id: toastId,
    message: $i18n.t("contact.toastSuccess"),
  });

  const toastElement = document.querySelector(
    `.toast-item:nth-child(${toasts.length})`
  );
  $gsap.from(toastElement, {
    y: 20,
    opacity: 0,
    duration: 0.5,
    ease: "power2.out",
  });

  setTimeout(() => {
    const toastIndex = toasts.findIndex((t) => t.id === toastId);
    const toastElement = document.querySelector(
      `.toast-item:nth-child(${toastIndex + 1})`
    );
    $gsap.to(toastElement, {
      y: 20,
      opacity: 0,
      duration: 0.5,
      ease: "power2.in",
      onComplete: () => {
        toasts.splice(toastIndex, 1);
      },
    });
  }, 2700);
};

const handleSuccess = () => {
  addToast();
  isOpen.value = false;
};
</script>
