<template>
  <section
    id="contact"
    class="relative w-full overflow-hidden bg-base-bg py-28"
  >
    <div
      class="pointer-events-none absolute inset-0 -z-0"
      aria-hidden="true"
    >
      <div class="absolute -right-32 -top-32 h-[520px] w-[520px] rounded-full bg-primary-200/40 blur-3xl dark:bg-primary-900/30" />
      <div class="absolute -bottom-40 -left-40 h-[480px] w-[480px] rounded-full bg-primary-100/40 blur-3xl dark:bg-primary-950/40" />
    </div>

    <div class="relative mx-auto grid max-w-6xl gap-12 px-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-16">
      <div class="flex flex-col gap-8">
        <header>
          <h2 class="text-5xl font-bold tracking-tight text-primary-700 dark:text-primary-300">
            {{ $t('contact.heading') }}
          </h2>
          <p class="mt-3 text-xl leading-relaxed text-gray-600 dark:text-gray-400">
            {{ $t('contact.description') }}
          </p>
        </header>

        <div class="inline-flex items-center gap-3 self-start rounded-full border border-black/[0.06] bg-white/60 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm backdrop-blur-md dark:border-white/[0.08] dark:bg-gray-900/40 dark:text-gray-200">
          <AppLocalClock class="text-[0.8125rem]" />
          <span class="flex items-center gap-1.5">
            <span
              class="relative grid h-2 w-2 place-items-center"
              aria-hidden="true"
            >
              <span class="absolute inset-0 animate-ping rounded-full bg-emerald-400/70" />
              <span class="relative h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            {{ $t('contact.availability') }}
          </span>
        </div>

        <div class="flex flex-col gap-3 text-lg">
          <p class="flex items-center gap-3">
            <span class="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300">
              <Icon
                name="lucide:phone"
                size="18"
                aria-hidden="true"
              />
            </span>
            <a
              href="tel:+420705206985"
              :aria-label="$t('contact.callLabel')"
              class="relative inline-block font-medium text-gray-800 transition-[color,transform] duration-200 hover:translate-x-0.5 hover:text-primary-600 focus-visible:translate-x-0.5 focus-visible:text-primary-600 focus-visible:outline-none after:absolute after:-bottom-0.5 after:left-0 after:right-0 after:h-px after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 hover:after:scale-x-100 focus-visible:after:scale-x-100 dark:text-gray-100 dark:hover:text-primary-300 dark:focus-visible:text-primary-300"
            >+420 705 206 985</a>
          </p>

          <p class="flex flex-wrap items-center gap-3">
            <span class="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300">
              <Icon
                name="lucide:mail"
                size="18"
                aria-hidden="true"
              />
            </span>
            <a
              :href="mailtoHref"
              :aria-label="$t('contact.emailLabel')"
              class="relative inline-block font-medium text-gray-800 transition-[color,transform] duration-200 hover:translate-x-0.5 hover:text-primary-600 focus-visible:translate-x-0.5 focus-visible:text-primary-600 focus-visible:outline-none after:absolute after:-bottom-0.5 after:left-0 after:right-0 after:h-px after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 hover:after:scale-x-100 focus-visible:after:scale-x-100 dark:text-gray-100 dark:hover:text-primary-300 dark:focus-visible:text-primary-300"
            >{{ email }}</a>
            <button
              type="button"
              :aria-label="$t('contact.copyEmail')"
              :aria-pressed="copied"
              :class="[
                'inline-grid h-[30px] w-[30px] place-items-center rounded-full border-0 transition-[background,transform,box-shadow,color] duration-200 hover:-translate-y-px hover:scale-105 hover:shadow-[0_4px_12px_-4px_rgba(15,23,42,0.15)] focus-visible:-translate-y-px focus-visible:scale-105 focus-visible:shadow-[0_4px_12px_-4px_rgba(15,23,42,0.15)] focus-visible:outline-none active:scale-95',
                copied
                  ? 'animate-copy-pop bg-emerald-500/15 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400'
                  : 'bg-primary-50 text-primary-700 hover:bg-primary-100 dark:bg-primary-900 dark:text-primary-200 dark:hover:bg-primary-800',
              ]"
              @click="copyEmail"
            >
              <Transition
                enter-active-class="transition-all duration-200 ease-out"
                leave-active-class="transition-all duration-150 ease-in"
                enter-from-class="scale-50 opacity-0"
                leave-to-class="scale-150 opacity-0"
                mode="out-in"
              >
                <Icon
                  :key="copied ? 'check' : 'copy'"
                  :name="copied ? 'lucide:check' : 'lucide:copy'"
                  size="14"
                  aria-hidden="true"
                />
              </Transition>
            </button>
          </p>
        </div>

        <div class="flex gap-3">
          <a
            v-for="social in socialLinks"
            :key="social.platform"
            :href="social.url"
            target="_blank"
            rel="noopener noreferrer"
            class="grid h-11 w-11 place-items-center rounded-xl border border-black/[0.06] bg-white/60 text-gray-700 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary-200 hover:bg-primary-50 hover:text-primary-700 hover:shadow-md dark:border-white/[0.08] dark:bg-gray-900/40 dark:text-gray-200 dark:hover:border-primary-400/30 dark:hover:bg-primary-900/30 dark:hover:text-primary-200"
            :aria-label="social.platform"
          >
            <Icon
              :name="social.icon"
              size="20"
              aria-hidden="true"
            />
          </a>
        </div>
      </div>

      <ContactForm @result="handleResult" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { useClipboard } from '@vueuse/core'
import { toast } from 'vue-sonner'

const { t } = useI18n()

const email = 'benjamin.tomanik@gmail.com'

const mailtoHref = computed(() =>
  `mailto:${email}?subject=${encodeURIComponent('Project inquiry from your portfolio')}`,
)

const { copy, copied, isSupported } = useClipboard({ source: email, copiedDuring: 1800 })

const copyEmail = async () => {
  if (!isSupported.value) {
    toast.error(t('contact.copyUnsupported'))
    return
  }
  await copy(email)
  if (import.meta.client && 'vibrate' in navigator) {
    navigator.vibrate(10)
  }
  toast.success(t('contact.emailCopied'))
}

const handleResult = (data: { success: boolean, message?: string }) => {
  const message = data.message ?? ''
  if (data.success) toast.success(message)
  else toast.error(message)
}
</script>
