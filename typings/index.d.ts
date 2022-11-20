/* eslint-disable @typescript-eslint/ban-types */
 
 
declare const __DEV__: boolean;
declare const __ENV__: any;
declare const __BACKEND_URL__: string;
declare const __GRAPHQL_URL__: string;
declare const __PERSIST_GQL__: any;
declare const __FRONTEND_BUILD_DIR__: string;
declare const __DLL_BUILD_DIR__: string;
declare const __SSR__: boolean;
declare const __CLIENT__: boolean;
declare const __SERVER__: any;
declare const __APOLLO_STATE__: any;
declare const __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any;
declare const __DEBUGGING__: boolean;

declare interface Window {
	/** Apollo Dev tools  */
	__APOLLO_CLIENT__?: any;
	/** Apollo Cache to restore in the browser in SSR mode */
	__APOLLO_STATE__?: any;
	__ENV__?: any;
	__INITIAL_STATE__?: any;
	__PRELOADED_STATE__?: any;
	__REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: <F extends Function>(f: F) => F;
	__SERVER_ERROR__?: any;
}
declare module '*settings.json' {
	export const app: {
		apolloLogging: boolean;
	};
	export const database: {};
}

declare interface __ZEN_OPTIONS__ {
	backendBuildDir?: string;
	debugSQL?: boolean;
	dllBuildDir?: string;
	frontendBuildDir?: string;
	frontendRefreshOnBackendChange?: boolean;
	persistGraphQL?: boolean;
	reactHotLoader?: boolean;
	ssr?: boolean;
	webpackDevPort?: number;
	webpackDll?: boolean;
}

declare interface __PUBLIC_SETTINGS__ {
	GRAPHQL_SUBSCRIPTION_URL?: string;
	GRAPHQL_URL: string;
	LOCAL_GRAPHQL_URL?: string;
	LOG_LEVEL?: string;
	apolloLogging: boolean;
}

declare interface __SETTINGS__ extends __ZEN_OPTIONS__, __PUBLIC_SETTINGS__ {
	BACKEND_URL: string;
	CLIENT_URL: string;
	NATS_PW: number | string;
	NATS_URL: string;
	NATS_USER: string;
}

declare namespace NodeJS {
	export interface Process {
		APP_ENV?: ProcessEnv;
		env: ProcessEnv;
	}
}

declare module '*zenrc.json' {
	export const options: __ZEN_OPTIONS__;
}

declare module '*.json' {
	const value: any;
	export = value;
}

declare module '*.graphql' {
	const value: string;
	export default value;
}

declare module '*.graphqls' {
	const value: string;
	export default value;
}

declare module '*.png' {
	const content: any;
	export default content;
}

declare module '*.jpg' {
	const content: any;
	export default content;
}

declare module '*.svg' {
	const content: any;
	export default content;
}

declare module '*.gif' {
	const fileName: string;
	export = fileName;
}

declare module '*.html' {
	const fileName: string;
	export = fileName;
}

// This definition is used before typings-for-css-modules-loader generates .d.ts files.
// As soon as typings are found tsc will prefer them.
declare module '*.css' {
	interface IClassNames {
		[className: string]: string;
	}

	const classNames: IClassNames;
	export = classNames;
}
