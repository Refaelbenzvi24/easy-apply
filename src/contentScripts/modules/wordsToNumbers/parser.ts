import {
	BLACKLIST_SINGULAR_WORDS,
	DECIMALS,
	JOINERS,
	MAGNITUDE_KEYS,
	NUMBER,
	NUMBER_WORDS,
	PUNCTUATION,
	TEN_KEYS,
	TOKEN_TYPE,
	UNIT_KEYS,
} from './constants';
import {Options, Region, SubRegion, Token} from "./types";

const SKIP = 0;
const ADD = 1;
const START_NEW_REGION = 2;
const NOPE = 3;

const canAddTokenToEndOfSubRegion = (subRegion: SubRegion, currentToken: Token, {impliedHundreds}: Options) => {
	const {tokens} = subRegion;
	const prevToken = tokens![0];
	if (!prevToken) return true;
	
	if (
		prevToken.type === TOKEN_TYPE.MAGNITUDE &&
		currentToken.type === TOKEN_TYPE.UNIT
	) return true;
	
	if (
		prevToken.type === TOKEN_TYPE.MAGNITUDE &&
		currentToken.type === TOKEN_TYPE.TEN
	) return true;
	
	if (
		impliedHundreds &&
		subRegion.type === TOKEN_TYPE.MAGNITUDE &&
		prevToken.type === TOKEN_TYPE.TEN &&
		currentToken.type === TOKEN_TYPE.UNIT
	) return true;
	
	if (
		impliedHundreds &&
		subRegion.type === TOKEN_TYPE.MAGNITUDE &&
		prevToken.type === TOKEN_TYPE.UNIT &&
		currentToken.type === TOKEN_TYPE.TEN
	) return true;
	
	if (
		prevToken.type === TOKEN_TYPE.TEN &&
		currentToken.type === TOKEN_TYPE.UNIT
	) return true;
	
	if (
		!impliedHundreds &&
		prevToken.type === TOKEN_TYPE.TEN &&
		currentToken.type === TOKEN_TYPE.UNIT
	) return true;
	
	if (
		prevToken.type === TOKEN_TYPE.MAGNITUDE &&
		currentToken.type === TOKEN_TYPE.MAGNITUDE
	) return true;
	
	if (
		!impliedHundreds &&
		prevToken.type === TOKEN_TYPE.TEN &&
		currentToken.type === TOKEN_TYPE.TEN
	) return false;
	
	return !!(impliedHundreds &&
		prevToken.type === TOKEN_TYPE.TEN &&
		currentToken.type === TOKEN_TYPE.TEN);
};

const getSubRegionType = (subRegion: SubRegion, currentToken: Token) => {
	if (!subRegion) {
		return {type: currentToken.type};
	}
	const prevToken = subRegion.tokens[0];
	const isHundred = (
		(prevToken.type === TOKEN_TYPE.TEN && currentToken.type === TOKEN_TYPE.UNIT) ||
		(prevToken.type === TOKEN_TYPE.TEN && currentToken.type === TOKEN_TYPE.TEN) ||
		(
			prevToken.type === TOKEN_TYPE.UNIT && currentToken.type === TOKEN_TYPE.TEN &&
			NUMBER[prevToken.lowerCaseValue] > 9
		) ||
		(prevToken.type === TOKEN_TYPE.UNIT && currentToken.type === TOKEN_TYPE.UNIT) ||
		(prevToken.type === TOKEN_TYPE.TEN && currentToken.type === TOKEN_TYPE.UNIT && subRegion.type === TOKEN_TYPE.MAGNITUDE)
	);
	if (subRegion.type === TOKEN_TYPE.MAGNITUDE) return {type: TOKEN_TYPE.MAGNITUDE, isHundred};
	if (isHundred) return {type: TOKEN_TYPE.HUNDRED, isHundred};
	return {type: currentToken.type, isHundred};
};

const checkIfTokenFitsSubRegion = (subRegion: SubRegion, token: Token, options: Options) => {
	const {type, isHundred} = getSubRegionType(subRegion, token);
	if (!subRegion) return {action: START_NEW_REGION, type, isHundred};
	if (canAddTokenToEndOfSubRegion(subRegion, token, options)) {
		return {action: ADD, type, isHundred};
	}
	return {action: START_NEW_REGION, type, isHundred};
};

const getSubRegions = (region: Omit<Region, 'subRegions'> | null, options: Options): SubRegion[] => {
	if (region === null) return []
	
	const subRegions = [];
	let currentSubRegion: SubRegion
	
	const tokensCount = region.tokens.length;
	let i = tokensCount - 1;
	while (i >= 0) {
		const token = region.tokens[i];
		const {action, type, isHundred} = checkIfTokenFitsSubRegion(currentSubRegion!, token, options);
		token.type = isHundred ? TOKEN_TYPE.HUNDRED : token.type;
		switch (action) {
			case ADD: {
				currentSubRegion!.type = type;
				currentSubRegion!.tokens?.unshift(token);
				break;
			}
			case START_NEW_REGION: {
				currentSubRegion = {
					tokens: [token],
					type,
				};
				subRegions.unshift(currentSubRegion);
				break;
			}
		}
		i--;
	}
	
	return subRegions;
};

