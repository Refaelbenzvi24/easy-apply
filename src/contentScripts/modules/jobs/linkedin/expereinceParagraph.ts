import {waitForElmExistent} from "~/contentScripts/utils/utils";
import {userSettings} from "~/logic";

const skeletonClasses = "job-card-container__ghost-placeholder job-card-container__ghost-placeholder--small"
const experienceParagraphClasses = "easy-apply-experience"

export const setExperienceParagraphStyle = (jobExperience: number | string | null, isJobRelevant: boolean, paragraphElement?: HTMLParagraphElement) => {
	if (!paragraphElement) return;
	
	paragraphElement.className = experienceParagraphClasses
	
	if (!isJobRelevant) {
		paragraphElement.style["color"] = "red"
		paragraphElement.textContent = jobExperience === null ? 'Not mentioned' : `${jobExperience} years of experience required - not relevant`
	}
	
	if (isJobRelevant) {
		paragraphElement.style["color"] = jobExperience === null ? "orange" : "green"
		paragraphElement.textContent = jobExperience === null ? 'Not mentioned' : `${jobExperience} years of experience required`
	}
}

const handleParagraphElementInserting = (
	insertBeforeElement: Element | undefined,
	parent: Element,
	insertBefore: Element | string | undefined,
	paragraphElement: Element
) => {
	if (!userSettings.value.jobs.showExperience) return;
	
	if (insertBeforeElement instanceof Element) parent.insertBefore(paragraphElement, insertBeforeElement)
	if (!insertBefore) parent.appendChild(paragraphElement)
}

export const addParagraphElement = async (destinationSelector: string, contextElement?: Element, insertBefore?: Element | string) => {
	const destinationElement = (await waitForElmExistent(destinationSelector, contextElement)) as Element
	
	const hasExperienceElement = !!destinationElement.querySelector(`.${experienceParagraphClasses}`)
	
	if (hasExperienceElement) return {}
	
	const paragraphElement = document.createElement("p")
	if (userSettings.value.jobs.showExperience)
		paragraphElement.className = `${experienceParagraphClasses} ${skeletonClasses}`
	
	const insertBeforeElement = (typeof insertBefore === 'string' ? await waitForElmExistent(insertBefore, contextElement) : insertBefore) as Element
	
	handleParagraphElementInserting(insertBeforeElement, destinationElement, insertBefore, paragraphElement)
	
	return {paragraphElement, parent: destinationElement, insertBeforeElement}
}
