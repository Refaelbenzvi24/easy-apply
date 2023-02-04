export interface SubRoute {
	paths: [string, ...string[]]
	customCheckers?: [() => boolean, ...(() => boolean)[]]
	callback: () => void
	fallback?: () => void
}

export interface MainRoute {
	origin: string,
	routes: [SubRoute, ...SubRoute[]]
}

export interface Router {
	onBeforeRouterHandler?: () => void
	onAfterRouterHandler?: () => void
	routes: MainRoute[]
}

const allAreTrue = (array: boolean[]) =>
	array.every(element => element);

const buildSubRouteCondition = (subRoute: SubRoute) =>
	subRoute.paths.map(path => location.pathname.includes(path)).some(condition => condition) &&
	allAreTrue(subRoute.customCheckers?.map(checker => checker()) || [true])


export const routerHandler = async (router: Router) => {
	const {routes, onBeforeRouterHandler, onAfterRouterHandler} = router
	
	if (onBeforeRouterHandler) onBeforeRouterHandler()
	
	routes.forEach(route => {
		if (location.origin === route.origin) {
			route.routes.forEach(subRoute => {
				const condition = buildSubRouteCondition(subRoute)
				if (condition) subRoute.callback()
				if (!condition && subRoute.fallback) subRoute.fallback()
			})
		}
	})
	
	if (onAfterRouterHandler) onAfterRouterHandler()
}
