<template>
  <DialogRoot v-model:open="isOpen">
    <DialogPortal>
      <Transition
        enter-active-class="transition-opacity duration-200 ease-out"
        enter-from-class="opacity-0"
        leave-active-class="transition-opacity duration-200 ease-out motion-reduce:duration-150"
        leave-to-class="opacity-0"
      >
        <DialogOverlay
          v-if="isOpen"
          class="fixed inset-0 z-[90] bg-black/55 backdrop-blur-md"
        />
      </Transition>
      <Transition
        enter-active-class="transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] motion-reduce:transition-opacity motion-reduce:duration-150"
        enter-from-class="opacity-0 -translate-y-3 scale-[0.97] motion-reduce:translate-y-0 motion-reduce:scale-100"
        leave-active-class="transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] motion-reduce:transition-opacity motion-reduce:duration-150"
        leave-to-class="opacity-0 -translate-y-3 scale-[0.97] motion-reduce:translate-y-0 motion-reduce:scale-100"
      >
        <DialogContent
          v-if="isOpen"
          class="fixed left-1/2 top-[10vh] z-[91] flex w-[min(640px,calc(100vw-2rem))] max-h-[min(620px,80vh)] -translate-x-1/2 flex-col overflow-hidden rounded-2xl border border-black/[0.08] bg-white text-gray-900 shadow-[0_25px_60px_rgba(0,0,0,0.35)] dark:border-white/[0.08] dark:bg-gray-900 dark:text-gray-50 dark:shadow-[0_25px_60px_rgba(0,0,0,0.7)]"
          :aria-label="t('cmdk.title')"
          @open-auto-focus.prevent="focusInput"
        >
          <ComboboxRoot
            :open="true"
            :model-value="null"
            :ignore-filter="true"
            class="flex min-h-0 flex-1 flex-col"
            @update:model-value="onSelect"
            @keydown.esc.stop="close"
          >
            <div
              ref="inputWrapRef"
              class="flex items-center gap-[0.65rem] border-b border-black/[0.08] px-4 py-[0.85rem] dark:border-white/[0.08]"
            >
              <Icon
                name="mdi:magnify"
                size="20"
                class="shrink-0 opacity-50"
                aria-hidden="true"
              />
              <ComboboxInput
                v-model="query"
                class="min-w-0 flex-1 border-0 bg-transparent font-[inherit] text-base text-inherit outline-none placeholder:opacity-45"
                :placeholder="t('cmdk.placeholder')"
                :display-value="() => query"
                auto-focus
              />
              <kbd :class="[kbdBase, 'ml-auto']">ESC</kbd>
            </div>

            <ComboboxContent
              class="!static flex min-h-0 w-full !max-h-none flex-1 flex-col !transform-none"
              force-mount
            >
              <ComboboxViewport class="min-h-0 flex-1 overflow-y-auto p-2 [scrollbar-width:thin]">
                <div
                  v-if="!hasResults"
                  class="px-4 py-9 text-center text-[0.9rem] opacity-50"
                >
                  {{ t('cmdk.empty') }}
                </div>

                <ComboboxGroup
                  v-for="group in filteredGroups"
                  :key="group.id"
                  class="mb-2"
                >
                  <ComboboxLabel class="block px-3 pb-1 pt-[0.45rem] text-[0.7rem] font-semibold uppercase tracking-[0.08em] opacity-50">
                    {{ group.label }}
                  </ComboboxLabel>
                  <ComboboxItem
                    v-for="item in group.items"
                    :key="item.id"
                    :value="item.id"
                    class="flex cursor-pointer select-none items-start gap-3 rounded-lg px-3 py-[0.6rem] text-[0.92rem] transition-colors duration-100 ease-in-out outline-none data-[highlighted]:bg-primary-50 dark:data-[highlighted]:bg-primary-900"
                  >
                    <Icon
                      :name="item.icon"
                      size="18"
                      class="mt-0.5 shrink-0 opacity-75"
                      aria-hidden="true"
                    />
                    <span class="flex min-w-0 flex-1 flex-col gap-[0.15rem]">
                      <span class="break-words">{{ item.label }}</span>
                      <span
                        v-if="item.subtitle"
                        class="break-words text-[0.8rem] leading-snug opacity-55"
                      >
                        {{ item.subtitle }}
                      </span>
                    </span>
                    <span
                      v-if="item.kbds"
                      class="ml-auto inline-flex gap-1"
                    >
                      <kbd
                        v-for="k in item.kbds"
                        :key="k"
                        :class="kbdBase"
                      >{{ k }}</kbd>
                    </span>
                  </ComboboxItem>
                </ComboboxGroup>
              </ComboboxViewport>
            </ComboboxContent>

            <div class="flex flex-wrap items-center gap-4 border-t border-black/[0.08] px-4 py-[0.55rem] text-[0.72rem] opacity-65 dark:border-white/[0.08]">
              <span><kbd :class="kbdBase">↑</kbd><kbd :class="kbdBase">↓</kbd> {{ t('cmdk.navigate') }}</span>
              <span><kbd :class="kbdBase">↵</kbd> {{ t('cmdk.select') }}</span>
              <span><kbd :class="kbdBase">ESC</kbd> {{ t('cmdk.close') }}</span>
            </div>
          </ComboboxRoot>
        </DialogContent>
      </Transition>
    </DialogPortal>
  </DialogRoot>
</template>

