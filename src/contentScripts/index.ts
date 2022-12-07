/* eslint-disable no-console */
import {onMessage, sendMessage} from 'webext-bridge'
import {createApp} from 'vue'
import App from './views/App.vue'
import {autofillFields} from '~/logic/storage'

const autoFill = (element: HTMLInputElement, value: string) => {
	element.focus();
	element.value = value;
	element.dispatchEvent(new Event('change'));
	element.blur();
}

const checkIfMatches = (values: string[], matchesList: string[]) => {
	const checkList = values.map(value => matchesList.map(item => item.includes(value)).includes(true))
	
	return checkList.includes(false)
}

const inputMatchContentType = (element: HTMLInputElement, contentType: string) => {
	const {id, autocomplete, className, name} = element
	const identifiers = [id, autocomplete, name, className]
	
	const tokenizedIdentifiers = identifiers.map(
		(identifier) => identifier.toLowerCase()
		                          .replaceAll('"', "")
		                          .replace(/[^a-zA-Z ]/g, " ").split(" ")
	).flat().filter(identifier => identifier !== "")
	
	const values = contentType.split(" ")
	
	return !checkIfMatches(values, tokenizedIdentifiers)
}

const autoFillForm = () => {
	const inputs = document.querySelectorAll('input')
	
	let amountOfFieldInputs = 0
	
	inputs.forEach(input => {
		autofillFields.value.forEach(field => {
			if (inputMatchContentType(input, field.name)) {
				amountOfFieldInputs += 1
				autoFill(input, field.value)
			}
		})
	})
	
	return amountOfFieldInputs
}


// Firefox `browser.tabs.executeScript()` requires scripts return a primitive value
(() => {
	onMessage('fill-form', async () => {
		console.log('fill-form')
		window.addEventListener("load", async () => {
			const amountOfFieldInputs = autoFillForm()
			
			const currentTab = (await browser.tabs.query({
				active: true,
				currentWindow: true
			}))[0]
			
			const currentTabId = currentTab.id as number
			
			if (amountOfFieldInputs === 0) await browser.tabs.remove(currentTabId)
		})
	})
	
	onMessage('auto-fill', async () => {
		const iframes = Array.from(document.querySelectorAll('iframe'))
		
		console.log('auto-fill')
		for (const iframe of iframes) {
			const {id, className, name} = iframe
			
			const iframeTypeIdentifiers = [id, className, name]
			
			const tokenizedIdentifiers = iframeTypeIdentifiers.map((identifier) =>
				identifier.toLowerCase()
				          .replaceAll('"', "")
				          .replace(/[^a-zA-Z ]/g, " ").split(" ")
			).flat().filter(identifier => identifier !== "")
			
			const possibleIframeFormKeywords = ['apply', 'form']
			
			const isJobFormIframe = !checkIfMatches(possibleIframeFormKeywords, tokenizedIdentifiers)
			
			if (iframe.src && isJobFormIframe) {
				const response = await sendMessage('create-tab', {url: iframe.src}, 'background')
				
				if (response.status === 'succeed') {
					return sendMessage('fill-form', {}, {
						tabId: response.tab.id,
						context: 'content-script'
					})
				}
			}
		}
		
		
		autoFillForm()
	})
	
	// mount component to context window
	const container = document.createElement('div')
	const root = document.createElement('div')
	const styleEl = document.createElement('link')
	const shadowDOM = container.attachShadow?.({mode: __DEV__ ? 'open' : 'closed'}) || container
	styleEl.setAttribute('rel', 'stylesheet')
	styleEl.setAttribute('href', browser.runtime.getURL('dist/contentScripts/style.css'))
	shadowDOM.appendChild(styleEl)
	shadowDOM.appendChild(root)
	document.body.appendChild(container)
	createApp(App).mount(root)
})()
