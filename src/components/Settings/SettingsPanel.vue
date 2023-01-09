<script setup lang="ts">
import Card from "~/components/UI/Card/Card.vue";
import Divider from "~/components/UI/Divider/Divider.vue";
import {SettingsObject} from "~/logic/settings/types";
import SettingItem from "~/components/Settings/SettingItem.vue";

const props = defineProps<{
  settings: SettingsObject[]
  title?: string
}>()
</script>

<template>
  <div v-if="title" class="flex justify-between items-end px-6">
    <h5 class="text-4.5 font-700">{{ title }}</h5>
  </div>
  <div class="px-2">
    <card
        class="mt-1 rounded-lg drop-shadow-md"
        width="100%" height="fit-content">
      <list>
        <template v-for="(setting, index) in settings" :key="index">
          <setting-item
              :index="index"
              :setting="setting"/>
          <divider
              v-if="index !== settings.length - 1"/>
        </template>
      </list>
    </card>
  </div>
</template>
