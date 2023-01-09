<script setup lang="ts">
import 'uno.css'

const props = defineProps<{
  technologies: string[][]
}>()
</script>

<template>
  <div class="p-1 flex flex-row flex-wrap">
    <p class="bg-blue-300 text-md py-0.5 px-1.5 mx-2 my-1.5 rounded-md whitespace-nowrap" v-for="technology of technologies">
      {{ technology }}
    </p>
  </div>
</template>
