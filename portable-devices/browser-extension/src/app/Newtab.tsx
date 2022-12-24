import * as React from 'react';
import { RendererProvider } from 'react-fela';
import { ApolloProvider } from '@apollo/react-common';
import { Provider } from 'react-redux';
import { rehydrate } from 'fela-dom';
import { SlotFillProvider } from '@common-stack/components-pro';
import { PluginArea, InversifyProvider } from '@common-stack/client-react';
import { ConnectedRouter } from 'connected-react-router';
import { ErrorBoundary } from '@admin-layout/ant-ui';
import createRenderer from '../config/newtab/fela-renderer';
import modules, { MainRoute } from '../modules/newtab';
import { createClientContainer } from '../config/newtab/client.service';
import { createReduxStore, history } from '../config/newtab/redux-config';

const { apolloClient: client, container } = createClientContainer();

let store = createReduxStore();

export class Main extends React.Component<{}, {}> {
    componentDidMount() {
        store.dispatch({ type: '@@REDUX_INIT' })
    }
    render() {
        const renderer = createRenderer();
        rehydrate(renderer);
        return (
            <ErrorBoundary>
                <SlotFillProvider>
                    <Provider store={store}>
                        <ApolloProvider client={client}>
                            <InversifyProvider container={container} modules={modules}>
                                <RendererProvider renderer={renderer}>
                                    <PluginArea />
                                    {modules.getWrappedRoot(
                                        <ConnectedRouter history={history}>
                                            <MainRoute />
                                        </ConnectedRouter>,
                                    )}
                                </RendererProvider>
                            </InversifyProvider>
                        </ApolloProvider>
                    </Provider>
                </SlotFillProvider>
            </ErrorBoundary>
        );
    }
}

export default Main;
