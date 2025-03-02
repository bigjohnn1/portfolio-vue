<template>
  <footer
    ref="footerRef"
    class="relative bg-gray-900 text-white p-6 text-center overflow-hidden h-28"
  >
    <div v-show="isVisible" class="absolute inset-0 opacity-20">
      <svg class="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="url(#stars)" />
        <defs>
          <pattern
            id="stars"
            x="0"
            y="0"
            width="50"
            height="50"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="10" cy="10" r="1" fill="#E5E7EB" class="twinkle" />
            <circle cx="40" cy="40" r="2" fill="#E5E7EB" class="twinkle-alt" />
            <circle cx="25" cy="20" r="1" fill="#E5E7EB" class="twinkle" />
          </pattern>
        </defs>
      </svg>
    </div>
    <div class="relative z-10">
      <div class="flex justify-center space-x-6 mb-4">
        <NuxtLink
          to="https://github.com/bigjohnn1/"
          target="_blank"
          class="hover:text-blue-500 transition-colors"
        >
          <Icon name="mdi:github" size="24" />
        </NuxtLink>
        <NuxtLink
          to="https://www.linkedin.com/"
          target="_blank"
          class="hover:text-blue-500 transition-colors"
        >
          <Icon name="mdi:linkedin" size="24" />
        </NuxtLink>
        <NuxtLink
          to="https://www.instagram.com/"
          target="_blank"
          class="hover:text-blue-500 transition-colors"
        >
          <Icon name="mdi:instagram" size="24" />
        </NuxtLink>
      </div>
      <p>© {{ year }} Big John</p>
    </div>
  </footer>
</template>

<script lang="ts" setup>
import { useIntersectionObserver } from "@vueuse/core";

const year = new Date().getFullYear();
const isVisible = ref(false);
const footerRef = ref(null);

onMounted(() => {
  useIntersectionObserver(
    footerRef,
    ([{ isIntersecting }]) => {
      isVisible.value = isIntersecting;
    },
    { threshold: 0.1 }
  );
});
</script>

<style scoped>
.twinkle {
  animation: twinkle 2s infinite alternate;
}
.twinkle-alt {
  animation: twinkle 3s infinite alternate;
}
@keyframes twinkle {
  0% {
    opacity: 0.3;
  }
  100% {
    opacity: 1;
  }
}
</style>
