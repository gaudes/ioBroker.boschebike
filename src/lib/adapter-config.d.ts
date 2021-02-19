// This file extends the AdapterConfig type from "@types/iobroker"

// Augment the globally declared type ioBroker.AdapterConfig
declare global {
	namespace ioBroker {
		interface AdapterConfig {
			"user_name": string
			"user_password": string,
			"update_interval": number,
			"info_user": boolean,
			"info_ebike": boolean,
			"use_sourceanalytix": boolean,
			"sentry_disable": boolean
		}
	}
}

// this is required so the above AdapterConfig is found by TypeScript / type checking
export {};