<template>
  <div>
    <form
      class="relative flex flex-col gap-6 rounded-3xl border border-black/[0.06] bg-white/70 p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_12px_32px_-16px_rgba(15,23,42,0.15)] backdrop-blur-xl dark:border-white/[0.08] dark:bg-gray-900/40 dark:shadow-[0_1px_2px_rgba(0,0,0,0.4),0_12px_32px_-16px_rgba(0,0,0,0.6)] md:p-8"
      novalidate
      @submit.prevent="submit"
    >
      <div
        aria-hidden="true"
        class="pointer-events-none absolute -left-[9999px] top-auto h-px w-px overflow-hidden"
      >
        <label>
          Website
          <input
            v-model="form.website"
            type="text"
            tabindex="-1"
            autocomplete="off"
            name="website"
          />
        </label>
      </div>

      <h3 class="text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-50">
        {{ $t('contact.dialogTitle') }}
      </h3>

      <div class="grid gap-5 sm:grid-cols-2">
        <label class="flex flex-col gap-2">
          <span class="text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-500 dark:text-gray-400">
            {{ $t('contact.name') }}
          </span>
          <input
            v-model="form.name"
            type="text"
            required
            :placeholder="$t('contact.namePlaceholder')"
            :aria-label="$t('contact.name')"
            class="w-full rounded-xl border border-black/[0.06] bg-white/80 px-4 py-3 text-base shadow-sm transition-all duration-200 placeholder:text-gray-400 focus:border-primary-400 focus:outline-none focus:ring-4 focus:ring-primary-100 dark:border-white/[0.08] dark:bg-gray-800/40 dark:placeholder:text-gray-500 dark:focus:border-primary-400/60 dark:focus:ring-primary-900/40"
          />
        </label>

        <label class="flex flex-col gap-2">
          <span class="text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-500 dark:text-gray-400">
            {{ $t('contact.email') }}
          </span>
          <input
            v-model="form.email"
            type="email"
            required
            :placeholder="$t('contact.emailPlaceholder')"
            :aria-label="$t('contact.email')"
            class="w-full rounded-xl border border-black/[0.06] bg-white/80 px-4 py-3 text-base shadow-sm transition-all duration-200 placeholder:text-gray-400 focus:border-primary-400 focus:outline-none focus:ring-4 focus:ring-primary-100 dark:border-white/[0.08] dark:bg-gray-800/40 dark:placeholder:text-gray-500 dark:focus:border-primary-400/60 dark:focus:ring-primary-900/40"
          />
        </label>
      </div>

      <label class="flex flex-col gap-2">
        <span class="text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-500 dark:text-gray-400">
          {{ $t('contact.reason') }}
        </span>
        <select
          v-model="form.reason"
          :aria-label="$t('contact.reason')"
          class="w-full rounded-xl border border-black/[0.06] bg-white/80 px-4 py-3 text-base shadow-sm transition-all duration-200 focus:border-primary-400 focus:outline-none focus:ring-4 focus:ring-primary-100 dark:border-white/[0.08] dark:bg-gray-800/40 dark:focus:border-primary-400/60 dark:focus:ring-primary-900/40"
        >
          <option
            disabled
            value=""
          >
            {{ $t('contact.reasonPlaceholder') }}
          </option>
          <option
            v-for="r in reasons"
            :key="r.value"
            :value="r.value"
          >
            {{ $t(`contact.reasons.${r.value}`) }}
          </option>
        </select>
      </label>

      <label class="flex flex-col gap-2">
        <span class="text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-500 dark:text-gray-400">
          {{ $t('contact.message') }}
        </span>
        <textarea
          v-model="form.message"
          rows="5"
          required
          :placeholder="$t('contact.messagePlaceholder')"
          :aria-label="$t('contact.message')"
          class="w-full resize-none rounded-xl border border-black/[0.06] bg-white/80 px-4 py-3 text-base shadow-sm transition-all duration-200 placeholder:text-gray-400 focus:border-primary-400 focus:outline-none focus:ring-4 focus:ring-primary-100 dark:border-white/[0.08] dark:bg-gray-800/40 dark:placeholder:text-gray-500 dark:focus:border-primary-400/60 dark:focus:ring-primary-900/40"
        />
      </label>

      <label class="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400">
        <input
          v-model="form.consent"
          type="checkbox"
          required
          :aria-label="$t('contact.consentLabel')"
          class="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600"
        />
        <span class="leading-relaxed">
          {{ $t('contact.consentLabel') }}
          <button
            type="button"
            :aria-label="$t('contact.privacyLink')"
            class="font-medium text-primary-600 underline-offset-2 hover:underline dark:text-primary-400"
            @click="isConsentOpen = true"
          >
            {{ $t('contact.privacyLink') }}
          </button>
        </span>
      </label>

      <button
        type="submit"
        :aria-label="isLoading ? $t('contact.sending') : $t('contact.submitButton')"
        :disabled="isLoading || !form.consent"
        class="group/cta relative inline-flex items-center justify-center gap-2 self-start rounded-xl bg-primary-600 px-6 py-3 text-base font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary-700 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 dark:bg-primary-500 dark:hover:bg-primary-400"
      >
        <span>
          {{ isLoading ? $t('contact.sending') : $t('contact.submitButton') }}
        </span>
        <Icon
          :name="isLoading ? 'lucide:loader-2' : 'lucide:arrow-right'"
          :class="[
            'h-4 w-4 transition-transform duration-300',
            isLoading ? 'animate-spin' : 'group-hover/cta:translate-x-1',
          ]"
          aria-hidden="true"
        />
      </button>
    </form>

    <TransitionRoot
      :show="isConsentOpen"
      as="template"
    >
      <Consent @close="isConsentOpen = false" />
    </TransitionRoot>
  </div>
</template>

<script setup lang="ts">
import { TransitionRoot } from '@headlessui/vue'
import Consent from './Consent.vue'

const { t } = useI18n()

const emit = defineEmits<{
  (e: 'result', data: { success: boolean, message?: string }): void
}>()

const form = ref({
  name: '',
  email: '',
  reason: 'inquiry',
  message: '',
  consent: false,
  website: '',
})

const reasons = [
  { value: 'inquiry' },
  { value: 'suggestion' },
  { value: 'request' },
  { value: 'collaboration' },
]

const isLoading = shallowRef(false)
const isConsentOpen = shallowRef(false)

const submit = async () => {
  if (!form.value.consent) return
  isLoading.value = true
  try {
    const res = await $fetch<{
      status: number
      success?: boolean
      error?: string
    }>('/api/contact', {
      method: 'POST',
      body: form.value,
    })
    if (res.error) {
      emit('result', {
        success: false,
        message: t(`contact.${res.error}`),
      })
      return
    }
    emit('result', { success: true, message: t('contact.toastSuccess') })
    form.value = { name: '', email: '', reason: 'inquiry', message: '', consent: false, website: '' }
  }
  catch {
    emit('result', { success: false, message: t('contact.toastError') })
  }
  finally {
    isLoading.value = false
  }
}
</script>
