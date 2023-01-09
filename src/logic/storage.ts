import {useStorageLocal} from '~/composables/useStorageLocal'
import {autofillFieldsInitialValue, userDataInitialValue, userSettingsInitialValue} from "~/logic/constant";


export const autofillFields = useStorageLocal('autofill-fields', autofillFieldsInitialValue, {listenToStorageChanges: true})
export const userSettings = useStorageLocal('user-settings', userSettingsInitialValue, {listenToStorageChanges: true})
export const userData = useStorageLocal('user-data', userDataInitialValue, {listenToStorageChanges: true})
