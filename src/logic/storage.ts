import {useStorageLocal} from '~/composables/useStorageLocal'


// TODO: remove fields values
export const autofillFieldsInitialValue = [
	{
		name: 'first name',
		value: 'Refael'
	},
	{
		name: 'last name',
		value: 'Ben Zvi'
	},
	{
		name: 'email',
		value: 'refaelbenzvi24@gmail.com'
	},
	{
		name: 'phone',
		value: '0542418018'
	},
	{
		name: 'mobile',
		value: '0542418018'
	},
	{
		name: 'linkedin',
		value: 'https://www.linkedin.com/in/refael-ben-zvi/',
	},
	{
		name: 'website',
		value: 'https://refaelbenzvi.netlify.app',
	},
	{
		name: 'portfolio',
		value: 'https://refaelbenzvi.netlify.app',
	},
	{
		name: 'github',
		value: 'https://github.com/Refaelbenzvi24',
	},
]

export const storageDemo = useStorageLocal('webext-demo', 'Storage Demo', {listenToStorageChanges: true})
export const autofillFields = useStorageLocal('autofill-fields', autofillFieldsInitialValue, {listenToStorageChanges: true})
