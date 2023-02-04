export type ConditionObject<FirstItem extends boolean> =
	FirstItem extends true ? {
		condition: () => boolean
	} : {
		condition: () => boolean
		operator: 'OR' | 'AND'
	}

export type ConditionArray = [
	ConditionObject<true>,
	...ConditionObject<false>[]
]

const checkConditionArrayRestItems = (lastState: boolean, itemsToCheck: ConditionObject<false>[]): boolean => {
	if (itemsToCheck.length === 0) return lastState
	
	const [currentItem, ...restItems] = itemsToCheck
	const currentItemValue = currentItem.condition()
	const currentState = currentItem.operator === 'OR' ? lastState || currentItemValue : lastState && currentItemValue
	
	return checkConditionArrayRestItems(currentState, restItems)
}

export const checkConditionArray = (conditionArray: ConditionArray) => {
	const [first, ...rest] = conditionArray
	const firstItemValue = first.condition()
	return !checkConditionArrayRestItems(firstItemValue, rest)
}
