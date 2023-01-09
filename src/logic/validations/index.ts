import {ValidationOptions} from "~/logic/validations/types";

const enforceRange = ({target}: { target: HTMLInputElement }, min: number, max: number) => {
	if (Number(target.value) < min) target.value = String(min)
	if (Number(target.value) > max) target.value = String(max)
	
	return true
}

const required = (value: string | boolean) => !!value;

export const inputValidations = (value: string | boolean,
                                 validationObjects: ValidationOptions[],
                                 event: Event & { target: HTMLInputElement }) =>
	!validationObjects.map(validation =>
		validation.type === 'enforce-range'
			? enforceRange(event, validation.min, validation.max)
			: validation.type === 'required'
				? required(value)
				: true
	).some(succeed => !succeed)

export const validate = (value: string | boolean,
                         validationObjects: ValidationOptions[],
                         event: Event & { target: HTMLInputElement }) => inputValidations(value, validationObjects, event)
