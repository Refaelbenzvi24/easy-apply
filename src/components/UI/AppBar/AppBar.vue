<script setup lang="ts">

</script>

<template>
  <div class="app-bar">
    <slot></slot>
  </div>
</template>


<style scoped>
.app-bar {
  @apply flex flex-row fixed w-full h-15 px-4 items-end bg-gray-100 drop-shadow-md;

  z-index: 1100;
}
</style>
