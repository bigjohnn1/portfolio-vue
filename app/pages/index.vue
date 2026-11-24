<template>
  <VueFrag>
    <HomeIntro />
    <AppHeader />
    <LazyHomeProjects />
    <LazyHomeBlog />
    <LazyHomeTechStack />
    <LazyHomeAbout />
    <LazyHomeGithubActivity />
    <LazyHomeContact />
    <LazyAppFooter />
  </VueFrag>
</template>

<script setup lang="ts">
const { t } = useI18n()

useSeoMeta({
  title: t('seo.homeTitle'),
  titleTemplate: '%s',
  description: t('seo.homeDescription'),
  ogTitle: t('seo.homeTitle'),
  ogDescription: t('seo.homeDescription'),
  ogImage: '/bj.png',
  twitterCard: 'summary_large_image',
})
</script>
