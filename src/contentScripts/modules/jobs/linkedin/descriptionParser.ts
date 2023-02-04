import {sendMessage} from "webext-bridge";

export interface DescriptionObject {
	attributes: {
		start: number
		length: number
		type: { $type: keyof typeof attributesTypesMap }
	}[]
	text: string
}

const attributesTypesMap = {
	'com.linkedin.pemberly.text.LineBreak': 'breakLine',
	'com.linkedin.pemberly.text.ListItem': 'breakLine',
	'com.linkedin.pemberly.text.Bold': '',
	'com.linkedin.pemberly.text.Paragraph': 'paragraph'
} as const

export const linkedinJobDescriptionParser = (descriptionObject: DescriptionObject) => {
	const description = descriptionObject
		.text
		.replaceAll('&amp;', '&')
		.replaceAll(/&*;/g, ' ')
	let lastLineBreakIndex = 0
	
	return descriptionObject.attributes.map(attribute => {
		const attributeType = attributesTypesMap[attribute.type.$type]
		
		if (attributeType === 'breakLine') {
			const endIndex = attribute.start + attribute.length
			const substring = description
				.substring(lastLineBreakIndex, endIndex)
			lastLineBreakIndex = endIndex
			return substring
		}
		
		if (attributeType === 'paragraph') {
			const endIndex = attribute.start + attribute.length
			const subString = description.substring(attribute.start, endIndex)
			lastLineBreakIndex = endIndex
			return subString
		}
		
		return ''
	}).filter(line => line.length > 0)
}

export const extractJobDescription = async (jobId: string) => {
	const jobDetailsResponse = await sendMessage('get-linkedin-job-details', {jobId})
	
	if (jobDetailsResponse.status === 'failed') throw 'an error occurred while getting job details from linkedin server'
	
	return linkedinJobDescriptionParser(jobDetailsResponse.jobDetails.data.description).join('\n')
}
