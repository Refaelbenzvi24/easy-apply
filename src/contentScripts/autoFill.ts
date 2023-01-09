import {sendMessage} from "webext-bridge";
import {userData} from "~/logic";

const autoFill = (element: HTMLInputElement, value: string) => {
	if (element.type === 'file') return
	if (element.type === 'submit') return
	
	if (element.value === '') {
		element.focus();
		element.value = value;
		element.dispatchEvent(new Event('change'));
		element.blur();
	}
}

const checkArraysForMatchingSequences = (values: string[], matchesList: string[]) => {
	const checkList = values.map(value => matchesList.map(item => item.includes(value)).includes(true))
	
	return checkList.includes(false)
}

const inputMatchContentType = (element: HTMLInputElement, contentType: string) => {
	const attributes = Array.from(element.attributes)
	
	const identifiers = attributes.map(
		(attribute) => attribute.value.toLowerCase()
		                        .replaceAll('"', "")
		                        .replace(/[^a-zA-Z ]/g, " ").split(" ")
	).flat().filter(attribute => attribute !== "")
	
	const values = contentType.split(" ")
	
	return !checkArraysForMatchingSequences(values, identifiers)
}

const autoFillForm = async () => {
	const inputs = document.querySelectorAll('input')
	const autoFillFields = await sendMessage('get-auto-fill-fields', {}, 'background')
	
	let foundMatch = false
	
	Array.from(inputs).forEach(input => {
		autoFillFields.forEach(field => {
			if (inputMatchContentType(input, field.name)) {
				foundMatch = true
				autoFill(input, field.value)
			}
		})
	})
	
	if (foundMatch) userData.value.stats.autoFilledApplications += 1
}

(async () => {
	await autoFillForm()
})()
