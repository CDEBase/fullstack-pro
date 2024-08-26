import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';
import { ApolloProvider } from '@apollo/client/index.js';
import { Provider } from 'react-redux';
import { SlotFillProvider } from '@common-stack/components-pro';
import { NativeBaseProvider } from 'native-base';
import { InversifyProvider, PluginArea } from '@common-stack/client-react';

import modules, { MainRoute } from './modules/modules';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import { createReduxStore, history } from './config/redux-config';
import { createClientContainer } from './config/client.service';

const { apolloClient: client, container, serviceFunc } = createClientContainer();
const { store } = createReduxStore(history, client, serviceFunc(), container);

export default function App() {
    let persistor = persistStore(store as any);
    return (
        <SlotFillProvider>
            <Provider store={store}>
                <ApolloProvider client={client}>
                    <SafeAreaProvider>
                        <NativeBaseProvider>
                            <InversifyProvider container={container} modules={modules}>
                                <PersistGate persistor={persistor}>
                                    <MainRoute />
                                </PersistGate>
                            </InversifyProvider>
                        </NativeBaseProvider>
                    </SafeAreaProvider>
                </ApolloProvider>
            </Provider>
        </SlotFillProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 25,
        padding: 10,
    },
    header: {
        fontSize: 20,
    },
    nav: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    navItem: {
        flex: 1,
        alignItems: 'center',
        padding: 10,
    },
    subNavItem: {
        padding: 5,
    },
    topic: {
        textAlign: 'center',
        fontSize: 15,
    },
});
