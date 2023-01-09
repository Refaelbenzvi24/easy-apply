import parser from './parser';
import compiler from './compiler';
import {Options} from "./types";
import {isNumeric} from "~/contentScripts/modules/wordsToNumbers/util";

export function wordsToNumbers(text: string, options: Options = {impliedHundreds: false}) {
	const regions = parser(text, options);
	if (!regions.length) return text;
	const compiled = compiler({text, regions});
	
	if (isNumeric(compiled)) return Number(compiled)
	
	return compiled
}

export default wordsToNumbers;
