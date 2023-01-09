<script setup lang="ts">
import Modal from "~/components/UI/Dialog/Modal.vue";

const props = defineProps<{
  modelValue: boolean
  title: string
  message: string
}>()

const emit = defineEmits<{
  (e: 'backdrop-click'): void
  (e: 'confirm'): void
  (e: 'reject'): void
}>()
</script>

<template>
  <modal
      height="fit-content"
      @backdrop-click="emit('backdrop-click')"
      :model-value="modelValue">
    <div class="flex flex-col h-full justify-between overflow-hidden">
      <div class="flex items-center px-4 h-12 w-full bg-orange-400">
        <h3 class="text-4.5 text-white font-600">{{ title }}</h3>
      </div>

      <div class="pt-4 pb-8 px-4 h-full">
        <p class="text-4">
          {{ message }}
        </p>
      </div>

      <div class="flex items-center justify-between px-2 h-12 w-full bg-gray-200">
        <button
            @click="emit('reject')"
            class="bg-red-400 hover:bg-red-500 active:bg-red-600 py-2 px-4 my-2 text-3.5 text-white rounded-sm">
          No
        </button>

        <button
            @click="emit('confirm')"
            class="bg-green-400 hover:bg-green-500 active:bg-green-600 py-2 px-4 my-2 text-3.5 text-white rounded-sm">
          Yes
        </button>
      </div>
    </div>
  </modal>
</template>
