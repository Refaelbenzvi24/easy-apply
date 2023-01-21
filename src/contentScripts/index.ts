import {onMessage, sendMessage} from 'webext-bridge'
import {isFirefox} from "~/env"
import {WebNavigation} from "webextension-polyfill"
import {trackUrlChanges} from "~/contentScripts/utils/utils"
import {handleJobList, handleSingleJob} from "~/contentScripts/modules/jobs/linkedin"
import {userSettings} from "~/logic"
import {getQueryParamValue} from "~/contentScripts/utils/urlUtils";


interface LocationData {
	lastPaginationStartValue: string | null | undefined
}

const locationData: LocationData = {
	lastPaginationStartValue: null
}

const routesHandler = async () => {
	if (location.origin === 'https://www.linkedin.com') {
		if (
			(location.pathname.includes('/jobs/search/') || location.pathname.includes('/jobs/collections'))
			&& location.search.includes('currentJobId')
		) {
			const currentLocationPaginationStartValue = getQueryParamValue('start')
			if (locationData.lastPaginationStartValue === currentLocationPaginationStartValue) return;
			locationData.lastPaginationStartValue = currentLocationPaginationStartValue
			await handleJobList()
		}
		
		if (location.pathname.includes('/jobs/view')) await handleSingleJob()
	}
}

const onPageLoad = () => {
	const {userExperience, showFabButton, filterNonJunior, ...jobSettings} = userSettings.value.jobs
	const isSomeJobSettingOn = Object.values(jobSettings).some(value => value)
	
	if (isSomeJobSettingOn) void routesHandler()
}

const setStyleElement = () => {
	const oldStyleEl = document.querySelector('#jobs-seeker-styles')
	if (oldStyleEl) oldStyleEl.remove()
	
	const styleEl = document.createElement('link')
	styleEl.setAttribute('rel', 'stylesheet')
	styleEl.setAttribute('id', 'jobs-seeker-styles')
	styleEl.setAttribute('href', browser.runtime.getURL('dist/contentScripts/style.css'))
	document.head.appendChild(styleEl)
}


const triggerAutoFill = async () => {
	const {status, tab} = await sendMessage('get-current-tab', {}, 'background')
	
	if (status === 'succeed') {
		const getAllFramesResult = await sendMessage('get-all-frames', {tabId: tab.id as number}, 'background')
		const framesIds = getAllFramesResult.frames.map((frame: WebNavigation.GetAllFramesCallbackDetailsItemType) => frame.frameId)
		
		if (getAllFramesResult.status === 'succeed') {
			await sendMessage('execute-script', {
				target: {
					tabId: tab.id as number,
					frameIds: framesIds
				},
				files: [`${isFirefox ? '' : '.'}/dist/contentScripts/autoFill.global.js`]
			}, 'background')
		}
	}
}


(async () => {
	onMessage('auto-fill', async () => await triggerAutoFill())
	
	setStyleElement()
	
	window.addEventListener('load', onPageLoad)
	trackUrlChanges(onPageLoad)
})()
