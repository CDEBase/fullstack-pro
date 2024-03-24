import * as React from 'react';
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

import { createReduxStore } from '../config/redux-config';
import createEmotionCache from '../common/createEmotionCache';
import { createClientContainer } from '../config/client.service';
import modules, { createMainRoute } from '../modules/module';
import GA4Provider from '../components/GaProvider';

const { apolloClient: client, container, serviceFunc } = createClientContainer();

const mainRoute = createMainRoute({ client });
const router = createBrowserRouter(mainRoute);
const browserHistory = createBrowserHistory();
const { store } = createReduxStore(client, serviceFunc(), container, router);
createReduxRouter({store, history: browserHistory, router});
const cache = createEmotionCache();
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
