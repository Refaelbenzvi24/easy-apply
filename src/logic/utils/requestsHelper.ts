const requestsQueue: (() => void)[] = []
const REQUESTS_DELAY = 600
let delayHandlerIsWorking = false

const delayHandler = () => {
	delayHandlerIsWorking = true
	
	setInterval(() => {
		if (requestsQueue.length > 0) {
			requestsQueue[0]()
			requestsQueue.shift()
		}
	}, REQUESTS_DELAY)
}

export const queueRequest = (url: string, config?: RequestInit): Promise<any> => new Promise((resolve, reject) => {
	if (!delayHandlerIsWorking) delayHandler()
	
	requestsQueue.push(async () => {
		const response = await fetch(url, config)
		
		if (!response.ok) reject(await response.json())
		
		return resolve(await response.json())
	})
})
