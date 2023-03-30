import * as React from 'react';
import { RendererProvider } from 'react-fela';
import { ApolloProvider } from '@apollo/react-common';
import { Provider, ReactReduxContext } from 'react-redux';
import { rehydrate } from 'fela-dom';
import createRenderer from '../config/options/fela-renderer';
import { createClientContainer } from '../config/options/client.service';
import { epic$ } from '../config/options/epic-config';
import { ConnectedRouter } from 'connected-react-router';
import { createReduxStore, history } from '../config/options/redux-config';
import { MainRoute } from '../modules/options';
import { ErrorBoundary } from './ErrorBoundary';

const { apolloClient: client, container } = createClientContainer();

let store = createReduxStore();

export class Main extends React.Component<{}, {}> {

    componentDidMount() {
        store.dispatch({ type: '@@REDUX_INIT' })
    }

    public render() {
        const renderer = createRenderer();
        rehydrate(renderer);
        return (
            <ErrorBoundary>
                <Provider store={store}>
                    <ApolloProvider client={client}>
                        <RendererProvider renderer={renderer}>
                            <ConnectedRouter history={history} context={ReactReduxContext}>
                                <MainRoute />
                            </ConnectedRouter>,
                        </RendererProvider>
                    </ApolloProvider>
                </Provider>
            </ErrorBoundary>
        );
    }
}

export default Main;