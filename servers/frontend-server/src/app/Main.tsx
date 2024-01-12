import * as React from 'react';
import { ApolloProvider } from '@apollo/client';
import { SlotFillProvider } from '@common-stack/components-pro';
import { PluginArea, InversifyProvider } from '@common-stack/client-react';
import { Provider as ReduxProvider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
import { createBrowserHistory } from 'history';
import { HelmetProvider } from 'react-helmet-async';

import { createReduxStore } from '../config/redux-config';
import { createClientContainer } from '../config/client.service';
import modules, { MainRoute } from '../modules';
import { IClientContainerService, IOrganizationContextService } from '@adminide-stack/core';

const { apolloClient: client, container, serviceFunc } = createClientContainer();

const history = createBrowserHistory();
const { store } = createReduxStore(history,client, serviceFunc(), container);
let persistor = persistStore(store);

export class Main extends React.Component<{}, {}> {
    public render() {
        if (__SSR__) {
            const organizationContext = container.get<IOrganizationContextService>(IClientContainerService.IOrganizationContextService);
            organizationContext.hydrate(window.__APOLLO_STATE__)
            return (
                <HelmetProvider>
                    <SlotFillProvider>
                        <ReduxProvider store={store}>
                            <InversifyProvider container={container} modules={modules}>
                                <PersistGate loading={null} persistor={persistor}>
                                    {() => (
                                        <ApolloProvider client={client}>
                                            <PluginArea />
                                            <ConnectedRouter history={history}>
                                                {modules.getWrappedRoot(<MainRoute />)}
                                            </ConnectedRouter>
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
                                        <ConnectedRouter history={history}>
                                            {modules.getWrappedRoot(<MainRoute />)}
                                        </ConnectedRouter>
                                    </ApolloProvider>
                                    ,
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
