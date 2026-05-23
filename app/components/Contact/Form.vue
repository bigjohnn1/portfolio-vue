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
            :placeholder="$t('contact.namePlaceholder')"
            :aria-label="$t('contact.name')"
            :aria-invalid="!!errors.name"
            :aria-describedby="errors.name ? 'contact-name-error' : undefined"
            :class="[baseInput, errors.name && errorInputBorder]"
            @blur="onBlur('name')"
            @input="onInput('name')"
          />
          <Transition v-bind="errorTransition">
            <p
              v-if="errors.name"
              id="contact-name-error"
              role="alert"
              :class="errorText"
            >
              <Icon
                name="lucide:alert-triangle"
                :class="errorIcon"
                aria-hidden="true"
              />
              <span>{{ $t(`contact.errors.${errors.name}`) }}</span>
            </p>
          </Transition>
        </label>

        <label class="flex flex-col gap-2">
          <span class="text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-500 dark:text-gray-400">
            {{ $t('contact.email') }}
          </span>
          <input
            v-model="form.email"
            type="email"
            :placeholder="$t('contact.emailPlaceholder')"
            :aria-label="$t('contact.email')"
            :aria-invalid="!!errors.email"
            :aria-describedby="errors.email ? 'contact-email-error' : undefined"
            :class="[baseInput, errors.email && errorInputBorder]"
            @blur="onBlur('email')"
            @input="onInput('email')"
          />
          <Transition v-bind="errorTransition">
            <p
              v-if="errors.email"
              id="contact-email-error"
              role="alert"
              :class="errorText"
            >
              <Icon
                name="lucide:alert-triangle"
                :class="errorIcon"
                aria-hidden="true"
              />
              <span>{{ $t(`contact.errors.${errors.email}`) }}</span>
            </p>
          </Transition>
        </label>
      </div>

      <label class="flex flex-col gap-2">
        <span class="text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-500 dark:text-gray-400">
          {{ $t('contact.reason') }}
        </span>
        <select
          v-model="form.reason"
          :aria-label="$t('contact.reason')"
          :class="baseInput"
        >
          <option
            disabled
            value=""
          >
            {{ $t('contact.reasonPlaceholder') }}
          </option>
          <option
            v-for="r in reasons"
            :key="r"
            :value="r"
          >
            {{ $t(`contact.reasons.${r}`) }}
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
          :placeholder="$t('contact.messagePlaceholder')"
          :aria-label="$t('contact.message')"
          :aria-invalid="!!errors.message"
          :aria-describedby="errors.message ? 'contact-message-error' : undefined"
          :class="[baseInput, 'resize-none', errors.message && errorInputBorder]"
          @blur="onBlur('message')"
          @input="onInput('message')"
        />
        <Transition v-bind="errorTransition">
          <p
            v-if="errors.message"
            id="contact-message-error"
            role="alert"
            :class="errorText"
          >
            <Icon
              name="lucide:alert-triangle"
              :class="errorIcon"
              aria-hidden="true"
            />
            <span>{{ $t(`contact.errors.${errors.message}`) }}</span>
          </p>
        </Transition>
      </label>

      <div class="flex flex-col gap-1.5">
        <label class="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400">
          <input
            v-model="form.consent"
            type="checkbox"
            :aria-label="$t('contact.consentLabel')"
            :aria-invalid="!!errors.consent"
            :aria-describedby="errors.consent ? 'contact-consent-error' : undefined"
            class="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600"
            @change="onBlur('consent')"
          />
          <span class="leading-relaxed">
            {{ $t('contact.consentLabel') }}
            <button
              type="button"
              :aria-label="$t('contact.privacyLink')"
              class="font-medium text-primary-600 underline-offset-2 hover:underline dark:text-primary-400"
              @click="toggleConsent(true)"
            >
              {{ $t('contact.privacyLink') }}
            </button>
          </span>
        </label>
        <Transition v-bind="errorTransition">
          <p
            v-if="errors.consent"
            id="contact-consent-error"
            role="alert"
            :class="[errorText, 'pl-7']"
          >
            <Icon
              name="lucide:alert-triangle"
              :class="errorIcon"
              aria-hidden="true"
            />
            <span>{{ $t(`contact.errors.${errors.consent}`) }}</span>
          </p>
        </Transition>
      </div>

      <button
        type="submit"
        :aria-label="isLoading ? $t('contact.sending') : $t('contact.submitButton')"
        :disabled="isLoading"
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
      <Consent @close="toggleConsent(false)" />
    </TransitionRoot>
  </div>
