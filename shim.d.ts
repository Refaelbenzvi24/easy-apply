import type {ProtocolWithReturn} from 'webext-bridge'
import {Scripting, Tabs, WebNavigation} from "webextension-polyfill";
import {autofillFields} from "~/logic";
import {AxiosResponse} from "axios";

type StatusOptions = 'succeed' | 'failed'

type CreateTabReturn<Status extends StatusOptions> = Status extends 'succeed' ? {
	tab: Tabs.Tab
	status: Status
} : {
	status: Status
}

type GetAllFramesReturn<Status extends StatusOptions> = Status extends 'succeed' ? {
	frames: WebNavigation.GetAllFramesCallbackDetailsItemType[]
	status: Status
} : {
	status: Status
}

type GetCurrentTabReturn<Status extends StatusOptions> = Status extends 'succeed' ? {
	tab: Tabs.Tab
	status: Status
} : {
	status: Status
}

declare module 'webext-bridge' {
	export interface ProtocolMap {
		// define message protocol types
		// see https://github.com/antfu/webext-bridge#type-safe-protocols
		'tab-prev': { title: string | undefined }
		'auto-fill': {}
		'create-tab': ProtocolWithReturn<{ url: string }, CreateTabReturn>
		'get-all-frames': ProtocolWithReturn<{ tabId: number }, GetAllFramesReturn>
		'get-current-tab': ProtocolWithReturn<{}, GetCurrentTabReturn>
		'execute-script': Scripting.ScriptInjection
		'get-auto-fill-fields': ProtocolWithReturn<{}, typeof autofillFields.value>
		'update-components': {}
		'update-style': {},
		'get-job-page': ProtocolWithReturn<{ url: string }, AxiosResponse<string>>
		'get-linkedin-job-request': ProtocolWithReturn<{}, {}>
	}
}
