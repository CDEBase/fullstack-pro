import { StatusBar } from "expo-status-bar";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation";
import config from "./config";
import env from "./config/public-config";
import { Provider } from "react-redux";
import { ApolloProvider } from "react-apollo";
import { persistStore, persistReducer } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import { createApolloClient } from "./config/apollo-client";
import { createRenderer } from "fela-native";
import { RendererProvider } from "react-fela";
import { ConnectedRouter } from "connected-react-router";
import {
  createReduxStore,
  storeReducer,
  history,
  persistConfig,
  epicMiddleware,
} from "./config/redux-config";

const client = createApolloClient();

let store: any;
if (
  (module as any).hot &&
  (module as any).hot.data &&
  (module as any).hot.data.store
) {
  // console.log('Restoring Redux store:', JSON.stringify((module as any).hot.data.store.getState()));
  store = (module as any).hot.data.store;
  // replace the reducers always as we don't have ablity to find
  // new reducer added through our `modules`
  store.replaceReducer(
    persistReducer(
      persistConfig,
      storeReducer((module as any).hot.data.history || history)
    )
  );
} else {
  store = createReduxStore();
}

const persistor = persistStore(store);
const renderer = createRenderer();

console.log("---CONFIG--new-", config, env);
export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();
  let persistor = persistStore(store);

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <Provider store={store}>
          <ApolloProvider client={client}>
            <RendererProvider renderer={renderer}>
              <PersistGate persistor={persistor}>
                <ConnectedRouter history={history}>
                  <Navigation colorScheme={colorScheme} />
                  <StatusBar />
                </ConnectedRouter>
              </PersistGate>
            </RendererProvider>
          </ApolloProvider>
        </Provider>
      </SafeAreaProvider>
    );
  }
}