<script setup lang="ts">
import { useClipboard } from '@vueuse/core'
import {
  ComboboxContent,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxRoot,
  ComboboxViewport,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
} from 'reka-ui'
import { toast } from 'vue-sonner'
import { socialLinks } from '~/consts/socials'

interface CommandItem {
  id: string
  label: string
  subtitle?: string
  icon: string
  kbds?: string[]
  keywords?: string
  action: () => void | Promise<void>
}

interface CommandGroup {
  id: string
  label: string
  items: CommandItem[]
}

const { t, locale, setLocale } = useI18n()
const colorMode = useColorMode()
const router = useRouter()
const { isOpen, close } = useCommandPalette()

const query = shallowRef('')
const inputWrapRef = useTemplateRef<HTMLElement>('inputWrapRef')

const kbdBase = 'inline-grid place-items-center min-w-6 h-[1.4rem] px-[0.35rem] text-[0.68rem] font-mono font-semibold leading-none rounded-[0.35rem] border border-black/10 bg-black/[0.06] opacity-85 dark:border-white/[0.12] dark:bg-white/[0.08]'

const focusInput = () => {
  nextTick(() => inputWrapRef.value?.querySelector('input')?.focus())
}

const email = 'benjamin.tomanik@gmail.com'
const { copy: copyToClipboard, isSupported: clipboardSupported } = useClipboard({ source: email })

const { data: posts } = await useContentData(
  'cmdk-blog-posts',
  () => queryCollection('blog').order('id', 'DESC').limit(3).all(),
)

const navigateTo = (target: string) => {
  if (target.startsWith('#')) {
    if (router.currentRoute.value.path !== '/') {
      router.push({ path: '/', hash: target })
    }
    else {
      document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' })
    }
  }
  else {
    router.push(target)
  }
}

const sectionItems = computed<CommandItem[]>(() => [
  {
    id: 'section-intro',
    label: t('nav.home'),
    icon: 'mdi:home-outline',
    action: () => navigateTo('#intro'),
  },
  {
    id: 'section-about',
    label: t('nav.about'),
    icon: 'mdi:information-outline',
    action: () => navigateTo('#about'),
  },
  {
    id: 'section-references',
    label: t('nav.references'),
    icon: 'mdi:book-open-variant',
    action: () => navigateTo('#references'),
  },
  {
    id: 'section-stack',
    label: t('nav.stack'),
    icon: 'mdi:stack-overflow',
    action: () => navigateTo('#stack'),
  },
  {
    id: 'section-contact',
    label: t('nav.contact'),
    icon: 'mdi:email-outline',
    action: () => navigateTo('#contact'),
  },
])

const postItems = computed<CommandItem[]>(() =>
  (posts.value ?? []).map(post => ({
    id: `post-${post.path}`,
    label: post.title ?? 'Untitled',
    subtitle: post.description ?? undefined,
    icon: 'mdi:file-document-outline',
    keywords: post.description ?? '',
    action: () => {
      router.push(post.path.replace(/^\/content/, ''))
    },
  })),
)

const actionItems = computed<CommandItem[]>(() => {
  const items: CommandItem[] = [
    {
      id: 'action-toggle-theme',
      label: colorMode.value === 'dark' ? t('cmdk.switchToLight') : t('cmdk.switchToDark'),
      icon: colorMode.value === 'dark' ? 'mingcute:sun-fill' : 'mingcute:moon-fill',
      action: () => {
        colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
      },
    },
    {
      id: 'action-switch-lang',
      label: locale.value === 'cs' ? t('cmdk.switchToEnglish') : t('cmdk.switchToCzech'),
      icon: 'mdi:translate',
      action: () => setLocale(locale.value === 'cs' ? 'en' : 'cs'),
    },
    {
      id: 'action-copy-email',
      label: t('cmdk.copyEmail'),
      subtitle: email,
      icon: 'mdi:content-copy',
      action: async () => {
        if (!clipboardSupported.value) {
          toast.error(t('contact.copyUnsupported'))
          return
        }
        await copyToClipboard(email)
        toast.success(t('contact.emailCopied'))
      },
    },
  ]

  for (const social of socialLinks) {
    items.push({
      id: `action-${social.platform.toLowerCase()}`,
      label: t('cmdk.openSocial', { platform: social.platform }),
      icon: social.icon,
      action: () => {
        window.open(social.url, '_blank', 'noopener,noreferrer')
      },
    })
  }

  return items
})

const allGroups = computed<CommandGroup[]>(() => [
  { id: 'sections', label: t('cmdk.sections'), items: sectionItems.value },
  { id: 'posts', label: t('cmdk.posts'), items: postItems.value },
  { id: 'actions', label: t('cmdk.actions'), items: actionItems.value },
])

const itemMap = computed(() => {
  const map = new Map<string, CommandItem>()
  for (const group of allGroups.value) {
    for (const item of group.items) map.set(item.id, item)
  }
  return map
})

const filteredGroups = computed<CommandGroup[]>(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return allGroups.value.filter(g => g.items.length > 0)

  return allGroups.value
    .map(group => ({
      ...group,
      items: group.items.filter((item) => {
        const haystack = [item.label, item.subtitle, item.keywords]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
        return haystack.includes(q)
      }),
    }))
    .filter(group => group.items.length > 0)
})

const hasResults = computed(() => filteredGroups.value.some(g => g.items.length > 0))

const onSelect = async (id: string | null) => {
  if (!id) return
  const item = itemMap.value.get(id)
  if (!item) return
  close()
  await nextTick()
  await item.action()
}

watch(isOpen, (open) => {
  if (!open) query.value = ''
})
</script>
