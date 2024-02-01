/// <reference path='../../../../typings/index.d.ts' />
import * as React from 'react';
import { ApolloProvider } from '@apollo/client';
import { SlotFillProvider } from '@common-stack/components-pro';
import { Provider as ReduxProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
import { HelmetProvider } from 'react-helmet-async';
import { CacheProvider } from '@emotion/react';
import { HistoryRouter } from 'redux-first-history/rr6';
import { createBrowserHistory } from 'history';
import createEmotionCache from '../common/createEmotionCache';
import { createReduxStore } from '../config/redux-config';
import { createClientContainer } from '../config/client.service';
import modules, { MainRoute } from '../modules';
import GA4Provider from '../components/GaProvider';
import { InversifyProvider, PluginArea } from '@common-stack/client-react';

const { apolloClient: client, container, serviceFunc } = createClientContainer();

const history = createBrowserHistory();
const { store } = createReduxStore(history, client, serviceFunc(), container);
const cache = createEmotionCache();
let persistor = persistStore(store);

export class Main extends React.Component<{}, {}> {
    public render() {
        if (__SSR__) {
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
                                                <HistoryRouter history={history}>
                                                    {modules.getWrappedRoot(
                                                        <GA4Provider>
                                                            <MainRoute />
                                                        </GA4Provider>,
                                                    )}
                                                </HistoryRouter>
                                                ,
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
                                            <ConnectedRouter history={history}>
                                                {modules.getWrappedRoot(
                                                    <GA4Provider>
                                                        <MainRoute />
                                                    </GA4Provider>,
                                                )}
                                            </ConnectedRouter>
                                        </ApolloProvider>
                                    </PersistGate>
                                </InversifyProvider>
                            </ReduxProvider>
                        </SlotFillProvider>
                    </CacheProvider>
                </HelmetProvider>
            );
        }
    }
  }
}

export default Main;
