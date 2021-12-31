import { hot } from 'react-hot-loader/root';
import * as React from 'react';
import { RendererProvider } from 'react-fela';
import { ApolloProvider } from '@apollo/client';
import { Provider } from 'react-redux';
import { rehydrate } from 'fela-dom';
import { PluginArea } from '@common-stack/client-react';
import { ConnectedRouter } from 'connected-react-router';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
import createRenderer from '../config/main/fela-renderer';
import { createReduxStore } from '../config/main/redux-config';
import { createClientContainer } from '../config/main/client.service';
import modules, { MainRoute } from '../modules/main';
import { ErrorBoundary } from './ErrorBoundary';

const { apolloClient: client } = createClientContainer();

const { store, history } = createReduxStore();
export class Main extends React.Component<{}, {}> {
    render() {
        const renderer = createRenderer();
        const persistor = persistStore(store);
        rehydrate(renderer);
        return (
            <ErrorBoundary>
                <Provider store={store}>
                    <ApolloProvider client={client}>
                        <RendererProvider renderer={renderer}>
                            <PersistGate persistor={persistor}>
                                <PluginArea />
                                {modules.getWrappedRoot(
                                    <ConnectedRouter history={history}>
                                        <MainRoute />
                                    </ConnectedRouter>,
                                )}
                            </PersistGate>
                        </RendererProvider>
                    </ApolloProvider>
                </Provider>
            </ErrorBoundary>
        );
    }
}

export default hot(Main);
