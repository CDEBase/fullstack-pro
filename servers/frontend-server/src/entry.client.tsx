/**
 * By default, Remix will handle hydrating your app on the client for you.
 * You are free to delete this file if you'd like to, but if you ever want it revealed again, you can run `npx remix reveal` ✨
 * For more information, see https://remix.run/file-conventions/entry.client
 */
import './config/public-config';
import { RemixBrowser } from '@remix-run/react';
import { startTransition, StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { ApolloProvider } from '@apollo/client/index.js';
import { SlotFillProvider } from '@common-stack/components-pro';
import { InversifyProvider, PluginArea } from '@common-stack/client-react';
import { Provider as ReduxProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
import { createReduxStore } from './config/redux-config';
import createEmotionCache from './common/createEmotionCache';
import { createClientContainer } from './config/client.service';
import modules from './modules/module';

const { apolloClient: client, container, serviceFunc } = createClientContainer();
const { store } = createReduxStore(client, serviceFunc(), container);
let persistor = persistStore(store);

startTransition(() => {
    hydrateRoot(
        document,
        <StrictMode>
          <SlotFillProvider>
            <ReduxProvider store={store}>
                <InversifyProvider container={container} modules={modules}>
                    <PersistGate loading={null} persistor={persistor}>
                        {() => (
                            <ApolloProvider client={client}>
                                <RemixBrowser />
                            </ApolloProvider>
                        )}
                    </PersistGate>
                </InversifyProvider>
            </ReduxProvider>
            </SlotFillProvider>
        </StrictMode>,
    );
});
