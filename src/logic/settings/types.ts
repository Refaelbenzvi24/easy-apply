import {userSettingsInitialValue} from "~/logic/constant"
import {ValidationOptions} from "~/logic/validations/types";

type Join<K, P> = K extends string | number ?
	P extends string | number ?
		`${K}${"" extends P ? "" : "."}${P}`
		: never : never;

type Prev = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
	11, 12, 13, 14, 15, 16, 17, 18, 19, 20, ...0[]]

export type Paths<T, D extends number = 10> = [D] extends [never] ? never : T extends object ?
	{
		[K in keyof T]-?: K extends string | number ?
		`${K}` | Join<K, Paths<T[K], Prev[D]>>
		: never
	}[keyof T] : ""

type Leaves<T, D extends number = 10> = [D] extends [never] ? never : T extends object ?
	{ [K in keyof T]-?: Join<K, Leaves<T[K], Prev[D]>> }[keyof T] : "";

export type ConditionObject<T extends string, FirstItem extends boolean> =
	FirstItem extends true ? {
		key: T
	} : {
		key: T
		operator: 'OR' | 'AND'
	}

export type DependsOnArray<T extends string> = [
	ConditionObject<T, true>,
	...ConditionObject<T, false>[]
]

export interface SettingsObject {
	title: string
	description?: string
	type: 'toggle' | 'input' | 'combobox'
	inputAdditionalAttributes?: Partial<HTMLInputElement>
	required?: boolean
	subSettings?: SettingsObject[]
	hideWhenDisabled?: boolean
	dependsOn?: DependsOnArray<Paths<typeof userSettingsInitialValue>>
	validation?: ValidationOptions[]
	value: Paths<typeof userSettingsInitialValue>
}
