import {userData} from "~/logic";

export const trackStats = (isRelevant: boolean | null, jobId: string) => {
	if (!(isRelevant !== null && !userData.value.jobsSeen.includes(jobId))) return;
	
	userData.value.jobsSeen.push(jobId)
	
	if (!isRelevant) userData.value.stats.nonRelevantPositions += 1
	if (isRelevant) userData.value.stats.relevantPositions += 1
}
