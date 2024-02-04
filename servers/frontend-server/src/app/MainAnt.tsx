import * as React from 'react';
import { ApolloProvider } from '@apollo/client';
import { SlotFillProvider } from '@common-stack/components-pro';
import { InversifyProvider, PluginArea } from '@common-stack/client-react';
import { Provider as ReduxProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
import { createBrowserHistory } from 'history';
import { HelmetProvider } from 'react-helmet-async';
import { HistoryRouter } from 'redux-first-history/rr6';
import { createReduxStore } from '../config/redux-config';
import { createClientContainer } from '../config/client.service';
import modules, { MainRoute } from '../modules';
import GA4Provider from '../components/GaProvider';

const { apolloClient: client, container, serviceFunc } = createClientContainer();

const history = createBrowserHistory();
const { store } = createReduxStore(history, client, serviceFunc(), container);
let persistor = persistStore(store);

export class Main extends React.Component<{}, {}> {
    public render() {
        if (__SSR__) {
            return (
                <HelmetProvider>
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
                                        </ApolloProvider>
                                    )}
                                </PersistGate>
                            </InversifyProvider>
                        </ReduxProvider>
                    </SlotFillProvider>
                </HelmetProvider>
            );
        } else {
            return (
                <HelmetProvider>
                    <SlotFillProvider>
                        <ReduxProvider store={store}>
                            <InversifyProvider container={container} modules={modules}>
                                <PersistGate persistor={persistor}>
                                    <ApolloProvider client={client}>
                                        <PluginArea />
                                        <HistoryRouter history={history}>
                                            {modules.getWrappedRoot(
                                                <GA4Provider>
                                                    <MainRoute />
                                                </GA4Provider>,
                                            )}
                                        </HistoryRouter>
                                    </ApolloProvider>
                                </PersistGate>
                            </InversifyProvider>
                        </ReduxProvider>
                    </SlotFillProvider>
                </HelmetProvider>
            );
        }
    }
}

export default Main;
