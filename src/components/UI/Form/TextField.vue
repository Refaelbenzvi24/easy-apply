<script setup lang="ts">
const props = defineProps<{
  modelValue?: string
  helperText?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const updateValue = ({target}: { target: HTMLInputElement }) => emit('update:modelValue', target.value)
</script>

<template>
  <div class="text-field-container">
    <input
        :value="modelValue"
        @input="updateValue"
        v-bind="$attrs"
        class="text-field"/>
    <span>{{ helperText }}</span>
  </div>
</template>

<style scoped>
.text-field {
  @apply border border-2 border-gray-200 text-3.5 w-full h-7 px-1 bg-gray-50
  disabled:text-gray-400 focus:outline-none focus:border-gray-300;
}

.text-field-container {
  @apply flex flex-col w-full text-2.5;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type=number] {
  -moz-appearance: textfield;
}
</style>
