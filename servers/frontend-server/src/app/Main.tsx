import * as React from 'react';
import { ApolloProvider } from '@apollo/client';
import { SlotFillProvider } from '@common-stack/components-pro';
import { InversifyProvider } from '@common-stack/client-react';
import { Provider as ReduxProvider } from 'react-redux';
import { HistoryRouter  } from 'redux-first-history/rr6';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
import { createBrowserHistory } from 'history';
import { HelmetProvider } from 'react-helmet-async';

import { createReduxStore } from '../config/redux-config';
import { createClientContainer } from '../config/client.service';
import modules, { MainRoute } from '../modules';

const { apolloClient: client, container, serviceFunc } = createClientContainer();

const history = createBrowserHistory();
const { store, reduxHistory } = createReduxStore(history, client, serviceFunc(), container);
let persistor = persistStore(store);

export class Main extends React.Component<{}, {}> {
    public render() {
        console.log(reduxHistory);
        if (__SSR__) {
            return (
                <HelmetProvider>
                    <SlotFillProvider>
                        <ReduxProvider store={store}>
                            <InversifyProvider container={container} modules={modules}>
                                <PersistGate loading={null} persistor={persistor}>
                                    {() => (
                                        <ApolloProvider client={client}>
                                            <HistoryRouter history={reduxHistory}>
                                                {modules.getWrappedRoot(<MainRoute />)}
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
                                        <HistoryRouter history={reduxHistory}>
                                            {modules.getWrappedRoot(<MainRoute />)}
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
