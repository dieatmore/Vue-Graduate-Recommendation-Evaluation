<template>
  <div class="w-full main-container bg-[#F9FAFB] py-4 px-8">
    <h1>yes！{{ route.params.categoryId }}</h1>
  </div>
</template>
<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
</script>
<style scoped>
.main-container {
  min-height: calc(100vh - 64px);
}
</style>
