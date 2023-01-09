<script setup lang="ts">
import Chip from "~/components/UI/Chip/Chip.vue";

const props = defineProps<{
  modelValue: string[]
  clearable?: boolean
  clearableChips?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string[]): void
  (e: 'onkeydown.enter', event: Event & { target: HTMLInputElement }): void
  (e: 'clear'): void
}>()

const attrs = useAttrs()
const inputValue = ref('')
const deleteCounter = ref(0)

const handleEnterKeyDown = (event: Event & { target: HTMLInputElement }) => {
  const hasOnChangeListener = attrs && !!attrs.onKeydown
  const inputNotEmpty = event.target.value !== ''

  if (hasOnChangeListener && inputNotEmpty) emit('onkeydown.enter', event)
  if (!hasOnChangeListener && inputNotEmpty) props.modelValue?.push(event.target.value)
  event.target.value = ''
}

const handleChipClear = (index: number) => props.modelValue.splice(index, 1)


const removeLastChip = (event: KeyboardEvent) => {
  if (event.key === 'Backspace' && deleteCounter.value > 1) props.modelValue.splice(props.modelValue.length - 1, 1)
  if (deleteCounter.value === 1) deleteCounter.value = 2
}


const handleDelete = (event: Event & { target: HTMLInputElement }) => {
  if (event.target.value === '') {
    deleteCounter.value = 1
    event.target.blur()
    document.addEventListener('keydown', removeLastChip)
  }
}

const handleClear = () => emit('clear')

const updateValue = (value: string[]) => emit('update:modelValue', value)

watch(deleteCounter, () => {
  const disableModeOff = () => {
    deleteCounter.value = 0
    document.removeEventListener('focusin', disableModeOff)
    document.removeEventListener('keydown', removeLastChip)
  }

  if (deleteCounter.value > 0)
    document.addEventListener('focusin', disableModeOff)
})
</script>

<template>
  <div class="combobox">
    <div class="combobox-selections">
      <chip
          class="combobox-chip"
          v-for="(chip, index) in modelValue"
          :clearable="clearableChips"
          @clear="handleChipClear(index)"
          :value="chip"
          :key="chip"/>
      <input
          v-bind="$attrs"
          :value="inputValue"
          @focus="deleteCounter = false"
          @keydown.enter="handleEnterKeyDown"
          @keydown.delete="handleDelete"
          class="combobox-input"/>
    </div>

    <button
        @click="handleClear"
        v-if="clearable && modelValue.length > 0">
      <mdi-clear-circle/>
    </button>
  </div>
</template>


<style scoped lang="scss">
.combobox {
  @apply flex border px-2 min-h-10 focus:outline-none;
}

.combobox-selections {
  @apply flex flex-wrap;
  flex: 1 1;
}

.combobox-chip {
  @apply m-1;
}

.combobox-input {
  @apply focus:outline-none w-full;
  flex: 1 1;
  background-color: transparent;
}
</style>
