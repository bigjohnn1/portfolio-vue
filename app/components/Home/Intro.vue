<template>
  <section
    id="intro"
    class="relative flex min-h-[85svh] w-full items-center overflow-hidden py-20"
  >
    <div class="absolute right-4 top-4 z-20 sm:right-6 sm:top-6 md:right-8 md:top-8">
      <LazyAppLocaleSwitcher hydrate-on-idle />
    </div>

    <div class="mx-auto flex w-full max-w-7xl flex-col items-center gap-12 px-4 sm:px-6 lg:flex-row lg:gap-16 lg:px-8">
      <div class="w-full lg:w-1/2">
        <h1 class="font-display text-[clamp(44px,6vw,80px)] font-bold leading-[1.02] tracking-tight text-gray-900 dark:text-gray-50">
          {{ $t('global.name') }}
        </h1>

        <p class="mt-4 text-[clamp(20px,2.2vw,26px)] font-semibold leading-tight tracking-tight text-primary-700 dark:text-primary-300">
          {{ $t('intro.headline') }}
        </p>

        <p class="mt-6 max-w-xl text-[clamp(17px,1.6vw,20px)] leading-relaxed [text-wrap:pretty] text-gray-600 dark:text-gray-300">
          {{ $t('intro.subtitle') }}
        </p>

        <div class="mt-10 flex flex-wrap items-center gap-3">
          <NuxtLink
            to="#references"
            :aria-label="$t('intro.ctaLabel')"
            class="group/cta inline-flex items-center gap-2 rounded-lg bg-primary-600 px-6 py-3 text-base font-semibold text-white transition-colors duration-200 hover:bg-primary-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-300 dark:bg-primary-500 dark:text-gray-950 dark:hover:bg-primary-400"
          >
            {{ $t('intro.cta') }}
            <Icon
              name="lucide:arrow-right"
              class="h-4 w-4 transition-transform duration-200 group-hover/cta:translate-x-0.5 motion-reduce:transition-none"
              aria-hidden="true"
            />
          </NuxtLink>
          <a
            href="/Benjamin-Tomanik-CV.pdf"
            download
            :aria-label="$t('intro.cvLabel')"
            class="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-6 py-3 text-base font-semibold text-gray-800 transition-colors duration-200 hover:border-gray-400 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-300 dark:border-white/20 dark:text-gray-100 dark:hover:border-white/35 dark:hover:bg-white/5"
          >
            <Icon
              name="lucide:file-down"
              class="h-4 w-4"
              aria-hidden="true"
            />
            {{ $t('intro.cv') }}
          </a>
        </div>

        <p class="mt-6 text-sm text-gray-500 dark:text-gray-400">
          {{ $t('intro.ctaSub') }}
        </p>
      </div>

      <div class="flex w-full justify-center lg:w-1/2">
        <HomeIntroHero />
      </div>
    </div>
  </section>
</template>
