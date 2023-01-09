import {App as VueApp} from "@vue/runtime-core";
import {currentPageJobs} from "~/contentScripts/modules/jobs/linkedin";
import App from "~/contentScripts/views/App.vue";
import {waitForElmExistent} from "~/contentScripts/utils/utils";

let elementsAreInDom = true
let fabButtonContainer: Element | undefined
let fabButton: VueApp<Element> | undefined

const removeNonRelevantJobs = async () => {
	const jobsUlEl = (await waitForElmExistent('ul.scaffold-layout__list-container')) as HTMLUListElement
	
	Array.from(jobsUlEl.children).forEach(child => {
		const jobElementObject = currentPageJobs.filter(job => job.element.id === child.id)[0]!
		if (!jobElementObject.isRelevant)
			child.remove()
	})
	elementsAreInDom = false
}

const recoverJobsToDom = async () => {
	const jobsUlEl = (await waitForElmExistent('ul.scaffold-layout__list-container')) as HTMLUListElement
	Array.from(jobsUlEl.children).forEach(child => child.remove())
	
	currentPageJobs.forEach(job => jobsUlEl.appendChild(job.element))
	elementsAreInDom = true
}


export const addFabButtonToDom = () => {
	fabButtonContainer = document.createElement('div')
	document.body.insertBefore(fabButtonContainer, document.body.firstChild)
	fabButton = createApp(App, {
		callback: () => {
			if (fabButton && fabButton._instance) fabButton._instance.props.tooltipText = (!elementsAreInDom ? 'Remove non relevant jobs' : 'I want to see non relevant jobs as well!')
			if (elementsAreInDom) return removeNonRelevantJobs()
			if (!elementsAreInDom) return recoverJobsToDom()
		},
		showFab: false,
		tooltipText: 'Remove non relevant jobs'
	})
	fabButton.mount(fabButtonContainer)
	
	return fabButton
}
