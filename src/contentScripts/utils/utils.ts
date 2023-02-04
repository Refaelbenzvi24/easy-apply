export const waitForElmExistent = (selector: string, element?: Element) => new Promise(resolve => {
	const getElement = () => element ? element.querySelector(selector) : document.querySelector(selector)
	
	if (getElement()) {
		return resolve(getElement());
	}
	
	const observer = new MutationObserver(() => {
		const element = getElement()
		if (element) {
			resolve(element);
			observer.disconnect();
		}
	});
	
	observer.observe(document.body, {
		childList: true,
		subtree: true
	});
})


interface UrlTrackerOptions {
	initialized: boolean
	lastUrl: string
	callbacks: (() => void)[]
}

const urlTrackerData: UrlTrackerOptions = {
	initialized: false,
	lastUrl: location.href,
	callbacks: []
}

export const trackUrlChanges = (onChange: () => void) => {
	urlTrackerData.callbacks.push(onChange)
	
	if (urlTrackerData.initialized) return;
	
	new MutationObserver(() => {
		if (location.href === urlTrackerData.lastUrl) return;
		
		urlTrackerData.lastUrl = location.href
		urlTrackerData.callbacks.forEach(callback => callback())
	}).observe(document, {subtree: true, childList: true})
}


export const onElementVisibleFor = (callback: () => void, {element, timeout}: { element: Element, timeout: number }) => {
	let timer: NodeJS.Timeout
	
	const config = {
		root: null,
		threshold: 0
	};
	
	const observer = new IntersectionObserver((entries) => {
		entries.forEach((entry) => {
			
			if (entry.isIntersecting) {
				timer = setTimeout(() => {
					callback()
				}, timeout);
			} else {
				clearTimeout(timer);
			}
		});
	}, config);
	
	observer.observe(element);
}
