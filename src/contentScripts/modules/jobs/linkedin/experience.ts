import wordsToNumbers from '../../wordsToNumbers/'

const numbersUpTo10 = /(?<![0-9])(([0-9]|10)(?!\.))(?![0-9])/
const n = new RegExp(`((${numbersUpTo10.source})+(?: ?\-? ?(${numbersUpTo10.source})+)?)`)

const experienceRegexArray = [
	new RegExp(`(at.{0,2}.least).${n.source}.*(years|yrs).*(of |with |as )|`),
	new RegExp(`${n.source}.*experience|`),
	new RegExp(`experience.*(in|of|.*).*(!?(in|of|with)).*(${n.source}).*(years|yrs)|`),
	new RegExp(`experience.(${n.source})|`),
	new RegExp(`experience.*of.*${n.source}.(year|yrs)|`),
	new RegExp(`experience:.${n.source}|`),
	new RegExp(`${n.source}.{0,3}(year|yrs).{0,10}(in |of |as |with )`)
]

const experienceRegex = new RegExp(
	experienceRegexArray
		.map(r => r.source)
		.join('')
)


export const filterWordMatches = (matches: string[]) => matches
	.filter(match => match)
	.map(match => {
		const isExperienceMatchInNumbers = match
			.match(/(\d+(?: ?\-? ?\d+)?)/)
			?.map(innerMatch => innerMatch === match)
			.some(match => match)
		
		if (isExperienceMatchInNumbers) return match
	})
	.filter(match => match)[0]!

export const filterExperience = (text: string): string | null => {
	const transformedText = wordsToNumbers(text.toLowerCase())!.toString()
	
	const matches = transformedText.match(experienceRegex)
	
	if (matches !== null) return filterWordMatches(matches)
	
	return null
}

export const getHeightsRangeExperience = (experience: string[]) => {
	const ranges = experience.filter(experience => experience.includes('-'))
	
	if (ranges.length === 1) return {ranges, highestRange: (Number(ranges[0].split('-')[1])), highestRangeIndex: 0}
	
	let highestRange = 0
	let highestRangeIndex = -1
	
	ranges.forEach((range, index) => {
		const currentExperience = Number(range.split('-')[1])
		if (highestRange < currentExperience) {
			highestRange = currentExperience
			highestRangeIndex = index
		}
	})
	
	return {ranges, highestRange, highestRangeIndex}
}

const getHighestNonRangeExperience = (experience: string[]) => {
	const nonRange = experience.filter(experience => !experience.includes('-'))
	return nonRange.length > 0 ? Math.max(...nonRange.map(experience => Number(experience))) : 0
}

export const getJobExperience = (job: { title: string, description: string }) => {
	const sentences = job.description.split("\n").map(line => line.split(/[,|.]/)).flat()
	
	const experience = sentences
		.map(line => filterExperience(line))
		.filter(line => line) as string[]
	
	const {ranges, highestRange, highestRangeIndex} = getHeightsRangeExperience(experience)
	const highestNonRange = getHighestNonRangeExperience(experience)
	
	if (highestRange === 0 && highestNonRange === 0) return {highestValue: null, experience: null}
	
	if (highestRange === highestNonRange || highestRange > highestNonRange)
		return {highestValue: highestRange, experience: ranges[highestRangeIndex]}
	
	return {highestValue: highestNonRange, experience: String(highestNonRange)}
}
