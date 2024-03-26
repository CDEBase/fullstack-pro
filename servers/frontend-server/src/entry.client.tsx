import * as React from 'react';
import { RemixBrowser } from "@remix-run/react";
import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { ApolloProvider } from '@apollo/client/index.js';
import { SlotFillProvider } from '@common-stack/components-pro';
import { InversifyProvider, PluginArea } from '@common-stack/client-react';
import { Provider as ReduxProvider } from 'react-redux';
import { createReduxRouter } from '@common-stack/remix-router-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { persistStore } from 'redux-persist';
import { HelmetProvider } from 'react-helmet-async';
import { CacheProvider } from '@emotion/react';
import { createBrowserHistory } from 'history';

import { createReduxStore } from './config/redux-config';
import createEmotionCache from './common/createEmotionCache';
import { createClientContainer } from './config/client.service';
import modules from './modules/module';
import GA4Provider from './components/GaProvider';

const { apolloClient: client, container, serviceFunc } = createClientContainer();

// const mainRoute = createMainRoute({ client });
// const router = createBrowserRouter(mainRoute);
// const browserHistory = createBrowserHistory();
const { store } = createReduxStore(client, serviceFunc(), container);
// createReduxRouter({store, history: browserHistory});
const cache = createEmotionCache();
let persistor = persistStore(store);

startTransition(() => {
  modules.hydrate(container, window.__APOLLO_STATE__);

  hydrateRoot(
    document,
    <StrictMode>
      {/* <HelmetProvider> */}
        <CacheProvider value={cache}>
          <SlotFillProvider>
            <ReduxProvider store={store}>
              <InversifyProvider container={container} modules={modules}>
                <PersistGate loading={null} persistor={persistor}>
                  {() => (
                    <ApolloProvider client={client}>
                      <PluginArea />
                      {modules.getWrappedRoot(<RemixBrowser />)}
                    </ApolloProvider>
                  )}
                </PersistGate>
              </InversifyProvider>
            </ReduxProvider>
          </SlotFillProvider>
        </CacheProvider>
      {/* </HelmetProvider> */}
    </StrictMode>
  );
});
