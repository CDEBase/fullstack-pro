import * as React from 'react';
import 'reflect-metadata';
import { RemixBrowser } from "@remix-run/react";
import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { ApolloProvider } from '@apollo/client/index.js';
import { SlotFillProvider, removeUniversalPortals } from '@common-stack/components-pro';
import { InversifyProvider, PluginArea } from '@common-stack/client-react';
import { CacheProvider as EmotionCacheProvider } from '@emotion/react';
import { Provider as ReduxProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
import { HelmetProvider } from 'react-helmet-async';
import { I18nextProvider } from 'react-i18next';
import createEmotionCache from './common/createEmotionCache';
import { createReduxStore } from './config/redux-config';
import { createClientContainer } from './config/client.service';
import modules from './modules/module';
import GA4Provider from './components/GaProvider';

const { apolloClient: client, container, serviceFunc } = createClientContainer();

const { store } = createReduxStore(client, serviceFunc(), container);
let persistor = persistStore(store);
const emotionCache = createEmotionCache();

window.__remixStore = store;
removeUniversalPortals(window.__SLOT_FILLS__ || []);

startTransition(() => {
  modules.hydrate(container, window.__APOLLO_STATE__);

  hydrateRoot(
    document,
    <StrictMode>
      {/* <HelmetProvider> */}
        {/* <I18nextProvider i18n={i18n}> */}
        <EmotionCacheProvider value={emotionCache}>
          <SlotFillProvider>
            <ReduxProvider store={store}>
              <InversifyProvider container={container} modules={modules}>
                <PersistGate loading={null} persistor={persistor}>
                  {() => (
                    <ApolloProvider client={client}>
                      {modules.getWrappedRoot(<RemixBrowser />)}
                    </ApolloProvider>
                  )}
                </PersistGate>
              </InversifyProvider>
            </ReduxProvider>
          </SlotFillProvider>
        {/* </I18nextProvider> */}
      {/* </HelmetProvider> */}
      </EmotionCacheProvider>
    </StrictMode>
  );
});
