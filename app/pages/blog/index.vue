<template>
  <div class="max-w-5xl mx-auto py-20 px-4 sm:px-6 lg:px-8 min-h-screen flex flex-col">
    <header class="mb-16 border-b border-gray-200 dark:border-gray-800 pb-8">
      <NuxtLinkLocale
        to="/"
        class="inline-flex items-center text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors mb-8"
      >
        <Icon
          name="carbon:arrow-left"
          class="mr-3 w-4 h-4"
          aria-hidden="true"
        />
        {{ $t('blog.backToHome') }}
      </NuxtLinkLocale>

      <h1 class="text-5xl sm:text-6xl font-serif text-gray-900 dark:text-white tracking-tight">
        {{ $t('nav.blog') }}
      </h1>
    </header>

    <div
      v-if="pending"
      class="flex-grow py-32 text-center text-gray-400"
    >
      <Icon
        name="carbon:circle-dash"
        class="w-10 h-10 animate-spin mx-auto mb-6 text-primary-500"
      />
      <span class="text-sm uppercase tracking-widest">{{ $t('blog.loadingPosts') }}</span>
    </div>

    <template v-else-if="posts?.length">
      <div class="flex flex-col md:flex-row gap-8 mb-16 items-start md:items-end justify-between">
        <div class="relative w-full md:w-96">
          <Icon
            name="carbon:search"
            class="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
          />
          <input
            v-model="searchQuery"
            type="text"
            :placeholder="$t('blog.searchPosts')"
            class="w-full pl-8 pr-4 py-3 bg-transparent border-0 border-b border-gray-300 dark:border-gray-700 focus:border-primary-500 dark:focus:border-primary-400 focus:ring-0 text-gray-900 dark:text-white rounded-none transition-colors outline-none placeholder-gray-400 dark:placeholder-gray-500"
          >
        </div>

        <div
          v-if="allTags.length"
          class="flex flex-wrap gap-3 w-full md:w-auto"
        >
          <button
            type="button"
            class="px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-300 border"
            :class="!selectedTag ? 'border-gray-900 bg-gray-900 text-white dark:border-white dark:bg-white dark:text-gray-900' : 'border-gray-300 text-gray-600 hover:border-gray-900 dark:border-gray-700 dark:text-gray-400 dark:hover:border-white'"
            @click="selectedTag = ''"
          >
            {{ $t('blog.allTags') }}
          </button>
          <button
            v-for="tag in allTags"
            :key="tag"
            type="button"
            class="px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-300 border"
            :class="selectedTag === tag ? 'border-gray-900 bg-gray-900 text-white dark:border-white dark:bg-white dark:text-gray-900' : 'border-gray-300 text-gray-600 hover:border-gray-900 dark:border-gray-700 dark:text-gray-400 dark:hover:border-white'"
            @click="selectedTag = tag"
          >
            {{ tag }}
          </button>
        </div>
      </div>

      <div
        v-if="paginatedPosts.length"
        class="grid gap-12 md:grid-cols-2 flex-grow"
      >
        <NuxtLinkLocale
          v-for="post in paginatedPosts"
          :key="post.path"
          :to="post.path"
          class="group flex flex-col outline-none"
        >
          <div
            v-if="post.cover"
            class="w-full h-64 overflow-hidden bg-gray-100 dark:bg-gray-900 mb-6 relative border border-gray-200 dark:border-gray-800"
          >
            <NuxtImg
              :src="post.cover"
              :alt="post.title"
              class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 group-focus-visible:scale-105 filter grayscale-[20%] group-hover:grayscale-0"
              format="webp"
            />
          </div>

          <div class="flex flex-col flex-grow">
            <div class="flex items-center gap-3 mb-4">
              <time
                v-if="post.date"
                class="text-xs font-mono text-gray-500 dark:text-gray-400 uppercase tracking-widest"
              >
                {{ formatDate(post.date) }}
              </time>
              <div
                v-if="post.tags?.length"
                class="flex gap-2"
              >
                <span
                  v-for="tag in post.tags.slice(0, 2)"
                  :key="tag"
                  class="text-xs font-bold text-primary-600 dark:text-primary-400 uppercase tracking-widest before:content-['/'] before:mr-2 before:text-gray-300 dark:before:text-gray-700"
                >
                  {{ tag }}
                </span>
              </div>
            </div>

            <h2 class="text-3xl font-serif text-gray-900 dark:text-white mb-4 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors leading-tight decoration-2 underline-offset-4 group-hover:underline">
              {{ post.title }}
            </h2>

            <p class="text-gray-600 dark:text-gray-400 mb-8 line-clamp-3 text-base leading-relaxed flex-grow">
              {{ post.description || $t('blog.noDescription') }}
            </p>

            <div class="mt-auto flex items-center text-xs font-bold uppercase tracking-widest text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              <span v-html="$t('blog.readMore')" />
              <Icon
                name="carbon:arrow-right"
                class="w-4 h-4 ml-3 transform group-hover:translate-x-2 transition-transform duration-300"
              />
            </div>
          </div>
        </NuxtLinkLocale>
      </div>

      <div
        v-else
        class="flex flex-col items-center justify-center py-32 text-center flex-grow border-y border-dashed border-gray-200 dark:border-gray-800"
      >
        <Icon
          name="carbon:search-advanced"
          class="w-12 h-12 text-gray-300 dark:text-gray-700 mb-6"
        />
        <h3 class="text-2xl font-serif text-gray-900 dark:text-white mb-3">
          {{ $t('blog.noPostsFound') }}
        </h3>
        <p class="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
          {{ $t('blog.noResultsDesc') }}
        </p>
        <button
          type="button"
          class="px-8 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-bold uppercase tracking-widest transition-transform hover:-translate-y-1"
          @click="resetFilters"
        >
          {{ $t('blog.clearFilters') }}
        </button>
      </div>

      <nav
        v-if="totalPages > 1"
        class="mt-20 pt-10 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between"
      >
        <button
          type="button"
          class="group flex items-center text-xs font-bold uppercase tracking-widest disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400"
          :disabled="currentPage === 1"
          :aria-label="$t('blog.prevPage')"
          @click="currentPage--"
        >
          <Icon
            name="carbon:arrow-left"
            class="w-4 h-4 mr-3 transform group-hover:-translate-x-2 transition-transform duration-300 group-disabled:transform-none"
          />
          {{ $t('blog.prevPage') }}
        </button>

        <div class="hidden sm:flex items-center gap-4">
          <button
            v-for="page in totalPages"
            :key="page"
            type="button"
            class="text-sm font-mono transition-colors"
            :class="currentPage === page ? 'text-primary-600 dark:text-primary-400 font-bold border-b-2 border-primary-600 dark:border-primary-400' : 'text-gray-400 hover:text-gray-900 dark:hover:text-white'"
            @click="currentPage = page"
          >
            {{ String(page).padStart(2, '0') }}
          </button>
        </div>

        <button
          type="button"
          class="group flex items-center text-xs font-bold uppercase tracking-widest disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400"
          :disabled="currentPage === totalPages"
          :aria-label="$t('blog.nextPage')"
          @click="currentPage++"
        >
          {{ $t('blog.nextPage') }}
          <Icon
            name="carbon:arrow-right"
            class="w-4 h-4 ml-3 transform group-hover:translate-x-2 transition-transform duration-300 group-disabled:transform-none"
          />
        </button>
      </nav>
    </template>

    <div
      v-else
      class="flex-grow flex items-center justify-center py-32 text-gray-500 dark:text-gray-400 font-serif text-xl border-y border-dashed border-gray-200 dark:border-gray-800"
    >
      {{ $t('blog.noPostsFound') }}
    </div>
  </div>
