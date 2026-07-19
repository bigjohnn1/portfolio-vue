<template>
  <div
    ref="rootEl"
    class="relative"
  >
    <slot
      name="trigger"
      :toggle="toggleDropdown"
      :is-open="isOpen"
      :current-locale="currentLocale"
    >
      <button
        v-bind="$attrs"
        :aria-expanded="isOpen"
        aria-haspopup="listbox"
        :aria-label="$t('nav.switchLanguage')"
        class="flex w-36 items-center gap-2.5 rounded-full border border-gray-300 bg-gray-200 py-2 pl-4 pr-3.5 text-gray-800 transition-colors duration-300 hover:bg-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
        @click="toggleDropdown"
      >
        <Icon
          :name="currentLocale.icon!"
          class="h-5 w-5 shrink-0"
          aria-hidden="true"
        />
        <span class="flex-1 truncate text-left">{{ currentLocale.name }}</span>
        <Icon
          name="mingcute:down-fill"
          class="h-4 w-4 shrink-0 text-gray-500 transition-transform duration-300 dark:text-gray-400"
          :class="{ 'rotate-180': isOpen }"
          aria-hidden="true"
        />
      </button>
    </slot>

    <Transition
      :enter-active-class="transition.enterActive"
      :enter-from-class="transition.enterFrom"
      :leave-active-class="transition.leaveActive"
      :leave-to-class="transition.leaveTo"
    >
      <ul
        v-if="isOpen"
        role="listbox"
        :aria-label="$t('nav.switchLanguage')"
        :class="panelClass"
      >
        <li
          v-for="item in availableLocales"
          :key="item.code"
          role="option"
          :aria-selected="currentLocale.code === item.code"
          :class="[itemClass, currentLocale.code === item.code ? activeItemClass : '']"
          @click="switchLocale(item.code)"
        >
          <Icon
            :name="item.icon!"
            :class="iconClass"
            aria-hidden="true"
          />
          <span>{{ item.name }}</span>
          <Icon
            v-if="currentLocale.code === item.code"
            name="mingcute:check-fill"
            class="ml-auto h-4 w-4 shrink-0"
            aria-hidden="true"
          />
        </li>
      </ul>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { onClickOutside, useMagicKeys } from '@vueuse/core'
import type { LocaleCode, LocaleOption } from '~/types/i18n'

interface TransitionClasses {
  enterActive?: string
  enterFrom?: string
  leaveActive?: string
  leaveTo?: string
}

const {
  panelClass = 'absolute w-36 mt-1 rounded-lg bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 shadow-lg z-[9999] origin-top',
  itemClass = 'px-3 py-2 flex items-center gap-2 hover:bg-gray-300 dark:hover:bg-gray-600 cursor-pointer transition-colors duration-200 first:rounded-t-lg last:rounded-b-lg',
  activeItemClass = 'font-semibold',
  iconClass = 'h-5 w-5 shrink-0',
  transition = {
    enterActive: 'transition-[opacity,transform] duration-[220ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] motion-reduce:transition-opacity motion-reduce:duration-[120ms]',
    enterFrom: 'opacity-0 -translate-y-2 scale-95 motion-reduce:translate-y-0 motion-reduce:scale-100',
    leaveActive: 'transition-[opacity,transform] duration-[160ms] ease-out motion-reduce:transition-opacity motion-reduce:duration-[100ms]',
    leaveTo: 'opacity-0 -translate-y-2 scale-95 motion-reduce:translate-y-0 motion-reduce:scale-100',
  },
} = defineProps<{
  panelClass?: string | string[]
  itemClass?: string | string[]
  activeItemClass?: string | string[]
  iconClass?: string | string[]
  transition?: TransitionClasses
}>()

defineOptions({ inheritAttrs: false })

const { locale, locales, setLocale } = useI18n()

const availableLocales = computed(() => locales.value as LocaleOption[])
const currentLocale = computed(
  () => availableLocales.value.find(l => l.code === locale.value) ?? availableLocales.value[0]!,
)

const isOpen = shallowRef(false)
const rootEl = useTemplateRef<HTMLElement>('rootEl')

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const switchLocale = (code: LocaleCode) => {
  setLocale(code)
  isOpen.value = false
}

const close = () => {
  isOpen.value = false
}

onClickOutside(rootEl, close)

if (import.meta.client) {
  const keys = useMagicKeys()
  const escape = computed(() => !!keys.escape?.value)
  watch(escape, (v) => {
    if (v && isOpen.value) close()
  })
}

defineExpose({ close })
</script>
