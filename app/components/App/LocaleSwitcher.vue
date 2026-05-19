<template>
  <div class="lang-switcher relative">
    <button
      ref="switcherBtn"
      :aria-expanded="isOpen"
      aria-haspopup="listbox"
      :aria-label="$t('nav.switchLanguage')"
      class="w-32 py-2 pl-3 pr-8 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600 hover:bg-gray-300 dark:hover:bg-gray-600 flex items-center justify-between transition-all duration-300"
      @click="toggleDropdown"
    >
      <span class="flex items-center">
        <Icon
          :name="currentLocale.icon!"
          class="h-5 w-5 mr-2"
          aria-hidden="true"
        />
        {{ currentLocale.name }}
      </span>
      <Icon
        :name="isOpen ? 'mingcute:up-fill' : 'mingcute:down-fill'"
        class="h-4 w-4 text-gray-700 dark:text-gray-300 transition-transform duration-200"
        aria-hidden="true"
      />
    </button>
    <Transition
      enter-active-class="transition-[opacity,transform] duration-[220ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] motion-reduce:transition-opacity motion-reduce:duration-[120ms]"
      enter-from-class="opacity-0 -translate-y-2 scale-95 motion-reduce:translate-y-0 motion-reduce:scale-100"
      leave-active-class="transition-[opacity,transform] duration-[160ms] ease-out motion-reduce:transition-opacity motion-reduce:duration-[100ms]"
      leave-to-class="opacity-0 -translate-y-2 scale-95 motion-reduce:translate-y-0 motion-reduce:scale-100"
    >
      <ul
        v-if="isOpen"
        ref="dropdown"
        role="listbox"
        :aria-label="$t('nav.switchLanguage')"
        class="absolute w-32 mt-1 rounded-lg bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 shadow-lg z-[9999] origin-top"
      >
        <li
          v-for="item in availableLocales"
          :key="item.code"
          role="option"
          :aria-selected="currentLocale.code === item.code"
          class="px-3 py-2 flex items-center hover:bg-gray-300 dark:hover:bg-gray-600 cursor-pointer transition-colors duration-200 first:rounded-t-lg last:rounded-b-lg"
          @click="switchLocale(item.code)"
        >
          <Icon
            :name="item.icon!"
            class="h-5 w-5 mr-2"
            aria-hidden="true"
          />
          {{ item.name }}
        </li>
      </ul>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { onClickOutside, useMagicKeys } from '@vueuse/core'

interface LocaleObject {
  code: string
  name?: string
  icon?: string
}

const { locale, locales, setLocale } = useI18n()

const availableLocales = computed(() => locales.value as LocaleObject[])
const isOpen = shallowRef(false)
const dropdown = useTemplateRef<HTMLElement>('dropdown')
const switcherBtn = useTemplateRef<HTMLElement>('switcherBtn')

const currentLocale = computed(
  () => availableLocales.value.find(l => l.code === locale.value) ?? availableLocales.value[0]!,
)

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const switchLocale = (code: string) => {
  setLocale(code as 'en' | 'cs')
  isOpen.value = false
}

onClickOutside(dropdown, () => {
  isOpen.value = false
}, { ignore: [switcherBtn] })

if (import.meta.client) {
  const keys = useMagicKeys()
  const escape = computed(() => !!keys.escape?.value)
  watch(escape, (v) => {
    if (v && isOpen.value) isOpen.value = false
  })
}
</script>
