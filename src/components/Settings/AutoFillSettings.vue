<script setup lang="ts">
import {
  autofillFields
} from '~/logic/storage'
import {useToggle} from "@vueuse/core";
import ConfirmationDialog from "~/components/Dialogs/ConfirmationDialog.vue";
import {autofillFieldsInitialValue} from "~/logic/constant";
import TextField from "~/components/UI/Form/TextField.vue";

const [isDialogOpen, toggleIsDialogOpen] = useToggle(false)

const syncFullName = (event: Event & { target: HTMLInputElement }, item: { name: string, value: string }) => {
  autofillFields.value.filter(_item => _item.name === item.name)[0].value = event.target.value

  if (item.name === 'first name')
    return autofillFields.value[0].value = `${event.target.value} ${autofillFields.value[2].value}`


  if (item.name === 'last name')
    return autofillFields.value[0].value = `${autofillFields.value[1].value} ${event.target.value}`
}

const addField = () => {
  autofillFields.value = [...autofillFields.value, {value: '', name: ''}]
}

const clearAll = () => {
  autofillFields.value = autofillFieldsInitialValue
}

const removeField = (fieldIndex: number) => {
  autofillFields.value = autofillFields.value.filter((field, index) => index !== fieldIndex)
}
</script>

<template>
  <div class="flex flex-col h-full">
    <div class="flex flex-row">
      <label class="flex w-40 text-3">Field Name</label>
      <label class="flex w-60 ml-4 text-3">Autofill Value</label>
    </div>
    <div
        v-for="(item, index) in autofillFields"
        class="flex flex-row space-x-4">
      <section class="flex flex-col mt-2 w-40">
        <TextField
            v-model="item.name"
            autocomplete="off"
            :disabled="index === 0 || index <= autofillFieldsInitialValue.length - 1"
            class="text-3.5 h-7 px-1"/>
      </section>

      <section class="flex flex-col mt-2 w-60">
        <text-field
            :value="item.value"
            autocomplete="on"
            :autofocus="index === 1"
            :placeholder="item.name"
            @input="(event) => {
              syncFullName(event, item)
            }"
            :disabled="index === 0"
            class="text-3.5 h-7 px-1"/>
      </section>

      <button
          class="text-red" v-if="index > autofillFieldsInitialValue.length - 1"
          @click="removeField(index)">
        Remove
      </button>
    </div>

    <div class="flex flex-row pt-4 space-x-4">
      <button class="text-white text-3.5 bg-green-400 py-1.5 px-3" @click="addField">Add Field</button>
      <button class="text-white text-3.5 bg-red-400 py-1.5 px-3" @click="toggleIsDialogOpen()">Clear All</button>
    </div>

    <confirmation-dialog
        v-model="isDialogOpen"
        title="Clear All - Auto Fill"
        message="Are you sure you want to clear all the auto fill values?"
        @confirm="() => {
          clearAll()
          toggleIsDialogOpen()
        }"
        @reject="() => toggleIsDialogOpen()"
        @backdrop-click="toggleIsDialogOpen()"/>
  </div>
</template>
