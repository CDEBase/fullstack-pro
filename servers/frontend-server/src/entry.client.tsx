/**
 * By default, Remix will handle hydrating your app on the client for you.
 * You are free to delete this file if you'd like to, but if you ever want it revealed again, you can run `npx remix reveal` ✨
 * For more information, see https://remix.run/file-conventions/entry.client
 */
import 'reflect-metadata';
import './config/public-config';
import { RemixBrowser } from '@remix-run/react';
import { startTransition, StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { createCache, StyleProvider } from '@ant-design/cssinjs';
import { ApolloProvider } from '@apollo/client/index.js';
import { SlotFillProvider, removeUniversalPortals } from '@common-stack/components-pro';
import { InversifyProvider, PluginArea } from '@common-stack/client-react';
import { Provider as ReduxProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
import { CacheProvider } from '@emotion/react';
import { createReduxStore } from './config/redux-config';
import { createClientContainer } from './config/client.service';
import clientModules from './modules/module';
import createEmotionCache from './common/createEmotionCache';

const { apolloClient: client, container, serviceFunc } = createClientContainer();
const { store } = createReduxStore(client, serviceFunc(), container);
let persistor = persistStore(store);
const antCache = createCache();
const cache = createEmotionCache();

window.__remixStore = store;
removeUniversalPortals(window.__SLOT_FILLS__ || []);

// clientModules.hydrate(container, window.__APOLLO_STATE__);

startTransition(() => {
    hydrateRoot(
        document,
        (
            <StrictMode>
                <CacheProvider value={cache}>
                    <StyleProvider cache={antCache}>
                        <ReduxProvider store={store}>
                            <SlotFillProvider>
                                <InversifyProvider container={container} modules={clientModules}>
                                    <PersistGate loading={null} persistor={persistor}>
                                        {() => (
                                            <ApolloProvider client={client}>
                                                {clientModules.getWrappedRoot(<RemixBrowser />)}
                                            </ApolloProvider>
                                        )}
                                    </PersistGate>
                                </InversifyProvider>
                            </SlotFillProvider>
                        </ReduxProvider>
                    </StyleProvider>
                </CacheProvider>
            </StrictMode>
        ) as any,
    );
});
