import {beforeEach, describe, expect, it} from "vitest";
import fs from "fs";
import {JSDOM} from "jsdom";

import {DescriptionObject, extractJobDescription, linkedinJobDescriptionParser} from "../descriptionParser";
import {description as descriptionObject_3331088044} from "./data/linkedinJobDescriptionParser/jobData.3331088044.json"
import {description as descriptionObject_3372582342} from "./data/linkedinJobDescriptionParser/jobData.3372582342.json"
import {description_3331088044, description_3372582342} from "./data/linkedinJobDescriptionParser/descriptionResult.json"
import {job_3331088044, job_3372582342} from "./data/extractJobDescription/results.json"


describe('utils.ts', () => {
	describe('linkedinJobDescriptionParser function', () => {
		it('should return description with line breaks', () => {
			const result = linkedinJobDescriptionParser(descriptionObject_3331088044 as DescriptionObject)
			
			expect(JSON.stringify(result)).toBe(JSON.stringify(description_3331088044))
		})
		
		it('should return description with line breaks', () => {
			const result = linkedinJobDescriptionParser(descriptionObject_3372582342 as DescriptionObject)
			
			
			expect(JSON.stringify(result)).toBe(JSON.stringify(description_3372582342))
		})
	})
	
	describe('extractJobDescription function', () => {
		beforeEach(() => {
			const dom = new JSDOM()
			Object.defineProperty(global, 'global', dom.window.document)
			Object.defineProperty(global, 'window', dom.window)
		})
		
		it('should return description with right line breaks for job 3331088044', () => {
			const html = fs.readFileSync(`${__dirname}/data/extractJobDescription/jobView.3331088044.html`, {encoding: 'utf-8'})
			const jobId = `3331088044`
			const jobDescription = extractJobDescription(html, jobId)
			
			expect(JSON.stringify(jobDescription)).toBe(JSON.stringify(job_3331088044))
		})
		
		it('should return description with right line breaks for job 3372582342', () => {
			const html = fs.readFileSync(`${__dirname}/data/extractJobDescription/jobView.3372582342.html`, {encoding: 'utf-8'})
			const jobId = `3372582342`
			const jobDescription = extractJobDescription(html, jobId)
			
			expect(JSON.stringify(jobDescription)).toBe(JSON.stringify(job_3372582342))
		})
	})
})
