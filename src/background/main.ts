import {onMessage, sendMessage} from 'webext-bridge'
import type {Tabs} from 'webextension-polyfill'

// only on dev mode
if (import.meta.hot) {
	// @ts-expect-error for background HMR
	import('/@vite/client')
	// load latest content script
	import('./contentScriptHMR')
}

browser.runtime.onInstalled.addListener((): void => {
	// eslint-disable-next-line no-console
	console.log('Extension installed')
})

let previousTabId = 0

// communication example: send previous tab title from background page
// see shim.d.ts for type declaration
browser.tabs.onActivated.addListener(async ({tabId}) => {
	if (!previousTabId) {
		previousTabId = tabId
		return
	}
	
	let tab: Tabs.Tab
	
	try {
		tab = await browser.tabs.get(previousTabId)
		previousTabId = tabId
	} catch {
		return
	}
	
	// eslint-disable-next-line no-console
	console.log('previous tab', tab)
	await sendMessage('tab-prev', {title: tab.title}, {context: 'content-script', tabId})
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

onMessage('get-current-tab', async (message) => {
	try {
		const tab = await browser.tabs.get(previousTabId)
		return {
			title: tab?.title,
		}
	} catch {
		return {
			title: undefined,
		}
	}
})
