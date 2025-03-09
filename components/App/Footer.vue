<template>
  <footer
    ref="footerRef"
    class="relative bg-gray-900 text-white p-6 text-center overflow-hidden"
  >
    <div v-show="isVisible" class="absolute inset-0 opacity-20">
      <div
        v-for="(star, index) in stars"
        :key="index"
        class="absolute rounded-full"
        :style="{
          left: star.left + '%',
          top: star.top + '%',
          width: star.size + 'px',
          height: star.size + 'px',
          backgroundColor: '#E5E7EB',
          animation: `twinkle ${star.duration}s infinite alternate`,
        }"
      ></div>
    </div>
    <div class="relative z-10">
      <div class="footer-social flex justify-center gap-6 mb-4">
        <NuxtLink
          to="https://github.com/"
          target="_blank"
          class="hover:text-gray-300"
        >
          <Icon name="mdi:github" class="h-6 w-6" />
        </NuxtLink>
        <NuxtLink
          to="https://linkedin.com/in/"
          target="_blank"
          class="hover:text-gray-300"
        >
          <Icon name="mdi:linkedin" class="h-6 w-6" />
        </NuxtLink>
        <NuxtLink
          to="https://instagram.com/"
          target="_blank"
          class="hover:text-gray-300"
        >
          <Icon name="mdi:instagram" class="h-6 w-6" />
        </NuxtLink>
      </div>
      <p class="text-white">© {{ year }} Big John</p>
    </div>
  </footer>
</template>

<script lang="ts" setup>
import { useIntersectionObserver } from "@vueuse/core";

interface Star {
  left: number;
  top: number;
  size: number;
  duration: number;
}

const year = new Date().getFullYear();
const isVisible = ref(false);
const footerRef = ref(null);
const stars = ref<Star[]>([]);

onMounted(() => {
  const { stop } = useIntersectionObserver(
    footerRef,
    ([{ isIntersecting }]) => {
      if (isIntersecting) {
        isVisible.value = true;
        generateStars();
        stop();
      }
    }
  );
});

function generateStars() {
  const starCount = 50;
  for (let i = 0; i < starCount; i++) {
    stars.value.push({
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 2 + 1,
      duration: Math.random() * 2 + 1,
    });
  }
}
</script>

<style scoped>
@keyframes twinkle {
  0% {
    opacity: 0.3;
  }
  100% {
    opacity: 1;
  }
}

.footer-social {
  a {
    transition: color 0.3s ease;
  }
}
</style>
