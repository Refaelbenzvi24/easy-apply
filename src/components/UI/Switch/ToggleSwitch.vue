<script setup lang="ts">

const props = defineProps<{
  modelValue?: boolean
}>()

const attr = useAttrs()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const updateValue = (event: { target: HTMLInputElement }) => {
  emit('update:modelValue', event.target.checked)
}
</script>

<template>
  <label
      :class="attr.class"
      class="switch">
    <input
        :checked="modelValue"
        @input="updateValue"
        v-bind="attr"
        type="checkbox">
    <span class="slider"></span>
  </label>
</template>

<style scoped>
.switch {
  position: relative;
  display: inline-block;
  width: 43px;
  height: 24px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: .4s;
  transition: .4s;
  border-radius: 34px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  -webkit-transition: .4s;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #2196F3;
}

input:focus + .slider {
  box-shadow: 0 0 1px #2196F3;
}

input:checked + .slider:before {
  -webkit-transform: translateX(18px);
  -ms-transform: translateX(18px);
  transform: translateX(18px);
}
</style>
