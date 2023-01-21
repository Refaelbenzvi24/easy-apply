import {userSettings} from "~/logic";
import JobTechnologiesComponent from "~/components/JobTechnologies.vue";

const technologiesContainerClasses = "easy-apply-technologies"

export const technologiesFilter = (job: { title: string, description: string }) => {
	const technologiesList = [
		...userSettings.value.jobs.technologies.myTechnologies,
		...userSettings.value.jobs.technologies.builtInTechnologies
	]
	
	return technologiesList.filter(technology =>
		job.description
		   .toLowerCase()
		   .includes(technology.toLowerCase())
		||
		job.title
		   .toLowerCase()
		   .includes(technology.toLowerCase())
	)
}

export const appendTechnologiesComponent = (technologies: string[], parent: Element, insertBefore?: Element) => {
	const hasTechnologiesContainer = !!parent.querySelector(`.${technologiesContainerClasses}`)
	if (hasTechnologiesContainer) return;
	
	const container = document.createElement('div')
	container.className = technologiesContainerClasses
	
	const app = createApp(JobTechnologiesComponent, {technologies})
	if (insertBefore) parent.insertBefore(container, insertBefore)
	if (!insertBefore) parent.appendChild(container)
	
	app.mount(container)
}
