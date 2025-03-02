<template>
  <footer class="bg-gray-900 text-white p-4 text-center">
    <p>© {{ date }} TaskFlow</p>
  </footer>
</template>
<script lang="ts" setup>
import { useDateFormat } from "@vueuse/core";

const date = useDateFormat(new Date(), "yyyy");
</script>
