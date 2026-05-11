<template>
  <section
    id="contact"
    class="relative w-full py-28 bg-base-bg overflow-hidden"
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
              <Icon
                name="mdi:phone"
                size="20"
                class="mr-2"
                aria-hidden="true"
              />
              {{ $t("contact.phone") }}:
            </strong>
            <a
              href="tel:+420705206985"
              :aria-label="$t('contact.callLabel')"
            >+420 705 206 985</a>
          </p>
          <p>
            <strong class="text-primary-600 dark:text-primary-400">
              <Icon
                name="mdi:email"
                size="20"
                class="mr-2"
                aria-hidden="true"
              />
              {{ $t("contact.email") }}:
            </strong>
            <a
              href="mailto:benjamin.tomanik@gmail.com"
              :aria-label="$t('contact.emailLabel')"
            >benjamin.tomanik@gmail.com</a>
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
            :aria-label="social.platform"
          >
            <Icon
              :name="social.icon"
              size="36"
              aria-hidden="true"
            />
          </a>
        </div>
      </div>
      <div
        class="absolute hidden lg:block top-0 left-1/2 transform -translate-x-1/2 w-1 h-full"
        aria-hidden="true"
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
          class="px-8 py-4 text-lg font-semibold rounded-xl shadow-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl"
          @click="isOpen = true"
        >
          {{ $t("contact.button") }}
        </button>
        <TransitionRoot
          :show="isOpen"
          as="template"
        >
          <ContactForm
            @close="isOpen = false"
            @result="handleResult"
          />
        </TransitionRoot>
      </div>
    </div>
    <div
      class="fixed bottom-6 right-6 z-50 flex flex-col gap-4 backdrop-blur-lg"
    >
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="toast-item flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg z-[999]"
        :class="toast.success ? 'bg-green-500/10' : 'bg-red-500/10'"
      >
        <Icon
          :name="toast.success ? 'mdi:check-circle' : 'mdi:alert-circle'"
          size="24"
          :class="toast.success ? 'text-green-400' : 'text-red-400'"
        />
        <span>{{ toast.message }}</span>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { TransitionRoot } from '@headlessui/vue'
import type { gsap } from 'gsap'
import { socialLinks } from '~/consts/socials'

const { $gsap } = useNuxtApp() as unknown as { $gsap: typeof gsap }
type Toast = {
  id: number
  success: boolean
  message: string
}
const isOpen = shallowRef(false)
const toasts = reactive<Toast[]>([])

const addToast = (success: boolean, message?: string) => {
  const toastId = Date.now()
  toasts.push({
    id: toastId,
    success,
    message: message!,
  })

  const toastElement = document.querySelector(
    `.toast-item:nth-child(${toasts.length})`,
  )
  $gsap.from(toastElement, {
    y: 20,
    opacity: 0,
    duration: 0.5,
    ease: 'power2.out',
  })

  setTimeout(() => {
    const toastIndex = toasts.findIndex(t => t.id === toastId)
    const toastElement = document.querySelector(
      `.toast-item:nth-child(${toastIndex + 1})`,
    )
    $gsap.to(toastElement, {
      y: 20,
      opacity: 0,
      duration: 0.5,
      ease: 'power2.in',
      onComplete: () => {
        toasts.splice(toastIndex, 1)
      },
    })
  }, 2700)
}

const handleResult = (data: { success: boolean, message?: string }) => {
  addToast(data.success, data.message)
}
</script>
