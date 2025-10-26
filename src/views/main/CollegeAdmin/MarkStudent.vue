<template>
  <h1>审批</h1>
  {{ path }}
</template>
<script setup lang="ts">
import { toRef } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const path = toRef(() => route.path)
</script>
<style scoped></style>
