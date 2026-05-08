import { defineCollection, defineContentConfig } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    blog: defineCollection({
      type: 'page',
      source: {
        repository: {
          url: 'https://github.com/bigjohnn1/portfolio-vue',
          auth: {
            username: 'bigjohnn1',
            token: process.env.GITHUB_TOKEN || '',
          },
        },
        include: 'content/blog/**/*.md',
      },
    }),
  },
})
