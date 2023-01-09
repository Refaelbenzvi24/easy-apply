<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean
}>()
</script>

<template>
  <Transition>
    <div
        v-if="modelValue"
        class="backdrop"/>
  </Transition>
</template>

<style scoped lang="scss">
.backdrop {
  @apply fixed h-full w-full bg-dark-800 cursor-default;
  z-index: 1220;
  opacity: 0.3;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 300ms ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
