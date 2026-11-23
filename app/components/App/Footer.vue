<template>
  <footer
    role="contentinfo"
    class="relative overflow-hidden border-t border-gray-200 bg-gray-50 text-gray-700 transition-colors dark:border-white/10 dark:bg-gray-950 dark:text-gray-300"
  >
    <div class="relative z-10 mx-auto grid max-w-content gap-10 px-section-x py-12 sm:py-14 lg:grid-cols-3 lg:gap-16">
      <div class="flex flex-col gap-3">
        <p class="font-display text-lg font-semibold tracking-tight text-gray-900 dark:text-gray-50">
          {{ $t('global.name') }}
        </p>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          {{ $t('footer.tagline') }}
        </p>
        <div class="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-gray-500 dark:text-gray-400">
          <Icon
            name="lucide:map-pin"
            class="h-3.5 w-3.5 shrink-0"
            aria-hidden="true"
          />
          <span>{{ $t('footer.location') }}</span>
          <span
            aria-hidden="true"
            class="text-gray-400 dark:text-gray-600"
          >·</span>
          <AppLocalClock class="text-[0.8125rem]" />
        </div>
      </div>

      <nav
        :aria-label="$t('footer.headingSections')"
        class="flex flex-col gap-3"
      >
        <p class="text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-500 dark:text-gray-400">
          {{ $t('footer.headingSections') }}
        </p>
        <ul class="grid grid-cols-2 gap-x-6 gap-y-1.5 text-sm">
          <li
            v-for="section in sections"
            :key="section.id"
          >
            <NuxtLinkLocale
              :to="`/#${section.id}`"
              :class="[
                'group/sec inline-flex items-center gap-1.5 transition-colors',
                activeId === section.id
                  ? 'text-primary-600 dark:text-primary-400'
                  : 'text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400',
              ]"
            >
              <span
                aria-hidden="true"
                :class="[
                  'h-1 w-1 rounded-full bg-current transition-opacity duration-300',
                  activeId === section.id ? 'opacity-100' : 'opacity-0 group-hover/sec:opacity-60',
                ]"
              />
              {{ $t(section.labelKey) }}
            </NuxtLinkLocale>
          </li>
        </ul>
      </nav>

      <div class="flex flex-col gap-3">
        <p class="text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-500 dark:text-gray-400">
          {{ $t('footer.headingConnect') }}
        </p>
        <ul class="flex flex-col gap-1.5 text-sm">
          <li
            v-for="social in socialLinks"
            :key="social.platform"
          >
            <NuxtLink
              :to="social.url"
              target="_blank"
              rel="noopener noreferrer"
              :aria-label="$t('footer.ariaSocial', { platform: social.platform })"
              class="inline-flex items-center gap-2 text-gray-600 transition-colors hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400"
            >
              <Icon
                :name="social.icon"
                class="h-4 w-4"
                aria-hidden="true"
              />
              {{ social.platform }}
            </NuxtLink>
          </li>
          <li>
            <a
              :href="`mailto:${email}`"
              :aria-label="$t('footer.emailLabel')"
              class="inline-flex items-center gap-2 text-gray-600 transition-colors hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400"
            >
              <Icon
                name="lucide:mail"
                class="h-4 w-4"
                aria-hidden="true"
              />
              {{ email }}
            </a>
          </li>
        </ul>
      </div>
    </div>

    <div class="relative z-10 mx-auto flex max-w-content flex-col items-start gap-2 px-section-x pb-8 pt-2 text-xs text-gray-500 dark:text-gray-500 sm:flex-row sm:items-center sm:justify-between">
      <p>{{ $t('footer.copyright', { year, name: $t('global.name') }) }} · {{ $t('footer.rights') }}</p>
      <div class="flex flex-wrap items-center gap-x-3 gap-y-1">
        <component
          :is="buildIsLinked ? 'a' : 'span'"
          v-bind="buildIsLinked ? { 'href': commitUrl, 'target': '_blank', 'rel': 'noopener noreferrer', 'aria-label': $t('footer.buildAria', { commit: build.commit, date: build.date }) } : {}"
          :class="[
            'inline-flex items-center gap-1.5 font-mono text-[11px] tracking-tight',
            buildIsLinked && 'transition-colors hover:text-primary-600 dark:hover:text-primary-400',
          ]"
        >
          <Icon
            name="lucide:git-commit-horizontal"
            class="h-3 w-3 shrink-0"
            aria-hidden="true"
          />
          {{ $t('footer.buildLabel') }} {{ build.commit }} · {{ build.date }}
        </component>
        <span
          aria-hidden="true"
          class="text-gray-400 dark:text-gray-600"
        >·</span>
        <span class="inline-flex flex-wrap items-center gap-1">
          {{ $t('footer.attribution') }}
          <a
            href="https://game-icons.net/"
            target="_blank"
            rel="noopener noreferrer"
            class="underline-offset-2 hover:underline"
          >game-icons.net</a>
          <span aria-hidden="true">·</span>
          <a
            href="https://creativecommons.org/licenses/by/3.0/"
            target="_blank"
            rel="noopener noreferrer"
            class="underline-offset-2 hover:underline"
          >CC BY 3.0</a>
        </span>
      </div>
    </div>
  </footer>
</template>

<script lang="ts" setup>
import type { SectionDef } from '~/composables/useActiveSection'
import { socialLinks } from '~/consts/socials'

const config = useRuntimeConfig()
const build = config.public.build as { commit: string, date: string, repoUrl: string }
const buildIsLinked = build.commit !== 'dev'
const commitUrl = `${build.repoUrl}/commit/${build.commit}`
const year = new Date().getFullYear()
const email = config.public.contactEmail

const sections: SectionDef[] = [
  { id: 'intro', labelKey: 'nav.intro' },
  { id: 'references', labelKey: 'nav.references' },
  { id: 'blog-preview', labelKey: 'nav.blog' },
  { id: 'stack', labelKey: 'nav.stack' },
  { id: 'about', labelKey: 'nav.about' },
  { id: 'activity', labelKey: 'nav.activity' },
  { id: 'contact', labelKey: 'nav.contact' },
]
const { activeId } = useActiveSection(sections)
</script>
