<script setup lang="ts">
const props = withDefaults(defineProps<{
  disabled?: boolean
  depth?: number
}>(), {
  depth: 0
})

const paddingLeft = `${(props.depth + 1) * 16}px`
</script>

<template>
  <li
      class="list-item">
    <Transition>
      <div v-if="disabled" class="list-item-disabled"/>
    </Transition>
    <div class="list-item-content">
      <slot></slot>
    </div>
  </li>
</template>

<style scoped>
.list-item {
  @apply flex relative flex-row w-full overflow-hidden;
}

.list-item-disabled {
  @apply absolute h-full w-full z-1 bg-gray-100 opacity-60;
}

.list-item-content {
  @apply flex flex-row w-full py-4 pr-4;
  padding-left: v-bind(paddingLeft);
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