const canAddTokenToEndOfRegion = (region: Omit<Region, 'subRegions'>, currentToken: Token, {impliedHundreds}: Options) => {
	const {tokens} = region;
	const prevToken = tokens[tokens.length - 1];
	
	
	if (
		!impliedHundreds &&
		prevToken.type === TOKEN_TYPE.UNIT &&
		currentToken.type === TOKEN_TYPE.UNIT &&
		!region.hasDecimal
	) return false;
	
	if (!impliedHundreds && prevToken.type === TOKEN_TYPE.UNIT && currentToken.type === TOKEN_TYPE.TEN) return false;
	
	return !(!impliedHundreds && prevToken.type === TOKEN_TYPE.TEN && currentToken.type === TOKEN_TYPE.TEN);
};

const checkIfTokenFitsRegion = (region: Omit<Region, 'subRegions'> | null | undefined, token: Token, options: Options) => {
	const isDecimal = DECIMALS.includes(token.lowerCaseValue);
	if ((!region || !region.tokens.length) && isDecimal) {
		return START_NEW_REGION;
	}
	
	const isPunctuation = PUNCTUATION.includes(token.lowerCaseValue);
	if (isPunctuation) return SKIP;
	
	const isJoiner = JOINERS.includes(token.lowerCaseValue);
	if (isJoiner) return SKIP;
	
	
	if (isDecimal && region && !region.hasDecimal) {
		return ADD;
	}
	
	const isNumberWord = NUMBER_WORDS.includes(token.lowerCaseValue);
	if (isNumberWord) {
		if (!region) return START_NEW_REGION;
		
		if (canAddTokenToEndOfRegion(region, token, options)) {
			return ADD;
		}
		
		return START_NEW_REGION;
	}
	
	return NOPE;
};

const checkBlacklist = (tokens: Token[]) => tokens.length === 1 && BLACKLIST_SINGULAR_WORDS.includes(tokens[0].lowerCaseValue);


const matchRegions = (tokens: Token[], options: Options): Region[] => {
	const regions: (Omit<Region, 'subRegions'> | null)[] = [];
	
	if (checkBlacklist(tokens)) return regions as Region[];
	
	let i = 0;
	let currentRegion: Omit<Region, 'subRegions'> | null | undefined
	const tokensCount = tokens.length;
	while (i < tokensCount) {
		const token = tokens[i];
		const tokenFits = checkIfTokenFitsRegion(currentRegion, token, options);
		switch (tokenFits) {
			case SKIP: {
				break;
			}
			case ADD: {
				if (currentRegion) {
					currentRegion.end = token.end;
					currentRegion.tokens.push(token);
					if (token.type === TOKEN_TYPE.DECIMAL) {
						currentRegion.hasDecimal = true;
					}
				}
				break;
			}
			case START_NEW_REGION: {
				currentRegion = {
					start: token.start,
					end: token.end,
					tokens: [token],
				};
				regions.push(currentRegion);
				if (token.type === TOKEN_TYPE.DECIMAL) {
					currentRegion.hasDecimal = true;
				}
				break;
			}
			case NOPE:
			default: {
				currentRegion = null;
				break;
			}
		}
		i++;
	}
	
	return regions.map(region => ({...region, subRegions: getSubRegions(region, options)} as Region))
};

const getTokenType = (chunk: string) => {
	if (UNIT_KEYS.includes(chunk.toLowerCase())) return TOKEN_TYPE.UNIT;
	if (TEN_KEYS.includes(chunk.toLowerCase())) return TOKEN_TYPE.TEN;
	if (MAGNITUDE_KEYS.includes(chunk.toLowerCase())) return TOKEN_TYPE.MAGNITUDE;
	if (DECIMALS.includes(chunk.toLowerCase())) return TOKEN_TYPE.DECIMAL;
};

export default (text: string, options: Options) => {
	const tokens = text
		.split(/(\w+|\s|[[:punct:]])/i)
		.reduce((acc: Token[], chunk) => {
			// const unfuzzyChunk = chunk.length && options.fuzzy && !PUNCTUATION.includes(chunk) ? fuzzyMatch(chunk) : chunk;
			const start = acc.length ? acc[acc.length - 1].end + 1 : 0;
			const end = start + chunk.length;
			return end !== start ?
				acc.concat({
					start,
					end: end - 1,
					value: chunk,
					lowerCaseValue: chunk.toLowerCase(),
					type: getTokenType(chunk)
				}) :
				acc
			
			
		}, []) as Token[]
	
	
	return matchRegions(tokens, options);
};
