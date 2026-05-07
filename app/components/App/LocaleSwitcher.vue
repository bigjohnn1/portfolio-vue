<template>
  <ClientOnly>
    <div class="lang-switcher relative">
      <button
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
          class="h-4 w-4 text-gray-700 dark:text-gray-300"
          aria-hidden="true"
        />
      </button>
      <ul
        v-if="isOpen"
        ref="dropdown"
        role="listbox"
        class="absolute w-32 mt-1 rounded-lg bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 shadow-lg z-[9999]"
      >
        <li
          v-for="item in availableLocales"
          :key="item.code"
          role="option"
          :aria-selected="currentLocale.code === item.code"
          class="px-3 py-2 flex items-center hover:bg-gray-300 dark:hover:bg-gray-600 cursor-pointer transition-colors duration-200"
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
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
const { locale, locales, setLocale } = useI18n()
const { $gsap } = useNuxtApp()

interface LocaleObject {
  code: string
  name?: string
  icon?: string
}

const availableLocales = computed(() => locales.value as LocaleObject[])
const isOpen = shallowRef(false)
const dropdown = useTemplateRef<HTMLElement>('dropdown')

const currentLocale = computed(() => {
  const found = availableLocales.value.find(
    l => l.code === locale.value,
  )
  return found || availableLocales.value[0]
})

const toggleDropdown = async () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    await nextTick()
    animateDropdownOpen()
  }
}

const switchLocale = (localeCode: string) => {
  setLocale(localeCode)
  isOpen.value = false
}

const animateDropdownOpen = () => {
  if (dropdown.value) {
    $gsap.fromTo(
      dropdown.value,
      { opacity: 0, y: -10, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.3, ease: 'power2.out' },
    )
  }
}

onMounted(() => {
  const button = document.querySelector('.lang-switcher button')
  if (button) {
    $gsap.from(button, {
      y: -10,
      opacity: 0,
      duration: 0.4,
      ease: 'power2.out',
    })
  }
})
</script>
