import {userData, userSettings} from "~/logic"
import {getJobExperience} from "./experience";
import {extractJobDescription} from "./descriptionParser";
import {addParagraphElement, setExperienceParagraphStyle} from "./expereinceParagraph";
import {jobListParams, nonJuniorJobTitles, singleJobParams} from "./constants";
import {trackStats} from "./stats";
import {appendTechnologiesComponent, technologiesFilter} from "./technologies";
import {getPage} from "~/contentScripts/utils/requestsHelper";
import {waitForElmExistent} from "~/contentScripts/utils/utils"

export const checkForNonJuniorTitles = (job: { title: string }) =>
	nonJuniorJobTitles.map(title =>
		job.title.toLowerCase().includes(title)).some(includesTitle => includesTitle)

export const getIsJobRelevant = (job: { title: string, description?: string }, jobExperience?: number | null) => {
	const hasNonJuniorTitles = checkForNonJuniorTitles(job)
	
	const userExperience = Number(userSettings.value.jobs.userExperience)
	
	if (jobExperience === null) return true
	
	return (
		Number(jobExperience) <= userExperience &&
		(!userSettings.value.jobs.filterNonJunior || !hasNonJuniorTitles)
	)
}

const getJobData = (jobHtml: string, jobId: string, jobTitle: string) => {
	const description = extractJobDescription(jobHtml, jobId)
	const {highestValue, experience} = getJobExperience({title: jobTitle, description})
	const technologies = technologiesFilter({title: jobTitle, description})
	const isRelevant = getIsJobRelevant({description, title: jobTitle}, highestValue)
	
	return {description, highestExperienceValue: highestValue, experience, isRelevant, technologies}
}

export const extractJobId = (url: string) => url.split('jobs/view/')[1].split('/')[0]

const getJobDetails = async (titleSelector: string, isJobList: boolean, jobElement?: Element) => {
	const jobTitleEl = (await waitForElmExistent(titleSelector, jobElement)) as Element
	
	const jobTitle = jobTitleEl.innerHTML
	const jobPath = isJobList ? jobTitleEl.attributes.getNamedItem('href')!.value : location.pathname
	const jobId = extractJobId(jobPath)
	const jobHref = isJobList ? `${document.location.origin}/jobs/view/${jobId}` : location.href
	
	return {jobTitle, jobHref, jobId}
}

export const jobRemovalHandler = (jobElement: Element, isRelevant: boolean, highestExperienceValue: number | null) => {
	if (!(userSettings.value.jobs.autoRemoveJobs && highestExperienceValue)) return;
	
	const jobIsRelevantToUser = (
		(highestExperienceValue >= Number(userSettings.value.jobs.userExperience)) &&
		(userSettings.value.jobs.filterNonJunior && isRelevant)
	)
	
	if (!jobIsRelevantToUser) {
		userData.value.stats.positionsRemoved += 1
		jobElement.remove()
	}
}

export interface AddJobInfoParams {
	paragraphData: {
		destinationSelector: string
		contextElement?: Element
		insertBefore?: string
	}
	isJobList: boolean
	titleSelector: string
	technologiesContainerSelector: string
}

export const addJobInfo = async (params: AddJobInfoParams, jobElement: Element = document.documentElement) => {
	const {paragraphData, titleSelector, isJobList, technologiesContainerSelector} = params
	
	const {paragraphElement, insertBeforeElement} =
		await addParagraphElement(paragraphData.destinationSelector, jobElement, paragraphData.insertBefore)
	const {jobId, jobHref, jobTitle} = await getJobDetails(titleSelector, isJobList, jobElement)
	
	const {data: jobHtml}: { data: string } = await getPage(jobHref)
	const {experience, highestExperienceValue, isRelevant, technologies} = getJobData(jobHtml, jobId, jobTitle)
	
	const technologiesContainer = jobElement.querySelector(technologiesContainerSelector)!
	
	trackStats(isRelevant, jobId)
	if (userSettings.value.jobs.showExperience) setExperienceParagraphStyle(experience, isRelevant, paragraphElement)
	if (userSettings.value.jobs.showTechnologies) appendTechnologiesComponent(technologies, technologiesContainer, insertBeforeElement)
	if (userSettings.value.jobs.autoRemoveJobs && isJobList) jobRemovalHandler(jobElement, isRelevant, highestExperienceValue)
}

export const handleSingleJob = async () => await addJobInfo(singleJobParams)

export const handleJobList = async () => {
	const jobsUlEl = (await waitForElmExistent('ul.scaffold-layout__list-container')) as HTMLUListElement
	const observer = new MutationObserver((mutationsList) => {
		mutationsList.forEach((mutation) => {
			mutation.addedNodes.forEach((value) => {
				if (value.nodeName === 'LI' && value instanceof Element) void addJobInfo(jobListParams, value)
			})
		});
	});
	observer.observe(jobsUlEl, {subtree: false, childList: true});
	
	const jobs = jobsUlEl.querySelectorAll('li.ember-view.jobs-search-results__list-item')
	Array.from(jobs).map((job) => void addJobInfo(jobListParams, job))
}
