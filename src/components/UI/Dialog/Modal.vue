<script setup lang="ts">
import Backdrop from "~/components/UI/Backdrop/Backdrop.vue";
import Card from "~/components/UI/Card/Card.vue";

const props = withDefaults(defineProps<{
  height?: string
  width?: string
  modelValue: boolean
}>(), {
  height: "300px",
  width: "600px"
})

const emit = defineEmits<{
  (e: 'backdropClick'): void
}>()
</script>

<template>
  <Teleport to="#root-portal">
    <Transition>
      <div v-if="modelValue" class="modal-wrapper">
        <backdrop
            @click="emit('backdropClick')"
            :modelValue="modelValue"/>
        <Transition name="modal-card" appear>
          <card
              class="modal-card h-full w-full overflow-hidden rounded-md"
              :width="width"
              :height="height">
            <slot></slot>
          </card>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-wrapper {
  @apply fixed flex h-full w-full justify-center items-center;
  scale: 100%;
}

.modal-card {
  z-index: 1300;
}

.modal-card-enter-from,
.modal-card-leave-active {
  scale: 90%;
}


.modal-card-enter-active,
.modal-card-leave-active {
  transition: all 200ms;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 200ms ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
