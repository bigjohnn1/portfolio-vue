<template>
  <DialogRoot v-model:open="isOpen">
    <DialogPortal>
      <Transition name="cmdk-overlay">
        <DialogOverlay
          v-if="isOpen"
          class="cmdk-overlay"
        />
      </Transition>
      <Transition name="cmdk-content">
        <DialogContent
          v-if="isOpen"
          class="cmdk-content"
          :aria-label="t('cmdk.title')"
          @open-auto-focus.prevent="focusInput"
        >
          <ComboboxRoot
            :open="true"
            :model-value="null"
            :ignore-filter="true"
            class="cmdk-root"
            @update:model-value="onSelect"
            @keydown.esc.stop="close"
          >
            <div class="cmdk-input-wrap">
              <Icon
                name="mdi:magnify"
                size="20"
                class="cmdk-input-icon"
                aria-hidden="true"
              />
              <ComboboxInput
                ref="inputRef"
                v-model="query"
                class="cmdk-input"
                :placeholder="t('cmdk.placeholder')"
                :display-value="() => query"
                auto-focus
              />
              <kbd class="cmdk-kbd cmdk-kbd-hint">ESC</kbd>
            </div>

            <ComboboxContent
              class="cmdk-content-area"
              force-mount
            >
              <ComboboxViewport class="cmdk-viewport">
                <div
                  v-if="!hasResults"
                  class="cmdk-empty"
                >
                  {{ t('cmdk.empty') }}
                </div>

                <ComboboxGroup
                  v-for="group in filteredGroups"
                  :key="group.id"
                  class="cmdk-group"
                >
                  <ComboboxLabel class="cmdk-group-label">
                    {{ group.label }}
                  </ComboboxLabel>
                  <ComboboxItem
                    v-for="item in group.items"
                    :key="item.id"
                    :value="item.id"
                    class="cmdk-item"
                  >
                    <Icon
                      :name="item.icon"
                      size="18"
                      class="cmdk-item-icon"
                      aria-hidden="true"
                    />
                    <span class="cmdk-item-text">
                      <span class="cmdk-item-label">{{ item.label }}</span>
                      <span
                        v-if="item.subtitle"
                        class="cmdk-item-subtitle"
                      >
                        {{ item.subtitle }}
                      </span>
                    </span>
                    <span
                      v-if="item.kbds"
                      class="cmdk-item-kbds"
                    >
                      <kbd
                        v-for="k in item.kbds"
                        :key="k"
                        class="cmdk-kbd"
                      >{{ k }}</kbd>
                    </span>
                  </ComboboxItem>
                </ComboboxGroup>
              </ComboboxViewport>
            </ComboboxContent>

            <div class="cmdk-footer">
              <span><kbd class="cmdk-kbd">↑</kbd><kbd class="cmdk-kbd">↓</kbd> {{ t('cmdk.navigate') }}</span>
              <span><kbd class="cmdk-kbd">↵</kbd> {{ t('cmdk.select') }}</span>
              <span><kbd class="cmdk-kbd">ESC</kbd> {{ t('cmdk.close') }}</span>
            </div>
          </ComboboxRoot>
        </DialogContent>
      </Transition>
    </DialogPortal>
  </DialogRoot>
</template>

<script setup lang="ts">
import { useClipboard, useMagicKeys } from '@vueuse/core'
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
const inputRef = useTemplateRef<{ $el: HTMLElement } | HTMLElement>('inputRef')

const focusInput = () => {
  nextTick(() => {
    const el = (inputRef.value as { $el?: HTMLElement })?.$el ?? (inputRef.value as HTMLElement)
    el?.querySelector?.('input')?.focus() ?? (el as HTMLInputElement)?.focus?.()
  })
}

const email = 'benjamin.tomanik@gmail.com'
const { copy: copyToClipboard, isSupported: clipboardSupported } = useClipboard({ source: email })

const { data: posts } = await useAsyncData(
  'cmdk-blog-posts',
  () => queryCollection('blog').order('id', 'DESC').limit(3).all(),
  { default: () => [] },
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
    action: () => router.push(post.path.replace(/^\/content/, '')),
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
      action: () => window.open(social.url, '_blank', 'noopener,noreferrer'),
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

if (import.meta.client) {
  const keys = useMagicKeys({
    passive: false,
    onEventFired(e) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k' && e.type === 'keydown') {
        e.preventDefault()
      }
    },
  })
  const cmdK = keys['Meta+K']
  const ctrlK = keys['Ctrl+K']

  watch([cmdK, ctrlK], ([m, c]) => {
    if (m || c) isOpen.value = !isOpen.value
  })
}
</script>

