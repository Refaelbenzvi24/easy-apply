export interface Options {
	// fuzzy?: boolean
	impliedHundreds?: boolean
}


export interface Token {
	start: number,
	end: number,
	value: string,
	lowerCaseValue: string,
	type: number | undefined
}

export interface SubRegion {
	type: number | undefined,
	tokens: Token[]
}

export interface Region {
	start: number
	end: number
	tokens: Token[]
	hasDecimal?: boolean
	subRegions: SubRegion[] | []
}

