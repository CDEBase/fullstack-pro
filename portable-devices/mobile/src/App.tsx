import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { NativeRouter, Route } from 'react-router-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';
import { createRenderer } from 'fela-native';
import { ApolloProvider } from '@apollo/react-common';
import { Provider } from 'react-redux';
import { MainRoute } from './modules/modules';
import { persistStore, persistReducer } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
// import { RendererProvider } from 'react-fela';
import { ConnectedRouter } from 'connected-react-router';
import {
  createReduxStore,
  history,
} from './config/redux-config';
import { Root } from 'native-base';
import { createClientContainer } from './config/client.service';

const { apolloClient: client, container } = createClientContainer();

const store = createReduxStore();
const renderer = createRenderer();

// console.log('---CONFIG--new-', config, env);
export default function App() {

  let persistor = persistStore(store as any);
  return (
    <Root>
      <SafeAreaProvider>
        <Provider store={store}>
          <ApolloProvider client={client}>
            <PersistGate persistor={persistor}>
              <NativeRouter>
                <ConnectedRouter history={history}>
                  <MainRoute />
                </ConnectedRouter>
              </NativeRouter>
            </PersistGate>
          </ApolloProvider>
        </Provider>
      </SafeAreaProvider>
    </Root>
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
