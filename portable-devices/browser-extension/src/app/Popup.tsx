import * as React from 'react';
import { ApolloProvider } from '@apollo/react-common';
import { Provider, ReactReduxContext } from 'react-redux';
import { SlotFillProvider } from '@common-stack/components-pro';
import { PluginArea, InversifyProvider } from '@common-stack/client-react';
import { ConnectedRouter } from 'connected-react-router';
import { ErrorBoundary } from './ErrorBoundary';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import modules, { MainRoute } from '../modules/popup';
import { createClientContainer } from '../config/popup/client.service';
import { createReduxStore, history } from '../config/popup/redux-config';

const { apolloClient: client, container } = createClientContainer();

let store = createReduxStore();
const key = 'custom';
const cache = createCache({ key });

export class Main extends React.Component<{}, {}> {
    componentDidMount() {
        store.dispatch({ type: '@@REDUX_INIT' })
    }
    render() {
        return (
            <ErrorBoundary>
                <SlotFillProvider>
                    <Provider store={store}>
                        <ApolloProvider client={client}>
                            <InversifyProvider container={container} modules={modules}>
                                <CacheProvider value={cache}>
                                    <PluginArea />
                                    {modules.getWrappedRoot(
                                        <ConnectedRouter history={history} context={ReactReduxContext}>
                                            <MainRoute />
                                        </ConnectedRouter>,
                                    )}
                                </CacheProvider>
                            </InversifyProvider>
                        </ApolloProvider>
                    </Provider>
                </SlotFillProvider>
            </ErrorBoundary>
        );
    }
}

export default Main;
