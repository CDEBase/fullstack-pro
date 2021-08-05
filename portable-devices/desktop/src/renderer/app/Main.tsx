import { hot } from 'react-hot-loader/root';
import * as React from 'react';
import { RendererProvider } from 'react-fela';
import { ApolloProvider } from '@apollo/client';
import { Provider } from 'react-redux';
import { rehydrate } from 'fela-dom';
import { PluginArea } from '@common-stack/client-react';
import { ConnectedRouter } from 'connected-react-router';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore, persistReducer } from 'redux-persist';
import createRenderer from '../config/main/fela-renderer';
import modules, { MainRoute } from '../modules/main';
import { createClientContainer } from '../config/main/client.service';
import { createReduxStore, history, persistConfig } from '../config/main/redux-config';
import { getStoreReducer } from '../../common/config/base-redux-config';
import { epic$ } from '../config/main/epic-config';
import { ErrorBoundary } from './ErrorBoundary';

const { apolloClient: client } = createClientContainer();

let store;
if ((module as any).hot && (module as any).hot.data && (module as any).hot.data.store) {
    // console.log('Restoring Redux store:', JSON.stringify((module as any).hot.data.store.getState()));
    store = (module as any).hot.data.store;
    // replace the reducers always as we don't have ablity to find
    // new reducer added through our `modules`
    store.replaceReducer(persistReducer(persistConfig, getStoreReducer((module as any).hot.data.history || history)));
} else {
    store = createReduxStore();
}
if ((module as any).hot) {
    (module as any).hot.dispose((data) => {
        // console.log("Saving Redux store:", JSON.stringify(store.getState()));
        data.store = store;
        data.history = history;
        // Force Apollo to fetch the latest data from the server
        delete window.__APOLLO_STATE__;
    });
    (module as any).hot.accept('../config/main/epic-config', () => {
        // we may need to reload epic always as we don't
        // know whether it is updated using our `modules`
        const nextRootEpic = require('../config/main/epic-config').rootEpic;
        // First kill any running epics
        store.dispatch({ type: 'EPIC_END' });
        // Now setup the new one
        epic$.next(nextRootEpic);
    });
}

console.log('----CLIENT-----', client);
export class Main extends React.Component<{}, {}> {
    componentDidMount() {
        store.dispatch({ type: '@@REDUX_INIT' })
    }
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
