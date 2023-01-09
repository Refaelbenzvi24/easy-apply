export type ValidationTypes = 'enforce-range' | 'required'

export interface ValidationBasic<Type extends ValidationTypes> {
	type: Type
}

interface EnforceRangeValidation extends ValidationBasic<'enforce-range'> {
	min: number
	max: number
}

interface RequiredValidation extends ValidationBasic<'required'> {
	defaultValue: string
}

export type ValidationOptions = EnforceRangeValidation | RequiredValidation
