<template>
  <div class="flex flex-col min-h-screen">
    <main class="flex-grow">
      <slot />
    </main>
    <footer
      ref="footerRef"
      class="relative bg-gray-900 text-white p-6 text-center overflow-hidden"
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
              <circle
                cx="40"
                cy="40"
                r="2"
                fill="#E5E7EB"
                class="twinkle-alt"
              />
            </pattern>
          </defs>
        </svg>
      </div>
      <div class="relative z-10">
        <p>© {{ year }} Big John</p>
      </div>
    </footer>
  </div>
</template>

<script lang="ts" setup>
import { useIntersectionObserver } from "@vueuse/core";

const year = new Date().getFullYear();
const isVisible = ref(false);
const footerRef = ref(null);

onMounted(() => {
  const { stop } = useIntersectionObserver(
    footerRef,
    ([{ isIntersecting }]) => {
      if (isIntersecting) {
        isVisible.value = true;
        stop();
      }
    }
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
