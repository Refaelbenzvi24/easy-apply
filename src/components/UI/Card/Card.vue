<script setup lang="ts">
const props = withDefaults(defineProps<{
  height?: string
  width?: string
}>(), {
  height: "200px",
  width: "200px"
})
</script>

<template>
  <div class="card">
    <slot></slot>
  </div>
</template>

<style scoped>
.card {
  @apply flex flex-col bg-gray-50;
  height: v-bind(height);
  width: v-bind(width);
}
</style>
