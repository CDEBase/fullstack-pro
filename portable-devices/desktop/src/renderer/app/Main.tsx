import * as React from 'react';
import { ApolloProvider } from '@apollo/client/index.js';
import { Provider } from 'react-redux';
import { PluginArea } from '@common-stack/client-react';
import { ConnectedRouter } from 'connected-react-router';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
import { createReduxStore } from '../config/main/redux-config';
import { createClientContainer } from '../config/main/client.service';
import modules, { MainRoute } from '../modules/main';
import { ErrorBoundary } from './ErrorBoundary';

const { apolloClient: client } = createClientContainer();

const { store, history } = createReduxStore();
export class Main extends React.Component<{}, {}> {
    render() {
        const persistor = persistStore(store);
        return (
            <ErrorBoundary>
                <Provider store={store}>
                    <ApolloProvider client={client}>
                        <PersistGate persistor={persistor}>
                            <PluginArea />
                            {modules.getWrappedRoot(
                                <ConnectedRouter history={history}>
                                    <MainRoute />
                                </ConnectedRouter>,
                            )}
                        </PersistGate>
                    </ApolloProvider>
                </Provider>
            </ErrorBoundary>
        );
    }
}

export default Main;
