<script setup lang="ts">
import 'uno.css'

const props = defineProps<{
  showFab: boolean
  callback: () => void
  tooltipText: string
}>()
</script>

<template>
  <div class="fixed left-0 bottom-0 m-5 z-100 flex font-sans select-none leading-1em">
    <div
        v-if="showFab"
        class="flex w-20 h-20 rounded-full shadow cursor-pointer fab"
        bg="teal-600 hover:teal-700"
        @click="callback">
      <pixelarticons-power class="block m-auto text-white text-xl"/>
    </div>

    <span
        class="loader"
        v-if="!showFab"/>

    <div
        class="bg-white text-gray-800 rounded-full shadow w-max h-min fab-tooltip"
        id="fab-tooltip"
        p="x-4 y-2"
        m="y-auto l-2"
        transition="opacity duration-300">
      {{ tooltipText }}
    </div>
  </div>
</template>

<style scoped lang="scss">
.fab-tooltip {
  visibility: hidden;
}

.fab:hover + .fab-tooltip {
  visibility: visible;
}

.loader {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: inline-block;
  border-top: 3px solid #7c7c7c;
  border-right: 3px solid transparent;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;
}

@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
