import * as React from 'react';
import { ApolloProvider } from '@apollo/client';
import { SlotFillProvider } from '@common-stack/components-pro';
import { InversifyProvider, PluginArea } from '@common-stack/client-react';
import { Provider as ReduxProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { persistStore } from 'redux-persist';
import { HelmetProvider } from 'react-helmet-async';
import { createReduxStore } from '../config/redux-config';
import { createClientContainer } from '../config/client.service';
import modules, { createMainRoute } from '../modules/module';
import GA4Provider from '../components/GaProvider';

const { apolloClient: client, container, serviceFunc } = createClientContainer();

const mainRoute = createMainRoute({ client });
const router = createBrowserRouter(mainRoute);
const { store } = createReduxStore(client, serviceFunc(), container, router);
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
                                            {modules.getWrappedRoot(<RouterProvider router={router} />)}
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
                                        {modules.getWrappedRoot(<RouterProvider router={router} />)}
                                    </ApolloProvider>
                                </PersistGate>
                            </InversifyProvider>
                        </ReduxProvider>
                    </SlotFillProvider>
                </HelmetProvider>
            );
        }
    }
};

export default Main;
