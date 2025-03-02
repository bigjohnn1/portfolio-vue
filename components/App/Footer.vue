<template>
  <footer class="bg-gray-900 text-white p-4 text-center">
    <p>© {{ year }} TaskFlow</p>
  </footer>
</template>
<script lang="ts" setup>
const year = ref(new Date().getFullYear());
</script>
