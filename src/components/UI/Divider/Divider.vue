<script setup lang="ts">
const props = withDefaults(defineProps<{
  opacity?: `${IntRange<0, 100>}%` | `0.${IntRange<0, 100>}`
}>(), {
  opacity: '30%'
})

</script>


<template>
  <div class="divider"/>
</template>


<style scoped>
.divider {
  @apply flex;
  background: transparent none;
  opacity: v-bind(opacity);
  border-bottom: 1px black solid;
  height: 1px;
  width: 100%;
}
</style>
