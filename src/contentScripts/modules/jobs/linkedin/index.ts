import JobTechnologiesComponent from "~/components/JobTechnologies.vue"
import {waitForElmExistent} from "~/contentScripts/utils/utils"
import {userData, userSettings} from "~/logic"
import {getJobExperience} from "~/contentScripts/modules/jobs/linkedin/experience";
import {extractJobDescription} from "~/contentScripts/modules/jobs/linkedin/utils";
import {getPage} from "~/contentScripts/utils/requestsHelper";
import {getQueryParamValue} from "~/contentScripts/utils/urlUtils";

interface JobElementObject {
	element: Element
	isRelevant: boolean
}

export const currentPageJobs: JobElementObject[] = []

interface LocationData {
	lastPaginationStartValue: string | null | undefined
}

const locationData: LocationData = {
	lastPaginationStartValue: null
}

export const technologiesFilter = (job: { title: string, description: string }) => {
	const technologiesList = [
		...userSettings.value.jobs.technologies.myTechnologies,
		...userSettings.value.jobs.technologies.builtInTechnologies
	]
	return technologiesList.filter(technology =>
		job.description
		   .toLowerCase()
		   .includes(technology.toLowerCase())
		||
		job.title
		   .toLowerCase()
		   .includes(technology.toLowerCase())
	)
}

const nonJuniorJobTitles = ["senior", "technology director", "cto", "sr", "team lead", "tech lead", "chief", "architect", "teamlead"]

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


export const extractJobId = (url: string) => url.split('jobs/view/')[1].split('/')[0]

const setExperienceParagraphStyle = (jobExperience: number | string | null, isJobRelevant: boolean, paragraphElement: HTMLParagraphElement) => {
	paragraphElement.className = ""
	
	if (!isJobRelevant) {
		paragraphElement.style["color"] = "red"
		paragraphElement.textContent = jobExperience === null ? 'Not mentioned' : `${jobExperience} years of experience required - not relevant`
	}
	
	if (isJobRelevant) {
		paragraphElement.style["color"] = jobExperience === null ? "orange" : "green"
		paragraphElement.textContent = jobExperience === null ? 'Not mentioned' : `${jobExperience} years of experience required`
	}
}


const getJobData = ({jobHtml, jobId, jobTitle}: { jobHtml: string, jobId: string, jobTitle: string }) => {
	const description = extractJobDescription(jobHtml, jobId)
	const {highestValue, experience} = getJobExperience({title: jobTitle, description})
	const technologies = technologiesFilter({title: jobTitle, description})
	const isRelevant = getIsJobRelevant({description, title: jobTitle}, highestValue)
	
	
	return {description, highestExperienceValue: highestValue, experience, isRelevant, technologies}
}

const appendTechnologiesComponent = (technologies: string[], parent: Element, insertBefore?: Element) => {
	const container = document.createElement('div')
	const app = createApp(JobTechnologiesComponent, {
		technologies
	})
	
	if (insertBefore) parent.insertBefore(container, insertBefore)
	if (!insertBefore) parent.appendChild(container)
	
	app.mount(container)
}

