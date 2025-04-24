<template>
  <div class="relative min-h-screen">
    <div class="fixed inset-0 z-0 pointer-events-none">
      <div
        class="sq top-1/4 left-1/3 bg-gray-600 opacity-50 blur-2xl w-24 h-32 transform anim-float"
      />
      <div
        class="sq bottom-1/3 right-1/4 bg-gray-500 opacity-50 blur-2xl w-20 h-28 transform anim-float delay-200"
      />
      <div
        class="sq top-2/3 left-1/4 bg-gray-400 opacity-50 blur-2xl w-28 h-36 transform anim-float delay-400"
      />
    </div>
    <slot />
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss">
.anim-float {
  animation: float 5s ease-in-out infinite;
}

.sq {
  @apply absolute rounded-lg -z-20;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-63px);
  }
}
</style>
