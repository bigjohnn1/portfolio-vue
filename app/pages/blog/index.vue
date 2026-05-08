<template>
  <div class="max-w-4xl mx-auto py-24 px-4 sm:px-6 lg:px-8 min-h-screen">
    <h1 class="text-4xl font-bold text-primary-700 dark:text-primary-300 mb-12">
      {{ $t('nav.blog') }}
    </h1>

    <div
      v-if="pending"
      class="text-gray-500"
    >
      {{ $t('blog.loadingPosts') }}
    </div>

    <div
      v-else-if="posts?.length"
      class="grid gap-8 md:grid-cols-2"
    >
      <NuxtLink
        v-for="post in posts"
        :key="post.path"
        :to="post.path"
        class="flex flex-col block group bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl overflow-hidden transition-all duration-300 border border-gray-100 dark:border-gray-700 h-full"
      >
        <div
          v-if="post.meta?.cover"
          class="w-full h-56 overflow-hidden bg-gray-100 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-700"
        >
          <NuxtImg
            :src="(post.meta.cover as string)"
            :alt="post.title"
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            format="webp"
          />
        </div>
        <div class="p-6 flex flex-col flex-grow">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary-500 transition-colors">
            {{ post.title }}
          </h2>
          <p class="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3 flex-grow">
            {{ post.description || $t('blog.noDescription') }}
          </p>
          <span class="mt-auto text-sm font-medium text-primary-600 dark:text-primary-400">
            <span v-html="$t('blog.readMore')" />
          </span>
        </div>
      </NuxtLink>
    </div>

    <div
      v-else
      class="text-gray-500 dark:text-gray-400"
    >
      {{ $t('blog.noPostsFound') }}
    </div>
  </div>
</template>

<script setup lang="ts">
const { data: posts, pending } = await useAsyncData('blog-list', () => {
  return queryCollection('blog').all()
})

useSeoMeta({
  title: 'Blog - Big John',
  description: 'Read the latest thoughts and updates.',
})
</script>
