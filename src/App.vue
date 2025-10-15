<script setup lang="ts">
import LoadingView from '@/components/loading/LoadingView.vue'
import { RouterView } from 'vue-router'
</script>

<template>
  <suspense>
    <template #default>
      <RouterView />
    </template>
    <template #fallback>
      <LoadingView />
    </template>
  </suspense>
</template>

<style scoped></style>
