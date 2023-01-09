export const technologiesInitialValue = [
	"Prisma",
	"C#",
	".Net",
	"PHP",
	"Laravel",
	"C++",
	"Java ",
	"Spring",
	"Django",
	"Nginx",
	"Kubernetes",
	"Angular",
	"React",
	"Vue",
	'JS',
	"HTML",
	"CSS",
	"Tailwind",
	"Emotion",
	"Styled Components",
	"Cloud",
	"Azure",
	"GCP",
	"AWS",
	"Material",
	"Azure",
	"SQL",
	"MYSQL",
	"PostgreSQL",
	"MSSQL",
	"Mongo",
	"Grafana",
	"ElasticSearch",
	"Redis",
	"Kafka",
	"RabbitMQ",
	"TypeScript",
	"JavaScript",
	"Python",
	"React Native",
	"Express",
	"Flask",
	"FastAPI",
	"Jest",
	"Cypress",
	"Git",
	"Docker",
	"Nextjs",
	"Next.js",
	"Nest.js",
	"Nestjs",
	"Node"
]

export const autofillFieldsInitialValue = [
	{
		name: 'full name',
		value: ''
	},
	{
		name: 'first name',
		value: ''
	},
	{
		name: 'last name',
		value: ''
	},
	{
		name: 'email',
		value: ''
	},
	{
		name: 'phone',
		value: ''
	},
	{
		name: 'mobile',
		value: ''
	},
	{
		name: 'linkedin',
		value: '',
	},
	{
		name: 'website',
		value: '',
	},
	{
		name: 'portfolio',
		value: '',
	},
	{
		name: 'github',
		value: '',
	}
]

export const userSettingsInitialValue = {
	jobs: {
		showExperience: true,
		showTechnologies: true,
		technologies: {
			myTechnologies: [],
			advanced: false,
			builtInTechnologies: technologiesInitialValue,
		},
		autoRemoveJobs: false,
		filterNonJunior: false,
		showFabButton: true,
		userExperience: '3'
	}
}


export const userDataInitialValue = {
	stats: {
		relevantPositions: 0,
		nonRelevantPositions: 0,
		positionsRemoved: 0,
		autoFilledApplications: 0
	},
	jobsSeen: [] as string[]
}
