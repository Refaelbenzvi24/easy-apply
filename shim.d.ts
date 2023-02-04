import type {ProtocolWithReturn} from 'webext-bridge'
import {Cookies, Scripting, Tabs, WebNavigation} from "webextension-polyfill";
import {autofillFields} from "~/logic";
import {AxiosResponse} from "axios";
import {JobResponse} from "~/background";

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

type GetCookiesReturn<Status extends StatusOptions> = Status extends 'succeed' ? {
	cookies: Cookies.Cookie[]
	status: Status
} : {
	status: Status
}

type GetLinkedinJobReturn<Status extends StatusOptions> = Status extends 'succeed' ? {
	jobDetails: JobResponse
	status: Status
} : {
	status: Status
}

type GetExecuteScriptReturn<Status extends StatusOptions> = Status extends 'succeed' ? {
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
		'get-all-cookies': ProtocolWithReturn<{}, GetCookiesReturn>
		'get-all-frames': ProtocolWithReturn<{ tabId: number }, GetAllFramesReturn>
		'get-current-tab': ProtocolWithReturn<{}, GetCurrentTabReturn>
		'execute-script': ProtocolWithReturn<Scripting.ScriptInjection, GetExecuteScriptReturn>
		'get-auto-fill-fields': ProtocolWithReturn<{}, typeof autofillFields.value>
		'update-components': {}
		'update-style': {},
		'get-job-page': ProtocolWithReturn<{ url: string }, AxiosResponse<string>>
		'get-linkedin-job-details': ProtocolWithReturn<{ jobId: string }, GetLinkedinJobReturn>
	}
}
