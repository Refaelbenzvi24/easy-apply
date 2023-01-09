import {describe, expect, it} from 'vitest'
import {filterExperience, getHeightsRangeExperience, getJobExperience} from '../experience'
import jobsJson from "./data/testCases.json"

describe('experience.ts', () => {
	describe('filterExperience function', () => {
		it('should return null', () => {
			const experience = filterExperience('Plan, design and develop well-engineered, robust, high-quality software solutions')

			expect(experience).toBeNull()
		})

		it('should return null', () => {
			const experience = filterExperience('Proficient in C# and .NET 6')

			expect(experience).toBeNull()
		})

		it('should return relevant experience', () => {
			const experience = filterExperience('At least 3 years of experience with React')

			expect(experience).toBe('3')
		})

		it('should return relevant experience', () => {
			const experience = filterExperience('5+ years of hands-on experience')

			expect(experience).toBe('5')
		})


		it('should return relevant experience', () => {
			const experience = filterExperience('3+ years of development experience in Java.')

			expect(experience).toBe('3')
		})

		it('should return relevant experience', () => {
			const experience = filterExperience('2-3 years of hands-on experience with design, development, deployment, and')

			expect(experience).toBe('2-3')
		})

		it('should return relevant experience', () => {
			const experience = filterExperience('Have 5+ years of React experience building projects from the ground up')

			expect(experience).toBe('5')
		})

		it('should return relevant experience', () => {
			const experience = filterExperience('3-4 years of experience in building web applications')

			expect(experience).toBe('3-4')
		})

		it('should return relevant experience', () => {
			const experience = filterExperience('At least 4 years of experience as a full-stack developer')

			expect(experience).toBe('4')
		})

		it('should return relevant experience', () => {
			const experience = filterExperience('At least four years of experience as a full-stack developer')

			expect(experience).toBe('4')
		})

		it('should return relevant experience', () => {
			const experience = filterExperience('4+ Years of experience in Full-stack development')

			expect(experience).toBe('4')
		})

		it('should return relevant experience', () => {
			const experience = filterExperience('4+ of experience in Full-stack development')

			expect(experience).toBe('4')
		})

		it('should return relevant experience', () => {
			const experience = filterExperience('4yrs of experience')

			expect(experience).toBe('4')
		})

		it('should return relevant experience', () => {
			const experience = filterExperience('4+yrs of experience')

			expect(experience).toBe('4')
		})


		it('should return relevant experience', () => {
			const experience = filterExperience('4+ of experience')

			expect(experience).toBe('4')
		})


		it('should return relevant experience', () => {
			const experience = filterExperience('four+ of experience')

			expect(experience).toBe('4')
		})

		it('should return relevant experience', () => {
			const experience = filterExperience('At least 2 years of PHP Full Stack HO development - MUST')

			expect(experience).toBe('2')
		})
		
		it('should return relevant experience', () => {
			const experience = filterExperience('At-least 2 years of PHP Full Stack HO development - MUST')
			
			expect(experience).toBe('2')
		})
		
		it('should return relevant experience', () => {
			const experience = filterExperience('3+ years of React development experience')
			
			expect(experience).toBe('3')
		})
		
		it('should return relevant experience', () => {
			const experience = filterExperience('Practical experience of 3+ years in SW development with C#/ Web/.Net/Java/Angular')
			
			expect(experience).toBe('3')
		})
		
		it('should return relevant experience', () => {
			const experience = filterExperience('Practical experience in javascript of 3+ years')
			
			expect(experience).toBe('3')
		})
		
		it('should return relevant experience', () => {
			const experience = filterExperience('C# experience 3yrs+')
			
			expect(experience).toBe('3')
		})
		
		it('should return relevant experience', () => {
			const experience = filterExperience('7+ years as a Frontend Software Developer')
			
			expect(experience).toBe('7')
		})
		
		it('should return relevant experience', () => {
			const experience = filterExperience('5+ years of professional backend end development.')
			
			expect(experience).toBe('5')
		})
		
		it('should return relevant experience', () => {
			const experience = filterExperience('At least 2 years as a full stack developer.')
			
			expect(experience).toBe('2')
		})
		
		it('should return relevant experience', () => {
			const experience = filterExperience('Experience: 3 years Priority programming')
			
			expect(experience).toBe('3')
		})
		
		it('should ignore this as experience', () => {
			const experience = filterExperience('we have more than 40 years of experience')
			
			expect(experience).toBeNull()
		})
		
		it('should ignore this as experience', () => {
			const experience = filterExperience('3+ years in Full Stack developer using Node.js')
			
			expect(experience).toBe('3')
		})
		
		it('should ignore this as experience', () => {
			const experience = filterExperience('10. Experience working with ORM - advantage.')
			
			expect(experience).toBeNull()
		})
		
		it('should ignore this as experience', () => {
			const experience = filterExperience('At-least 3 years of experience as a software engineer.')
			
			expect(experience).toBe('3')
		})
	})


	describe('getJobExperience function', () => {
		it('should return relevant experience array', () => {
			const experience = getJobExperience(jobsJson.filter(job => job.id === 0)[0])

			expect(experience.experience).toBe('3')
		})

		it('should return relevant experience array', () => {
			const experience = getJobExperience(jobsJson.filter(job => job.id === 1)[0])

			expect(experience.experience).toBe('4')
		})

		it('should return relevant experience array', () => {
			const experience = getJobExperience(jobsJson.filter(job => job.id === 2)[0])

			expect(experience.experience).toBe("2-3")
		})

		it('should return relevant experience array', () => {
			const experience = getJobExperience(jobsJson.filter(job => job.id === 3)[0])

			expect(experience.experience).toBeNull()
		})

		it('should return relevant experience array', () => {
			const experience = getJobExperience(jobsJson.filter(job => job.id === 4)[0])
			
			expect(experience.experience).toBeNull()
		})

		it('should return relevant experience array', () => {
			const experience = getJobExperience(jobsJson.filter(job => job.id === 5)[0])

			expect(experience.experience).toBe('2')
		})

		it('should return relevant experience array', () => {
			const experience = getJobExperience(jobsJson.filter(job => job.id === 6)[0])

			expect(experience.experience).toBeNull()
		})

		it('should return relevant experience array', () => {
			const experience = getJobExperience(jobsJson.filter(job => job.id === 7)[0])

			expect(experience.experience).toBe('3')
		})

		it('should return relevant experience array', () => {
			const experience = getJobExperience(jobsJson.filter(job => job.id === 8)[0])

			expect(experience.experience).toBeNull()
		})

		it('should return relevant experience array', () => {
			const experience = getJobExperience(jobsJson.filter(job => job.id === 9)[0])

			expect(experience.experience).toBe('3')
		})

		it('should return relevant experience array', () => {
			const experience = getJobExperience(jobsJson.filter(job => job.id === 10)[0])

			expect(experience.experience).toBe('3')
		})

		it('should return relevant experience array', () => {
			const experience = getJobExperience(jobsJson.filter(job => job.id === 11)[0])

			expect(experience.experience).toBe('2')
		})

		it('should return relevant experience array', () => {
			const experience = getJobExperience(jobsJson.filter(job => job.id === 12)[0])

			expect(experience.experience).toBeNull()
		})

		it('should return relevant experience array', () => {
			const experience = getJobExperience(jobsJson.filter(job => job.id === 13)[0])

			expect(experience.experience).toBe('2')
		})

		it('should return relevant experience array', () => {
			const experience = getJobExperience(jobsJson.filter(job => job.id === 14)[0])

			expect(experience.experience).toBe('3')
		})
		
		it('should return relevant experience array', () => {
			const experience = getJobExperience(jobsJson.filter(job => job.id === 15)[0])

			expect(experience.experience).toBe('3')
		})
	})


	describe('getHeightsExperienceRange function', () => {
		it('should return the highest experience', () => {
			const experience = getHeightsRangeExperience(["2-3", "1-2", "0-1"])

			expect(JSON.stringify(experience)).toBe(`{"ranges":["2-3","1-2","0-1"],"highestRange":3,"highestRangeIndex":0}`)
		})

		it('should return the highest experience', () => {
			const experience = getHeightsRangeExperience(["4-5", "3-5", "2-6"])

			expect(JSON.stringify(experience)).toBe(`{"ranges":["4-5","3-5","2-6"],"highestRange":6,"highestRangeIndex":2}`)
		})
	})
})
