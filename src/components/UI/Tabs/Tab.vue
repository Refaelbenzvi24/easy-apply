<script setup lang="ts">

const props = defineProps<{
  value: string
  activeTab?: string
}>()

const emit = defineEmits(['update:activeTab'])
</script>


<template>
  <button
      class="tab"
      :class="activeTab === value ? 'tab-active' : ''">
    <slot></slot>
  </button>
</template>

<style>
.tab {
  @apply py-2 px-8 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 border-0 text-[0.85rem];
}

.tab-active {
  @apply border-b-1 border-b-black;
}
</style>
