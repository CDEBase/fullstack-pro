/**
 * By default, Remix will handle hydrating your app on the client for you.
 * You are free to delete this file if you'd like to, but if you ever want it revealed again, you can run `npx remix reveal` ✨
 * For more information, see https://remix.run/file-conventions/entry.client
 */
import * as React from 'react';
import 'reflect-metadata';
import { RemixBrowser } from '@remix-run/react';
import { startTransition, StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { createCache, StyleProvider } from '@ant-design/cssinjs';
import { ApolloProvider } from '@apollo/client/index.js';
import { SlotFillProvider, removeUniversalPortals } from '@common-stack/components-pro';
import { InversifyProvider } from '@common-stack/client-react';
import { Provider as ReduxProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
import { CacheProvider } from '@emotion/react';
import i18next from 'i18next';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';
// @ts-ignore
import { getInitialNamespaces } from 'remix-i18next/client';
// @ts-ignore
import { createReduxStore } from '@app/frontend-stack-react/config/redux-config.js';
// @ts-ignore
import { createClientContainer } from '@app/frontend-stack-react/config/client.service';
// @ts-ignore
import clientModules from '@app/frontend-stack-react/modules.js';
// @ts-ignore
import createEmotionCache from '@app/frontend-stack-react/entries/common/createEmotionCache.js';
// @ts-ignore
import config from '@app/cde-webconfig.json';

const { apolloClient: client, container, serviceFunc } = createClientContainer();
const { store } = createReduxStore(client, serviceFunc(), container);
const persistor = persistStore(store);
const antCache = createCache();
const cache = createEmotionCache();

(window as any).__remixStore = store;
removeUniversalPortals((window as any).__SLOT_FILLS__ || []);

async function hydrate() {
    if (!i18next.isInitialized && config.i18n.enabled) {
        await i18next
            .use(initReactI18next)
            .use(LanguageDetector)
            .use(Backend)
            .init({
                fallbackLng: config.i18n.fallbackLng,
                defaultNS: config.i18n.defaultNS,
                react: config.i18n.react,
                supportedLngs: config.i18n.supportedLngs,
                backend: config.i18n.backend,
                ns: getInitialNamespaces(),
                detection: {
                    order: ['htmlTag'],
                    caches: [],
                },
            });
    }
    startTransition(() => {
        hydrateRoot(
            document,
            (
                <I18nextProvider i18n={i18next}>
                    <StrictMode>
                        <CacheProvider value={cache}>
                            <StyleProvider cache={antCache}>
                                <ReduxProvider store={store}>
                                    <SlotFillProvider>
                                        <InversifyProvider container={container} modules={clientModules}>
                                            <PersistGate loading={null} persistor={persistor}>
                                                {() => (
                                                    <ApolloProvider client={client}>
                                                        <RemixBrowser />
                                                    </ApolloProvider>
                                                )}
                                            </PersistGate>
                                        </InversifyProvider>
                                    </SlotFillProvider>
                                </ReduxProvider>
                            </StyleProvider>
                        </CacheProvider>
                    </StrictMode>
                </I18nextProvider>
            ) as any,
        );
    });
}

if (window.requestIdleCallback) {
    window.requestIdleCallback(hydrate);
} else {
    // Safari doesn't support requestIdleCallback
    // https://caniuse.com/requestidlecallback
    window.setTimeout(hydrate, 1);
}
