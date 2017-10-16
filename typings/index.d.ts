declare const __DEV__;
declare const __EXTERNAL_BACKEND_URL__;
declare const __BACKEND_URL__;
declare const __PERSIST_GQL__;

declare const __SSR__;
declare const __CLIENT__;
declare const __APOLLO_STATE__;
declare const __REDUX_DEVTOOLS_EXTENSION_COMPOSE__;

declare interface Window {
  __APOLLO_STATE__?: any;
  __INITIAL_STATE__?: any;
  __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: <F extends Function>(f: F) => F;
}
declare module "*app.json" {
  export const app: {
    "backendBuildDir": string;
    "frontendBuildDir": string;
    "graphQLUrl": string;
    "webpackDevPort": number,
    "clientPort": number,
    "apiPort": number,
    "ssr": boolean;
    "webpackDll": boolean;
    "dllBuildDir": string;
    "frontendRefreshOnBackendChange": boolean;
    "reactHotLoader": boolean;
    "debugSQL": boolean;
    "persistGraphQL": boolean;
    "apolloLogging": boolean;
  };
  export const database: {

  }
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
