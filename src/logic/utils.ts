export const getObjectAt = (obj: Record<string, any>, path: string) => {
	const parts = path.split('.')
	while (parts.length > 1 && obj.hasOwnProperty(parts[0])) {
		obj = obj[parts.shift()!]
	}
	
	if (obj.hasOwnProperty(parts[0])) return obj[parts[0]]
};

export const setValueAt = (obj: Record<string, any>, path: string, value: any) => {
	const parts = path.split('.')
	while (parts.length > 1 && obj.hasOwnProperty(parts[0])) {
		obj = obj[parts.shift()!]
	}
	
	if (obj.hasOwnProperty(parts[0])) obj[parts[0]] = value
}
