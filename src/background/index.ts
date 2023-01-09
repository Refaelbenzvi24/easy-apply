import browser from 'webextension-polyfill'
import {onMessage} from 'webext-bridge'
import {isFirefox, isForbiddenUrl} from '~/env'
import {autofillFields} from "~/logic"

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

onMessage('execute-script', ({data}) => {
	browser.scripting.executeScript(data).catch((error) => {
		console.log(error)
	})
})


onMessage('get-current-tab', async () => {
	try {
		const tab = (await browser.tabs.query({active: true, currentWindow: true}))[0]
		return {
			status: 'succeed',
			tab: tab
		}
	} catch (error) {
		return {
			status: 'failed'
		}
	}
})

onMessage('get-all-frames', async ({data}) => {
	try {
		return {
			status: 'succeed',
			frames: await browser.webNavigation.getAllFrames({tabId: data.tabId})
		}
	} catch (error) {
		return {
			status: 'failed'
		}
	}
})

onMessage('create-tab', async ({data}) => {
	try {
		const tab = await browser.tabs.create({url: data.url})
		return {
			status: 'succeed',
			tab
		} as const
	} catch {
		return {
			status: 'failed'
		} as const
	}
})
