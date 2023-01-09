import {onMessage, sendMessage} from 'webext-bridge'
import {isFirefox} from "~/env"
import {WebNavigation} from "webextension-polyfill"
import {trackUrlChanges} from "~/contentScripts/utils/utils"
import {handleJobList, handleSingleJob} from "~/contentScripts/modules/jobs/linkedin"
import {userSettings} from "~/logic"


const onPageLoad = async () => {
	const {userExperience, showFabButton, filterNonJunior, ...jobSettings} = userSettings.value.jobs
	const someJobSettingIsOn = Object.values(jobSettings).some(value => value)
	
	if (someJobSettingIsOn)
		if (document.location.origin === 'https://www.linkedin.com') {
			if (document.location.pathname.includes('/jobs/search/') || document.location.pathname.includes('/jobs/collections'))
				await handleJobList()
			
			
			if (document.location.pathname.includes('/jobs/view'))
				await handleSingleJob()
		}
}


const setStyleElement = () => {
	const oldStyleEl = document.querySelector('#jobs-seeker-styles')
	
	if (oldStyleEl) {
		oldStyleEl.remove()
	}
	
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
	onMessage('auto-fill', async () => {
		await triggerAutoFill()
	})
	
	setStyleElement()
	
	window.addEventListener('load', () => {
		onPageLoad()
	})
	
	trackUrlChanges(() => {
		onPageLoad()
	})
})()
