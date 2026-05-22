<template>
  <section
    id="contact"
    class="relative w-full py-28 bg-base-bg overflow-hidden"
  >
    <AppLocalClock class="contact-clock" />
    <div
      class="max-w-6xl mx-auto px-4 flex flex-col lg:flex-row gap-12 relative min-h-[inherit]"
    >
      <div class="lg:w-1/2 flex flex-col gap-8">
        <header>
          <h2 class="text-5xl font-bold text-primary-700 dark:text-primary-300 tracking-tight">
            {{ $t('contact.heading') }}
          </h2>
          <p class="text-xl text-fantasy-text leading-relaxed mt-3">
            {{ $t('contact.description') }}
          </p>
        </header>

        <div class="flex flex-col gap-5 text-lg">
          <p>
            <strong class="text-primary-600 dark:text-primary-400">
              <Icon
                name="mdi:phone"
                size="20"
                class="mr-2"
                aria-hidden="true"
              />
              {{ $t('contact.phone') }}:
            </strong>
            <a
              href="tel:+420705206985"
              :aria-label="$t('contact.callLabel')"
            >+420 705 206 985</a>
          </p>
          <p class="flex flex-wrap items-center gap-2">
            <strong class="text-primary-600 dark:text-primary-400 flex items-center">
              <Icon
                name="mdi:email"
                size="20"
                class="mr-2"
                aria-hidden="true"
              />
              {{ $t('contact.email') }}:
            </strong>
            <a
              :href="`mailto:${email}`"
              :aria-label="$t('contact.emailLabel')"
            >{{ email }}</a>
            <button
              type="button"
              class="copy-btn"
              :aria-label="$t('contact.copyEmail')"
              @click="copyEmail"
            >
              <Icon
                :name="copied ? 'mdi:check' : 'mdi:content-copy'"
                size="16"
                aria-hidden="true"
              />
            </button>
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
          <h3 class="text-2xl font-semibold text-center">
            {{ $t('contact.formHeading') }}
          </h3>
        </div>
        <button
          class="px-8 py-4 text-lg font-semibold rounded-xl shadow-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl"
          @click="isOpen = true"
        >
          {{ $t('contact.button') }}
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
  </section>
</template>

<script setup lang="ts">
import { TransitionRoot } from '@headlessui/vue'
import { useClipboard } from '@vueuse/core'
import { toast } from 'vue-sonner'

const { t } = useI18n()

const email = 'benjamin.tomanik@gmail.com'
const isOpen = shallowRef(false)

const { copy, copied, isSupported } = useClipboard({ source: email, copiedDuring: 1800 })

const copyEmail = async () => {
  if (!isSupported.value) {
    toast.error(t('contact.copyUnsupported'))
    return
  }
  await copy(email)
  toast.success(t('contact.emailCopied'))
}

const handleResult = (data: { success: boolean, message?: string }) => {
  const message = data.message ?? ''
  if (data.success) toast.success(message)
  else toast.error(message)
}
</script>

<style scoped>
.contact-clock {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  z-index: 2;
}

@media (min-width: 768px) {
  .contact-clock {
    top: 2rem;
    right: 2rem;
  }
}

.copy-btn {
  display: inline-grid;
  place-items: center;
  width: 30px;
  height: 30px;
  border-radius: 9999px;
  border: 0;
  background: var(--color-primary-50);
  color: var(--color-primary-700);
  cursor: pointer;
  transition: background 0.2s ease, transform 0.2s ease;
}

:global(.dark) .copy-btn {
  background: var(--color-primary-900);
  color: var(--color-primary-200);
}

.copy-btn:hover,
.copy-btn:focus-visible {
  transform: translateY(-1px) scale(1.05);
  background: var(--color-primary-100);
  outline: none;
}

:global(.dark) .copy-btn:hover,
:global(.dark) .copy-btn:focus-visible {
  background: var(--color-primary-800);
}

.copy-btn:active {
  transform: scale(0.95);
}
</style>