const getJobDetails = async (jobElement: Element) => {
	const jobTitleEl = (await waitForElmExistent('a.job-card-list__title', jobElement)) as HTMLAnchorElement
	
	const jobTitle = jobTitleEl.text
	const jobPath = jobTitleEl.attributes.getNamedItem('href')!.value
	const jobId = extractJobId(jobPath)
	const jobLink = `${document.location.origin}/jobs/view/${jobId}`
	
	return {jobTitle, jobId, jobLink}
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

const addParagraphElement = async (destinationSelector: string, contextElement?: Element, insertBefore?: Element | string) => {
	const paragraphElement = document.createElement("p");
	if (userSettings.value.jobs.showExperience)
		paragraphElement.className = "job-card-container__ghost-placeholder job-card-container__ghost-placeholder--small"
	
	const parent = (await waitForElmExistent(destinationSelector, contextElement)) as HTMLDivElement
	
	const insertBeforeElement = (typeof insertBefore === 'string' ? await waitForElmExistent(insertBefore, contextElement) : insertBefore) as Element
	
	handleParagraphElementInserting(insertBeforeElement, parent, insertBefore, paragraphElement)
	
	return {paragraphElement, parent, insertBeforeElement}
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

const trackStats = (isRelevant: boolean | null, jobId: string) => {
	if (!(isRelevant !== null && !userData.value.jobsSeen.includes(jobId))) return;
	
	userData.value.jobsSeen.push(jobId)
	
	if (!isRelevant) userData.value.stats.nonRelevantPositions += 1
	if (isRelevant) userData.value.stats.relevantPositions += 1
}

export const addJobInfo = async (jobElement: Element) => {
	const {paragraphElement} = await addParagraphElement('.artdeco-entity-lockup__caption', jobElement)
	const {jobTitle, jobId, jobLink} = await getJobDetails(jobElement)
	
	const {data: jobHtml}: { data: string } = await getPage(jobLink)
	const {experience, highestExperienceValue, isRelevant, technologies} = getJobData({jobHtml, jobId, jobTitle})
	
	const clickAbleJobContainer = jobElement.querySelector(('div.job-card-container--clickable')) as HTMLDivElement
	
	trackStats(isRelevant, jobId)
	if (userSettings.value.jobs.showExperience) setExperienceParagraphStyle(experience!, isRelevant, paragraphElement)
	if (userSettings.value.jobs.showTechnologies) appendTechnologiesComponent(technologies!, clickAbleJobContainer)
	
	currentPageJobs.push({
		isRelevant,
		element: jobElement
	})
	
	if (userSettings.value.jobs.autoRemoveJobs) jobRemovalHandler(jobElement, isRelevant, highestExperienceValue!)
}

export const handleJobList = async () => {
	const currentLocationPaginationStartValue = getQueryParamValue('start')
	if (locationData.lastPaginationStartValue === currentLocationPaginationStartValue) return;
	
	locationData.lastPaginationStartValue = currentLocationPaginationStartValue
	const jobsUlEl = (await waitForElmExistent('ul.scaffold-layout__list-container')) as HTMLUListElement
	const jobs = jobsUlEl.querySelectorAll('li.ember-view.jobs-search-results__list-item')
	await Promise.all(Array.from(jobs).map(async (job) => await addJobInfo(job)))
}

const getSingleJobDetails = () => {
	const jobTitleEl = document.querySelector('body > div.application-outlet > div.authentication-outlet > div > div.job-view-layout.jobs-details > div.grid > div > div:nth-child(1) > div > div > div.p5 > h1')!
	const jobId = extractJobId(location.pathname)
	const jobTitle = jobTitleEl.textContent!
	
	return {jobId, jobTitle}
}

export const handleSingleJob = async () => {
	locationData.lastPaginationStartValue = null
	const {paragraphElement, parent, insertBeforeElement} = await addParagraphElement(
		'body > div.application-outlet > div.authentication-outlet > div > div.job-view-layout.jobs-details > div.grid > div > div:nth-child(1) > div > div > div.p5',
		document.documentElement,
		'body > div.application-outlet > div.authentication-outlet > div > div.job-view-layout.jobs-details > div.grid > div > div:nth-child(1) > div > div > div.p5 > div.mt5.mb2'
	)
	
	const {jobId, jobTitle} = getSingleJobDetails()
	const {data: jobHtml}: { data: string } = await getPage(location.href)
	const {experience, isRelevant, technologies} = getJobData({jobHtml, jobId, jobTitle})
	
	trackStats(isRelevant, jobId)
	if (userSettings.value.jobs.showExperience) setExperienceParagraphStyle(experience!, isRelevant, paragraphElement)
	if (userSettings.value.jobs.showTechnologies) appendTechnologiesComponent(technologies!, parent, insertBeforeElement as Element)
}
