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
import { ApolloProvider } from '@apollo/client/index.js';
import { SlotFillProvider, removeUniversalPortals } from '@common-stack/components-pro';
import { InversifyProvider, PluginArea } from '@common-stack/client-react';
import { CacheProvider as EmotionCacheProvider } from '@emotion/react';
import { Provider as ReduxProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
import createEmotionCache from './common/createEmotionCache';
import { createReduxStore } from './config/redux-config';
import { createClientContainer } from './config/client.service';
import clientModules from './modules/module';

const { apolloClient: client, container, serviceFunc } = createClientContainer();
const { store } = createReduxStore(client, serviceFunc(), container);
let persistor = persistStore(store);
const emotionCache = createEmotionCache();

window.__remixStore = store;
removeUniversalPortals(window.__SLOT_FILLS__ || []);

clientModules.hydrate(container, window.__APOLLO_STATE__);

startTransition(() => {
    hydrateRoot(
        document,
        <StrictMode>
            <EmotionCacheProvider value={emotionCache}>
                <SlotFillProvider>
                    <ReduxProvider store={store}>
                        <InversifyProvider container={container} modules={clientModules}>
                            <PersistGate loading={null} persistor={persistor}>
                                {() => (
                                    <ApolloProvider client={client}>
                                        <RemixBrowser />
                                    </ApolloProvider>
                                )}
                            </PersistGate>
                        </InversifyProvider>
                    </ReduxProvider>
                </SlotFillProvider>
            </EmotionCacheProvider>
        </StrictMode>,
    );
});
