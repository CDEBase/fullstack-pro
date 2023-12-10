import React from 'react';
import { NativeRouter } from 'react-router-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';
import { ApolloProvider } from '@apollo/client';
import { Provider } from 'react-redux';
import { MainRoute } from './modules/modules';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import {
  createReduxStore,
  history,
} from './config/redux-config';
import { NativeBaseProvider } from 'native-base';
import { createClientContainer } from './config/client.service';

const { apolloClient: client, container } = createClientContainer();

const store = createReduxStore();

export default function App() {

  let persistor = persistStore(store as any);
  return (
    <NativeBaseProvider>
      <SafeAreaProvider>
        <Provider store={store}>
          <ApolloProvider client={client}>
            <PersistGate persistor={persistor}>
              <NativeRouter>
                  <MainRoute />
              </NativeRouter>
            </PersistGate>
          </ApolloProvider>
        </Provider>
      </SafeAreaProvider>
    </NativeBaseProvider>
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
