import 'reflect-metadata';
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { loadableReady } from '@loadable/component';
import { ApolloProvider } from '@apollo/client';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { persistStore } from 'redux-persist';
import { createBrowserHistory } from 'history';
import { HelmetProvider } from 'react-helmet-async';
// import { CacheProvider } from '@emotion/react';
// import { hydrate } from '@emotion/css'

// import createEmotionCache from '../common/createEmotionCache';
import { createReduxStore } from './config/redux-config';
import { createClientContainer } from './config/client.service';
import modules, { MainRoute } from './modules';
import './config/public-config';

const { apolloClient: client } = createClientContainer();

const history = createBrowserHistory();
const { store } = createReduxStore(history);

// add any css files

// import Main from './app/Main';

// Virtual (module as any), generated in-memory by zenjs, contains count of backend rebuilds
// tslint:disable-next-line
// if (__SSR__) {
    
    const rootEl = document.getElementById('root');
    let persistor = persistStore(store);
    persistor.subscribe(() => {
        const { bootstrapped } = persistor.getState();

        if (bootstrapped) {
            loadableReady(() => {
                hydrateRoot(rootEl, 
                    <HelmetProvider>
                        <Provider store={store}>
                            <ApolloProvider client={client}>
                                {/* <PersistGate persistor={persistor}> */}
                                    {/* <CacheProvider value={cache}> */}
                                        {modules.getWrappedRoot(
                                            <ConnectedRouter history={history}>
                                                <MainRoute />
                                            </ConnectedRouter>,
                                        )}
                                    {/* </CacheProvider> */}
                                {/* </PersistGate> */}
                            </ApolloProvider>
                        </Provider>
                    </HelmetProvider>
                );
            });
        }
    });
// } else {
    // const rootEl = document.getElementById('root');
    // let frontendReloadCount = 0;
    // const renderApp = ({ key }: { key: number }) => createRoot(rootEl!).render(<Main key={key} />);
    // renderApp({ key: frontendReloadCount });
    // if (__DEV__) {
    //     if ((module as any).hot) {
    //         (module as any).hot.accept();
    //         // (module as any).hot.accept('backend_reload', () => {
    //         //     // log.debug('Reloading front-end');
    //         //     // when the backend restarts wait for 5 seconds
    //         //     setTimeout(() => window.location.reload(), 5000);
    //         //     // window.location.reload();
    //         // });
    //         (module as any).hot.accept((err) => {
    //             if (err) {
    //                 console.error('Cannot apply HMR update.', err);
    //             }
    //         });
    //         //  but if RHL not working we can uncomment below code to make normal HMR to refresh the page
    //         (module as any).hot.accept('./app/Main', () => {
    //             try {
    //                 console.log('Updating front-end');
    //                 frontendReloadCount = (frontendReloadCount || 0) + 1;
    
    //                 renderApp({ key: frontendReloadCount });
    //             } catch (err) {
    //                 // log(err.stack);
    //             }
    //         });
    //     }
    // }
// }
