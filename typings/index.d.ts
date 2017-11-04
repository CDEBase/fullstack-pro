declare const __DEV__;
declare const __BACKEND_URL__;
declare const __GRAPHQL_URL__;
declare const __PERSIST_GQL__;
declare const __SSR__;
declare const __CLIENT__;
declare const __SERVER__;
declare const __APOLLO_STATE__;
declare const __REDUX_DEVTOOLS_EXTENSION_COMPOSE__;

declare interface Window {
  __APOLLO_STATE__?: any;
  __INITIAL_STATE__?: any;
  __ENV__?: any;
  __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: <F extends Function>(f: F) => F;
}
declare module "*settings.json" {
  export const app: {
    "apolloLogging": boolean;
  };
  export const database: {

  }
}

declare interface __SPIN_OPTIONS__ {
  "backendBuildDir": string;
  "frontendBuildDir": string;
  "webpackDevPort": number,
  "ssr": boolean;
  "webpackDll": boolean;
  "dllBuildDir": string;
  "frontendRefreshOnBackendChange": boolean;
  "reactHotLoader": boolean;
  "debugSQL": boolean;
  "persistGraphQL": boolean;
}

declare interface __PUBLIC_SETTINGS__ {
  "apolloLogging": boolean;
  GRAPHQL_URL: string;
  LOCAL_GRAPHQL_URL?: string;
}

declare module "*spinrc.json" {
  export const options: __SPIN_OPTIONS__
}


declare module "*.json" {
  const value: any;
  export = value;
}

declare module "*.graphql" {
  const value: any;
  export = value;
}

declare module "*.graphqls" {
  const value: any;
  export = value;
}


declare interface __SETTINGS__ extends __SPIN_OPTIONS__, __PUBLIC_SETTINGS__{
  CLIENT_URL: string;
  BACKEND_URL: string;
  NATS_URL: string,
  NATS_USER: string,
  NATS_PW: number | string,
}

// This definition is used before typings-for-css-modules-loader generates .d.ts files.
// As soon as typings are found tsc will prefer them.
declare module "*.css" {
	interface IClassNames {
		[className: string]: string;
	}

	const classNames: IClassNames;
	export = classNames;
}