<script setup lang="ts">
import {useToggle} from "@vueuse/core";
import Divider from "~/components/UI/Divider/Divider.vue";

const [value, toggle] = useToggle(false)

const props = defineProps<{
  title: string
}>()
</script>


<template>
  <button @click="toggle()"
          class="accordion">
    <span class="flex flex-row">
      {{ title }}
    </span>
  </button>

  <divider class="mb-4"/>

  <div
      class="panel"
      :class="value ? 'h-full' : 'h-0'">
    <slot></slot>
  </div>
</template>


<style scoped>
.accordion {
  cursor: pointer;
  display: inline-block;
  padding: 18px;
  width: 100%;
}

.panel {
  padding: 0 18px;
  background-color: white;
  overflow-y: scroll;
  transition-property: all;
  transition-duration: 600ms;
  transition-timing-function: ease-in-out;
}
</style>
