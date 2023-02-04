import browser, {Cookies} from 'webextension-polyfill'
import {onMessage} from 'webext-bridge'
import {isFirefox, isForbiddenUrl} from '~/env'
import {autofillFields} from "~/logic"
import {DescriptionObject} from "~/contentScripts/modules/jobs/linkedin/descriptionParser";
import {queueRequest} from "~/logic/utils/requestsHelper";

browser.runtime.onInstalled.addListener((details): void => {
	if (details.reason === 'install')
		browser.runtime.openOptionsPage()
})


if (process.env.NODE_ENV !== 'production') {
	browser.webNavigation.onCommitted.addListener(async ({tabId, frameId, url}) => {
		if (frameId !== 0)
			return
		
		if (isForbiddenUrl(url))
			return
		
		
		browser.scripting.executeScript({
			files: [`${isFirefox ? '' : '.'}/dist/contentScripts/index.global.js`],
			target: {
				tabId,
				allFrames: true
			}
		}).catch(error => {
			console.log(error)
		})
	})
}

onMessage('get-auto-fill-fields', () => {
	return autofillFields.value
})

onMessage('execute-script', async ({data}) => {
	try {
		await browser.scripting.executeScript(data)
		return {status: 'success'}
	} catch (error) {
		return {status: 'failed'}
	}
})


onMessage('get-current-tab', async () => {
	try {
		const tab = (await browser.tabs.query({active: true, currentWindow: true}))[0]
		return {status: 'succeed', tab: tab}
	} catch (error) {
		return {status: 'failed'}
	}
})

onMessage('get-all-frames', async ({data}) => {
	try {
		return {
			status: 'succeed',
			frames: await browser.webNavigation.getAllFrames({tabId: data.tabId})
		}
	} catch (error) {
		return {status: 'failed'}
	}
})

onMessage('create-tab', async ({data}) => {
	try {
		const tab = await browser.tabs.create({url: data.url})
		
		return {status: 'succeed', tab}
	} catch {
		return {status: 'failed'}
	}
})

const getAllCookies = async () => {
	try {
		const cookies = await browser.cookies.getAll({url: "https://www.linkedin.com"})
		
		return {status: 'succeed', cookies} as const
	} catch {
		return {status: 'failed'} as const
	}
}

onMessage('get-all-cookies', async () => {
	return await getAllCookies()
})

export interface JobResponse {
	data: {
		description: DescriptionObject
	}
}

const getJobDetailsRequestConfig = (cookies: Cookies.Cookie[]) => {
	const csrfToken = cookies.filter(cookie => cookie.name === 'JSESSIONID')[0].value
	const csrfWithRemovedQuotes = csrfToken.substring(1, csrfToken.length - 1)
	
	const headers = new Headers();
	headers.append("authority", "www.linkedin.com");
	headers.append("accept", "application/vnd.linkedin.normalized+json+2.1");
	headers.append("cookie", `"JSESSIONID=\"${csrfWithRemovedQuotes}\";"`);
	headers.append("csrf-token", `${csrfWithRemovedQuotes}`);
	
	const requestOptions: RequestInit = {
		method: 'GET',
		headers,
		redirect: 'follow'
	}
	
	return requestOptions
}

const getJobDetails = async (jobId: string, cookies: Cookies.Cookie[]) => {
	const config = getJobDetailsRequestConfig(cookies)
	
	return await queueRequest(
		`https://www.linkedin.com/voyager/api/jobs/jobPostings/${jobId}?decorationId=com.linkedin.voyager.deco.jobs.web.shared.WebLightJobPosting-23`,
		config
	) as JobResponse
}

onMessage('get-linkedin-job-details', async ({data}) => {
	const {jobId} = data
	
	const getAllCookiesResult = await getAllCookies()
	
	if (getAllCookiesResult.status === 'failed') return {status: 'failed'}
	
	try {
		const jobDetails = await getJobDetails(jobId, getAllCookiesResult.cookies)
		
		return {status: 'success', jobDetails}
	} catch {
		return {status: 'failed'}
	}
})
