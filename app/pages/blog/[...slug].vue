<template>
  <div class="max-w-4xl mx-auto py-24 px-4 sm:px-6 lg:px-8 min-h-screen prose dark:prose-invert prose-primary lg:prose-lg">
    <div
      v-if="pending"
      class="text-gray-500"
    >
      {{ $t('blog.loadingPost') }}
    </div>

    <article v-else-if="post">
      <NuxtLink
        to="/blog"
        class="text-primary-600 hover:text-primary-700 dark:text-primary-400 no-underline mb-8 inline-block"
      >
        <span v-html="$t('blog.backToBlog')" />
      </NuxtLink>

      <div
        v-if="post.meta?.cover"
        class="mb-8 rounded-2xl overflow-hidden shadow-lg"
      >
        <NuxtImg
          :src="(post.meta.cover as string)"
          :alt="post.title"
          class="w-full max-h-[500px] object-cover"
          format="webp"
          priority
        />
      </div>

      <h1 class="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl mb-4">
        {{ post.title }}
      </h1>
      <p
        v-if="post.description"
        class="text-xl text-gray-500 dark:text-gray-400 mb-8"
      >
        {{ post.description }}
      </p>

      <ContentRenderer :value="post" />
    </article>

    <div
      v-else
      class="text-center py-20"
    >
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        {{ $t('blog.notFoundTitle') }}
      </h2>
      <p class="text-gray-500 mb-8">
        {{ $t('blog.notFoundDesc') }}
      </p>
      <NuxtLink
        to="/blog"
        class="bg-primary-600 text-white px-6 py-3 rounded-full font-medium hover:bg-primary-700 transition-colors no-underline"
      >
        {{ $t('blog.returnToBlog') }}
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()

const { data: post, pending } = await useAsyncData(`blog-${route.path}`, async () => {
  const localPath = route.path
  const remotePath = `/content${route.path}`

  try {
    const p = await queryCollection('blog').path(localPath).first()
    if (p) return p
  }
  catch {
    //
  }

  try {
    const p = await queryCollection('blog').path(remotePath).first()
    if (p) return p
  }
  catch {
    //
  }

  return null
})

useSeoMeta({
  title: () => (post.value?.title ? `${post.value.title} - Big John` : 'Blog - Big John'),
  description: () => post.value?.description || '',
})
</script>
