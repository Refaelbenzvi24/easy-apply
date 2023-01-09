export const getQueryParamValue = (paramName: string, queryString = location.search) => {
	try {
		return queryString.split('&').filter(queryParam => queryParam.includes(paramName))[0].split('=')[1]
	} catch {
		return ""
	}
}
