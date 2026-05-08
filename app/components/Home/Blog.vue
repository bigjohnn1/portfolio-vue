<template>
  <section
    id="blog-preview"
    class="relative w-full py-28 bg-white dark:bg-gray-900 z-10 overflow-hidden"
  >
    <div class="max-w-6xl mx-auto px-4">
      <div class="text-center mb-16">
        <h2 class="text-4xl md:text-5xl font-bold text-primary-700 dark:text-primary-300 tracking-tight">
          {{ $t('homeBlog.title') }}
        </h2>
      </div>

      <div
        v-if="pending"
        class="text-center text-gray-500"
      >
        {{ $t('homeBlog.loading') }}
      </div>

      <div
        v-else-if="posts?.length"
        class="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
      >
        <NuxtLink
          v-for="post in posts"
          :key="post.path"
          :to="post.path.replace(/^\/content/, '')"
          class="flex flex-col block group bg-base-bg dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl overflow-hidden transition-all duration-300 border border-gray-100 dark:border-gray-700 h-full"
        >
          <div
            v-if="post.meta?.cover"
            class="w-full h-48 overflow-hidden bg-gray-100 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-700"
          >
            <NuxtImg
              :src="(post.meta.cover as string)"
              :alt="post.title"
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              format="webp"
            />
          </div>
          <div class="p-6 flex flex-col flex-grow">
            <div class="mb-4 text-xs font-medium text-gray-500 dark:text-gray-400">
              <span v-if="post.meta?.date">{{ new Date(post.meta.date as string).toLocaleDateString() }}</span>
              <span v-else>{{ $t('homeBlog.recent') }}</span>
            </div>

            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-primary-500 transition-colors">
              {{ post.title }}
            </h3>

            <p class="text-gray-600 dark:text-gray-400 mb-6 line-clamp-3 flex-grow">
              {{ post.description }}
            </p>

            <div class="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
              <span class="text-sm font-medium text-primary-600 dark:text-primary-400 group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-colors">
                {{ $t('homeBlog.readMore') }}
              </span>
              <Icon
                name="carbon:arrow-right"
                class="w-5 h-5 text-primary-600 dark:text-primary-400 group-hover:translate-x-1 transition-transform"
                aria-hidden="true"
              />
            </div>
          </div>
        </NuxtLink>
      </div>

      <div
        v-else
        class="text-center text-gray-500 dark:text-gray-400"
      >
        {{ $t('homeBlog.noPosts') }}
      </div>

      <div class="mt-12 text-center">
        <NuxtLink
          to="/blog"
          class="inline-flex items-center px-6 py-3 bg-primary-600 dark:bg-primary-500 text-base font-medium text-white rounded-full hover:bg-primary-700 dark:hover:bg-primary-400 transition-colors shadow-sm hover:shadow-md"
        >
          {{ $t('homeBlog.viewAll') }}
          <Icon
            name="carbon:document"
            class="ml-2 w-5 h-5"
            aria-hidden="true"
          />
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { data: posts, pending } = await useAsyncData('home-blog-posts', () => {
  return queryCollection('blog')
    .order('id', 'DESC')
    .limit(3)
    .all()
})
</script>
