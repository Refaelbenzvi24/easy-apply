import type {ProtocolWithReturn} from 'webext-bridge'
import {Tabs} from "webextension-polyfill";

type StatusOptions = 'succeed' | 'failed'

type CreateTabReturn<Status extends StatusOptions> = Status extends 'succeed' ? {
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
		'fill-form': {}
		'create-tab': ProtocolWithReturn<{ url: string }, CreateTabReturn>
		'get-current-tab': ProtocolWithReturn<{ tabId: number }, { title?: string }>
	}
}
