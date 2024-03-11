/// <reference path='../../../../typings/index.d.ts' />
import * as React from 'react';
import { ApolloProvider } from '@apollo/client';
import { SlotFillProvider } from '@common-stack/components-pro';
import { Provider as ReduxProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { persistStore } from 'redux-persist';
import { HelmetProvider } from 'react-helmet-async';
import { CacheProvider } from '@emotion/react';
import createEmotionCache from '../common/createEmotionCache';
import { createReduxStore } from '../config/redux-config';
import { createClientContainer } from '../config/client.service';
import modules, { createMainRoute } from '../modules/module';
import GA4Provider from '../components/GaProvider';
import { InversifyProvider, PluginArea } from '@common-stack/client-react';

const { apolloClient: client, container, serviceFunc } = createClientContainer();

const mainRoute = createMainRoute({ client });
const router = createBrowserRouter(mainRoute);
const { store } = createReduxStore(client, serviceFunc(), container, router);
let persistor = persistStore(store);

const Main = () => {
    if (__SSR__) {
        modules.hydrate(container, window.__APOLLO_STATE__);
        return (
            <HelmetProvider>
                <CacheProvider value={cache}>
                    <SlotFillProvider>
                        <ReduxProvider store={store}>
                            <InversifyProvider container={container} modules={modules}>
                                <PersistGate loading={null} persistor={persistor}>
                                    {() => (
                                        <ApolloProvider client={client}>
                                            <PluginArea />
                                            {modules.getWrappedRoot(<RouterProvider router={router} />)}
                                        </ApolloProvider>
                                    )}
                                </PersistGate>
                            </InversifyProvider>
                        </ReduxProvider>
                    </SlotFillProvider>
                </CacheProvider>
            </HelmetProvider>
        );
    } else {
        return (
            <HelmetProvider>
                <CacheProvider value={cache}>
                    <SlotFillProvider>
                        <ReduxProvider store={store}>
                            <InversifyProvider container={container} modules={modules}>
                                <PersistGate persistor={persistor}>
                                    <ApolloProvider client={client}>
                                        <PluginArea />
                                        {modules.getWrappedRoot(<RouterProvider router={router} />)}
                                    </ApolloProvider>
                                </PersistGate>
                            </InversifyProvider>
                        </ReduxProvider>
                    </SlotFillProvider>
                </CacheProvider>
            </HelmetProvider>
        );
    }
};

export default Main;
