<script setup lang="ts">
import {
  autofillFields,
} from '~/logic/storage'

const addField = () => {
  autofillFields.value = [...autofillFields.value, {value: '', name: ''}]
}

const removeField = (fieldIndex: number) => {
  autofillFields.value = autofillFields.value.filter((field, index) => index !== fieldIndex)
}
</script>

<template>
  <main class="flex flex-col justify-center px-4 py-10 text-center text-gray-700 dark:text-gray-200">
    <img src="/assets/icon.svg" class="icon-btn mx-auto text-2xl w-10 h-10" alt="extension icon">
    <div>Options</div>
    <h4 class="text-xl">Fields to Autofill:</h4>

    <div class="flex flex-col justify-center mx-auto">
      <div class="flex flex-row justify-between">
        <label class="flex">Field Name</label>
        <label class="flex">Autofill Value</label>
        <label class="flex"></label>
      </div>
      <div v-for="(item, index) in autofillFields" class="flex flex-row space-x-4">
        <section class="flex flex-col px-2 mt-2">
          <input v-model="item.name" class="border border-gray-400 rounded">
        </section>

        <section class="flex flex-col px-2 mt-2 w-60">
          <input v-model="item.value" class="border border-gray-400 rounded">
        </section>

        <button class="text-red" @click="removeField(index)">remove</button>
      </div>

      <button class="p-2 mx-auto" @click="addField">Add field</button>
    </div>

    <div class="mt-4">
      Powered by Vite
      <pixelarticons-zap class="align-middle inline-block"/>
    </div>
  </main>
</template>
