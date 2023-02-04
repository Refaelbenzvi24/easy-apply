import {SettingsObject} from "~/logic/settings/types";
import {userSettingsInitialValue} from "~/logic/constant";

export const jobsSettings: SettingsObject[] = [
	{
		title: 'Show job required experience',
		description: 'Show the required experience for the job if mentioned.',
		type: 'toggle',
		value: 'jobs.showExperience'
	},
	{
		title: 'Show Technologies List',
		description: 'Show the technologies list which included in the job description.',
		type: 'toggle',
		subSettings: [
			{
				type: 'combobox',
				title: 'Technologies list',
				description: 'The technologies to search for, there\'s a built-in list of technologies which can be edited under advanced, ' +
					'if you are missing anything in the list you can add it here, If you feel it\'s necessary free to open an issue on github as well! :)',
				hideWhenDisabled: true,
				dependsOn: [
					{
						key: 'jobs.showTechnologies'
					}
				],
				value: 'jobs.technologies.myTechnologies',
			},
			{
				type: 'toggle',
				title: 'Advanced',
				hideWhenDisabled: true,
				dependsOn: [
					{key: 'jobs.showTechnologies'}
				],
				subSettings: [
					{
						type: 'combobox',
						title: 'Built-in technologies list',
						hideWhenDisabled: true,
						dependsOn: [
							{key: 'jobs.showTechnologies'},
							{key: 'jobs.technologies.advanced', operator: 'AND'}
						],
						value: 'jobs.technologies.builtInTechnologies',
					}
				],
				value: 'jobs.technologies.advanced',
			}
		],
		value: 'jobs.showTechnologies'
	},
	{
		title: 'Auto remove jobs',
		description: 'Automatically remove jobs which aren\'t relevant to you.',
		type: 'toggle',
		value: 'jobs.autoRemoveJobs'
	},
	{
		title: 'Filter non-junior positions',
		description: 'Will mark positions that are not relevant to juniors as not relevant - searches for keywords like senior, team lead, etc...',
		type: 'toggle',
		dependsOn: [
			{key: 'jobs.autoRemoveJobs'},
			{key: 'jobs.showExperience', operator: 'OR'}
		],
		value: 'jobs.filterNonJunior'
	},
	{
		title: 'Show fab button',
		description: 'Show/hides the fab button in the bottom corner of the screen(visible only in relevant sites - currently: linkedin).',
		type: 'toggle',
		dependsOn: [
			{key: 'jobs.autoRemoveJobs'},
			{key: 'jobs.showExperience', operator: 'OR'}
		],
		value: 'jobs.showFabButton'
	},
	{
		title: 'Experience (in years)',
		description: 'Any job with experience higher than this number will be counted as not relevant' +
			'\n' +
			'\nSome Examples(experience = 3 years, required experience = x):' +
			'\nx = 3 - relevant, x = 1-3 - relevant, x = 4 - not relevant, x = 2-4 - not relevant, etc...',
		required: true,
		dependsOn: [
			{key: 'jobs.autoRemoveJobs'},
			{key: 'jobs.showExperience', operator: 'OR'}
		],
		validation: [
			{type: 'enforce-range', min: 0, max: 10},
			{type: 'required', defaultValue: userSettingsInitialValue.jobs.userExperience}
		],
		inputAdditionalAttributes: {
			type: "number",
			pattern: "[1-9]|10",
			required: true,
			min: "1",
			max: "10",
			step: "1"
		},
		type: 'input',
		value: 'jobs.userExperience'
	}
]
