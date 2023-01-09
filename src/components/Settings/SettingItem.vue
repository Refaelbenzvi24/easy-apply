<script setup lang="ts">
import ListItem from "~/components/UI/List/ListItem.vue"
import ToggleSwitch from "~/components/UI/Switch/ToggleSwitch.vue"
import TextField from "~/components/UI/Form/TextField.vue"
import {SettingsObject} from "~/logic/settings/types"
import {userSettings} from "~/logic"
import {getObjectAt, setValueAt} from "~/logic/utils"
import {isSettingDisabled} from "~/logic/settings"
import {validate} from "~/logic/validations"
import List from "~/components/UI/List/List.vue";
import Divider from "~/components/UI/Divider/Divider.vue";
import Combobox from "~/components/UI/Form/Combobox.vue";

const props = withDefaults(defineProps<{
  setting: SettingsObject
  index: number
  depth?: number
}>(), {
  depth: 0
})

const onEnterKeyDown = (event: Event & { target: HTMLInputElement }) => {
  const inputValue = event.target.value


  if (props.setting.type === 'combobox' && inputValue !== '')
    setValueAt(userSettings.value, props.setting.value, [...settingValue.value, inputValue])
}

const changeHandler = (event: Event & { target: HTMLInputElement }) => {
  const inputValue = event.target.type === 'checkbox' ? event.target.checked : event.target.value
  const validationSucceed = props.setting.validation ? validate(inputValue, props.setting.validation, event) : true

  if (validationSucceed) setValueAt(userSettings.value, props.setting.value, inputValue)
  if (!validationSucceed) {
    setValueAt(userSettings.value, props.setting.value, settingValue.value)
    event.target.value = props.setting.type !== "combobox" ? settingValue.value : inputValue
  }
}

const inputHandler = (event: Event & { target: HTMLInputElement }) => {
  if (props.setting.type !== 'combobox') {
    const inputValue = event.target.type === 'checkbox' ? event.target.checked : event.target.value

    const validationSucceed = props.setting.validation ? validate(
        inputValue,
        props.setting.validation,
        event) : true

    if (validationSucceed) setValueAt(userSettings.value, props.setting.value, inputValue)
  }
}

const clearValue = (defaultValue: any) => setValueAt(userSettings.value, props.setting.value, defaultValue)

const settingValue = computed(() => getObjectAt(userSettings.value, props.setting.value))
const isDisabled = computed(() => isSettingDisabled(props.setting))
</script>

<template>
  <div
      class="flex flex-col w-full h-full">

    <divider v-if="index === 0 && depth !== 0 && !(setting.hideWhenDisabled && isDisabled)"/>
    <Transition>

      <list-item
          :depth="depth"
          v-if="!(setting.hideWhenDisabled && isDisabled)"
          :disabled="isDisabled"
          class="justify-between">
        <div class="w-full">
          <div class="flex flex-row space-x-2 w-full">
            <strong class="text-4">{{ setting.title }}</strong>
            <span v-if="setting.required" class="text-3 text-red-300 my-auto">∗required</span>
          </div>
          <p
              v-if="setting.description"
              v-for="line in setting.description.split('\n')"
              class="text-3 max-w-[95%]">
            {{ line }}
          </p>

          <div
              class="pt-2"
              v-if="setting.type === 'combobox'">
            <combobox
                @clear="clearValue([])"
                clearable-chips
                v-model="settingValue"/>
          </div>
        </div>

        <div v-if="setting.type !== 'combobox'"
             class="flex justify-end items-center w-30">
          <toggle-switch
              class="mr-2"
              v-if="setting.type === 'toggle'"
              :disabled="isDisabled"
              @input="inputHandler"
              v-bind="setting.inputAdditionalAttributes"
              :checked="settingValue"/>

          <text-field
              v-if="setting.type === 'input'"
              :value="settingValue"
              :disabled="isDisabled"
              @input="inputHandler"
              @change="changeHandler"
              v-bind="setting.inputAdditionalAttributes"
              helper-text="Number: 1-10"/>
        </div>
      </list-item>
    </Transition>

    <div v-if="setting.subSettings && !(setting.type === 'toggle' && !settingValue)">
      <list>
        <template v-for="(subSetting, index) in setting.subSettings" :key="index">
          <setting-item
              :index="index"
              :depth="depth + 1"
              :setting="subSetting"/>
          <divider
              v-if="index !== setting.subSettings?.length - 1"/>
        </template>
      </list>
    </div>
  </div>
</template>

<style scoped>

</style>
