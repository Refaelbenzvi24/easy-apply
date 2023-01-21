import {AddJobInfoParams} from "~/contentScripts/modules/jobs/linkedin/index";

export const nonJuniorJobTitles = ["senior", "technology director", "cto", "sr", "team lead", "tech lead", "chief", "architect", "teamlead"]

export const jobListParams: AddJobInfoParams = {
	paragraphData: {
		destinationSelector: '.artdeco-entity-lockup__caption'
	},
	isJobList: true,
	titleSelector: 'a.job-card-list__title',
	technologiesContainerSelector: 'div.job-card-container--clickable'
}

export const singleJobParams: AddJobInfoParams = {
	paragraphData: {
		destinationSelector: 'body > div.application-outlet > div.authentication-outlet > div > div.job-view-layout.jobs-details > div.grid > div > div:nth-child(1) > div > div > div.p5',
		insertBefore: 'body > div.application-outlet > div.authentication-outlet > div > div.job-view-layout.jobs-details > div.grid > div > div:nth-child(1) > div > div > div.p5 > div.mt5.mb2'
	},
	isJobList: false,
	titleSelector: 'body > div.application-outlet > div.authentication-outlet > div > div.job-view-layout.jobs-details > div.grid > div > div:nth-child(1) > div > div > div.p5 > h1',
	technologiesContainerSelector: 'body > div.application-outlet > div.authentication-outlet > div > div.job-view-layout.jobs-details > div.grid > div > div:nth-child(1) > div > div > div.p5'
}
