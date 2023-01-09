import {DependsOnObject, Paths, SettingsObject} from "~/logic/settings/types";
import {userSettingsInitialValue} from "~/logic/constant";
import {getObjectAt} from "~/logic/utils";
import {userSettings} from "~/logic";

const checkDependsOn = (lastState: boolean, itemsToCheck: DependsOnObject<Paths<typeof userSettingsInitialValue>, false>[]): boolean => {
	if (itemsToCheck.length === 0) return lastState
	
	const [currentItem, ...restItems] = itemsToCheck
	const currentItemValue = getObjectAt(userSettings.value, currentItem.key)
	const currentState = currentItem.operator === 'OR' ? lastState || currentItemValue : lastState && currentItemValue
	
	return checkDependsOn(currentState, restItems)
}


export const isSettingDisabled = (setting: SettingsObject) => {
	if (!setting.dependsOn) return false
	
	const [first, ...rest] = setting.dependsOn
	const firstItemValue = getObjectAt(userSettings.value, first.key)
	return !checkDependsOn(firstItemValue, rest)
}
