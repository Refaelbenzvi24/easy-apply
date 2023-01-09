import axios, {AxiosResponse} from "axios";

const requestsQueue: (() => void)[] = []
const REQUESTS_DELAY = 1000
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

export const getPage = (pageUrl: string): Promise<AxiosResponse> => new Promise((resolve) => {
	if (!delayHandlerIsWorking) delayHandler()
	
	requestsQueue.push(async () => {
		return resolve(await axios.get(pageUrl))
	})
})