</template>

<script setup lang="ts">
interface BlogPost {
  path: string
  title: string
  description?: string
  cover?: string
  date?: string
  tags?: string[]
}

const { data: posts, pending } = await useContentData<BlogPost[]>('blog-list', () =>
  queryCollection('blog').order('id', 'DESC').all(),
)

useSeoMeta({
  title: 'Blog - Big John',
  description: 'Read the latest thoughts and updates.',
})

const itemsPerPage = 6

const searchQuery = shallowRef('')
const selectedTag = shallowRef('')
const currentPage = shallowRef(1)

const formatDate = (dateStr?: string) => {
  if (!dateStr) return ''
  const parts = dateStr?.split('T')[0]?.split('-')
  if (parts && parts.length === 3) {
    return `${parts[2]}. ${parts[1]}. ${parts[0]}`
  }
  return dateStr
}

const allTags = computed(() => {
  if (!posts.value) return []
  const tags = new Set<string>()
  posts.value.forEach((post) => {
    if (Array.isArray(post.tags)) {
      post.tags.forEach(tag => tags.add(tag))
    }
  })
  return Array.from(tags).sort()
})

const normalizeText = (text?: string) => {
  if (!text) return ''
  return text.toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
}

const filteredPosts = computed(() => {
  let result = posts.value || []

  if (selectedTag.value) {
    result = result.filter(post => post.tags?.includes(selectedTag.value))
  }

  if (searchQuery.value) {
    const q = normalizeText(searchQuery.value)
    if (q) {
      result = result.filter((post) => {
        const titleMatch = normalizeText(post.title).includes(q)
        const descMatch = normalizeText(post.description).includes(q)
        return titleMatch || descMatch
      })
    }
  }

  return result
})

const totalPages = computed(() => Math.ceil(filteredPosts.value.length / itemsPerPage))

const paginatedPosts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredPosts.value.slice(start, end)
})

watch([searchQuery, selectedTag], () => {
  currentPage.value = 1
})

const resetFilters = () => {
  searchQuery.value = ''
  selectedTag.value = ''
  currentPage.value = 1
}
</script>
