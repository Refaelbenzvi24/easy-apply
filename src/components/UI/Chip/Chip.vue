<script setup lang="ts">
const props = defineProps<{
  value?: string
  clearable?: boolean
}>()

const emit = defineEmits<{
  (e: 'clear'): void
}>()

const handleClear = () => {
  emit('clear')
}

const paddingRight = props.clearable ? 8 : 0
</script>

<template>
  <span class="chip">
    <span class="chip-content">{{ value }}</span>
    <button
        @click="handleClear"
        v-if="clearable">
      <mdi-clear-circle/>
    </button>
  </span>
</template>

<style scoped>
.chip {
  @apply flex items-center bg-gray-200 py-1.5 px-2 text-3 rounded-sm;
}

.chip-content {
  padding-right: v-bind(paddingRight) px;
}
</style>
