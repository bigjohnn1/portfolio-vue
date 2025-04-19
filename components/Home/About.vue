<template>
  <section
    class="about-me relative w-full py-16 bg-base-bg text-base-text overflow-hidden"
    id="about"
  >
    <div class="max-w-5xl mx-auto px-4">
      <h2
        class="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100 text-center mb-12"
      >
        {{ $t("about.title") }}
      </h2>
      <div class="flex flex-col md:flex-row items-center gap-8">
        <div class="md:w-2/3">
          <p class="text-lg text-gray-600 dark:text-gray-400 mb-4">
            {{ $t("about.description") }}
          </p>
          <ul class="list-disc list-inside text-gray-600 dark:text-gray-400">
            <li>{{ $t("about.points.education") }}</li>
            <li>{{ $t("about.points.experience") }}</li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>