</template>

<script setup lang="ts">
import { TransitionRoot } from '@headlessui/vue'
import { useToggle } from '@vueuse/core'
import Consent from './Consent.vue'
import {
  CONTACT_REASONS,
  contactFormSchema,
  type ContactFormField,
  type ContactFormInput,
} from '~~/shared/contact-schema'

const { t } = useI18n()

const emit = defineEmits<{
  (e: 'result', data: { success: boolean, message?: string }): void
}>()

const baseInput = 'w-full rounded-xl border border-black/[0.06] bg-white/80 px-4 py-3 text-base shadow-sm transition-all duration-200 placeholder:text-gray-400 focus:border-primary-400 focus:outline-none focus:ring-4 focus:ring-primary-100 dark:border-white/[0.08] dark:bg-gray-800/40 dark:placeholder:text-gray-500 dark:focus:border-primary-400/60 dark:focus:ring-primary-900/40'
const errorInputBorder = '!border-rose-400 focus:!border-rose-400 focus:!ring-rose-100 dark:!border-rose-500/60 dark:focus:!ring-rose-950/40'
const errorText = 'flex items-start gap-1.5 text-xs leading-snug text-rose-600 dark:text-rose-400'
const errorIcon = 'mt-0.5 h-3.5 w-3.5 shrink-0'

const errorTransition = {
  enterActiveClass: 'transition duration-200 ease-out',
  enterFromClass: 'opacity-0 -translate-y-1',
  enterToClass: 'opacity-100 translate-y-0',
  leaveActiveClass: 'transition duration-150 ease-in',
  leaveFromClass: 'opacity-100 translate-y-0',
  leaveToClass: 'opacity-0 -translate-y-1',
}

const reasons = CONTACT_REASONS

const emptyForm = (): ContactFormInput & { website: string } => ({
  name: '',
  email: '',
  reason: 'inquiry',
  message: '',
  consent: false,
  website: '',
})

const form = shallowReactive<ContactFormInput & { website: string }>(emptyForm())
const errors = shallowReactive<Partial<Record<ContactFormField, string>>>({})
const touched = shallowReactive<Partial<Record<ContactFormField, boolean>>>({})

const isLoading = shallowRef(false)
const [isConsentOpen, toggleConsent] = useToggle(false)

const validateField = (field: ContactFormField) => {
  const result = contactFormSchema.shape[field].safeParse(form[field])
  errors[field] = result.success ? undefined : result.error.issues[0]?.message
}

const onBlur = (field: ContactFormField) => {
  touched[field] = true
  validateField(field)
}

const onInput = (field: ContactFormField) => {
  if (touched[field]) validateField(field)
}

const clearKeys = <K extends string>(target: Partial<Record<K, unknown>>) => {
  for (const key of Object.keys(target) as K[]) target[key] = undefined
}

const resetForm = () => {
  Object.assign(form, emptyForm())
  clearKeys(errors)
  clearKeys(touched)
}

const submit = async () => {
  const parsed = contactFormSchema.safeParse(form)
  if (!parsed.success) {
    clearKeys(errors)
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as ContactFormField
      if (!errors[field]) errors[field] = issue.message
      touched[field] = true
    }
    emit('result', { success: false, message: t('contact.errors.formInvalid') })
    return
  }

  isLoading.value = true
  try {
    const res = await $fetch<{
      status: number
      success?: boolean
      error?: string
    }>('/api/contact', {
      method: 'POST',
      body: { ...form },
    })
    if (res.error) {
      emit('result', {
        success: false,
        message: t(`contact.errors.${res.error}`),
      })
      return
    }
    emit('result', { success: true, message: t('contact.toastSuccess') })
    resetForm()
  }
  catch {
    emit('result', { success: false, message: t('contact.toastError') })
  }
  finally {
    isLoading.value = false
  }
}
</script>
