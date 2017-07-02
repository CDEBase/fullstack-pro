declare const __DEV__;
declare const __EXTERNAL_BACKEND_URL__;
declare const __PERSIST_GQL__;

declare module "*app.json" {
  export const app: {
    "backendBuildDir": string;
    "frontendBuildDir": string;
    "graphQLUrl": string;
    "webpackDevPort": number,
    "apiPort": number,
    "ssr": boolean;
    "webpackDll": boolean;
    "frontendRefreshOnBackendChange": boolean;
    "reactHotLoader": boolean;
    "debugSQL": boolean;
    "persistGraphQL": boolean;
    "apolloLogging": boolean;
  };
  export const database: {

  }
}