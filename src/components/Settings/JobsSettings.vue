<script setup lang="ts">
import {jobsSettings} from "~/logic/settings/jobsSettings";
import SettingsPanel from "~/components/Settings/SettingsPanel.vue";
import ConfirmationDialog from "~/components/Dialogs/ConfirmationDialog.vue";
import {useToggle} from "@vueuse/core";
import {userSettings} from "~/logic";
import {userSettingsInitialValue} from "~/logic/constant";

const [isDialogOpen, toggleIsDialogOpen] = useToggle()

const resetSettings = () => {
  userSettings.value = userSettingsInitialValue
}
</script>

<template>
  <div class="flex flex-col py-20 h-full">
    <div class="flex justify-between items-end px-6">
      <h5 class="text-4.5 font-700">Jobs</h5>

      <button @click="() => toggleIsDialogOpen()">
        Clear
      </button>
    </div>
    <settings-panel
        :settings="jobsSettings"/>

    <confirmation-dialog
        v-model="isDialogOpen"
        title="Clear All - Auto Fill"
        message="Are you sure you want to clear all the settings values?"
        @confirm="() => {
          resetSettings()
          toggleIsDialogOpen()
        }"
        @reject="() => toggleIsDialogOpen()"
        @backdrop-click="toggleIsDialogOpen()"/>
  </div>
</template>