<style scoped>
.cmdk-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  z-index: 90;
}

.cmdk-content {
  position: fixed;
  top: 10vh;
  left: 50%;
  transform: translateX(-50%);
  width: min(640px, calc(100vw - 2rem));
  max-height: min(620px, 80vh);
  z-index: 91;
  border-radius: 1rem;
  overflow: hidden;
  background: #ffffff;
  color: #111827;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.35);
  border: 1px solid rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
}

:global(.dark) .cmdk-content {
  background: #111827;
  color: #f9fafb;
  border-color: rgba(255, 255, 255, 0.08);
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.7);
}

.cmdk-root {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
}

.cmdk-input-wrap {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.85rem 1rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

:global(.dark) .cmdk-input-wrap {
  border-bottom-color: rgba(255, 255, 255, 0.08);
}

.cmdk-input-icon {
  opacity: 0.5;
  flex-shrink: 0;
}

.cmdk-input {
  flex: 1;
  border: 0;
  outline: none;
  background: transparent;
  font-size: 1rem;
  color: inherit;
  font-family: inherit;
  min-width: 0;
}

.cmdk-input::placeholder {
  opacity: 0.45;
}

.cmdk-content-area {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;

  /* Reka ComboboxContent injects inline position:absolute + transform
     for popper behavior. Override to stay in flex flow. */
  position: static !important;
  transform: none !important;
  width: 100% !important;
  max-height: none !important;
}

.cmdk-viewport {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 0.5rem;
  scrollbar-width: thin;
}

.cmdk-empty {
  padding: 2.25rem 1rem;
  text-align: center;
  opacity: 0.5;
  font-size: 0.9rem;
}

.cmdk-group {
  margin-bottom: 0.5rem;
}

.cmdk-group-label {
  display: block;
  padding: 0.45rem 0.75rem 0.25rem;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.5;
}

.cmdk-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.6rem 0.75rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 0.92rem;
  user-select: none;
  transition: background 0.12s ease;
}

.cmdk-item[data-highlighted] {
  background: var(--color-primary-50);
  outline: none;
}

:global(.dark) .cmdk-item[data-highlighted] {
  background: var(--color-primary-900);
}

.cmdk-item-icon {
  flex-shrink: 0;
  opacity: 0.75;
  margin-top: 0.15rem;
}

.cmdk-item-text {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  gap: 0.15rem;
}

.cmdk-item-label {
  word-break: break-word;
}

.cmdk-item-subtitle {
  opacity: 0.55;
  font-size: 0.8rem;
  line-height: 1.35;
  word-break: break-word;
}

.cmdk-item-kbds {
  display: inline-flex;
  gap: 0.25rem;
  margin-left: auto;
}

.cmdk-kbd {
  display: inline-grid;
  place-items: center;
  min-width: 1.5rem;
  height: 1.4rem;
  padding: 0 0.35rem;
  font-size: 0.68rem;
  font-family: ui-monospace, monospace;
  font-weight: 600;
  background: rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 0.35rem;
  opacity: 0.85;
  line-height: 1;
}

:global(.dark) .cmdk-kbd {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.12);
}

.cmdk-kbd-hint {
  margin-left: auto;
}

.cmdk-footer {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.55rem 1rem;
  font-size: 0.72rem;
  opacity: 0.65;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
  flex-wrap: wrap;
}

:global(.dark) .cmdk-footer {
  border-top-color: rgba(255, 255, 255, 0.08);
}

.cmdk-overlay-enter-active,
.cmdk-overlay-leave-active {
  transition: opacity 0.18s ease;
}
.cmdk-overlay-enter-from,
.cmdk-overlay-leave-to {
  opacity: 0;
}

.cmdk-content-enter-active,
.cmdk-content-leave-active {
  transition:
    opacity 0.22s ease,
    transform 0.32s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.cmdk-content-enter-from,
.cmdk-content-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-12px) scale(0.97);
}

@media (prefers-reduced-motion: reduce) {
  .cmdk-overlay-enter-active,
  .cmdk-overlay-leave-active,
  .cmdk-content-enter-active,
  .cmdk-content-leave-active {
    transition: opacity 0.15s ease;
  }
  .cmdk-content-enter-from,
  .cmdk-content-leave-to {
    transform: translateX(-50%);
  }
}
</style>
