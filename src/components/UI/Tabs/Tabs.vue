<script setup lang="ts">
const props = withDefaults(defineProps<{
  modelValue: string
  height?: string
}>(), {
  height: '40px'
})

const instance = getCurrentInstance()
</script>


<template>
  <div class="tabs">
    <slot></slot>
  </div>
</template>


<style scoped>
.tabs {
  @apply flex flex-row;
  height: v-bind(height);
}
</style>
