/// <reference path='../../../../typings/index.d.ts' />
import { ApolloProvider } from '@apollo/client';
import { ConnectedRouter } from 'connected-react-router';
import { rehydrate } from 'fela-dom';
import { createBrowserHistory } from 'history';
import * as React from 'react';
import { RendererProvider } from 'react-fela';
import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';

import { createClientContainer } from '../config/client.service';
import createRenderer from '../config/fela-renderer';
import { createReduxStore } from '../config/redux-config';
import modules, { MainRoute } from '../modules';
import { ErrorBoundary } from './ErrorBoundary';

const { apolloClient: client } = createClientContainer();

const history = createBrowserHistory();
const { store } = createReduxStore(history);

export class Main extends React.Component<{}, {}> {
	public render() {
		const renderer = createRenderer();
		const persistor = persistStore(store);
		rehydrate(renderer);
		return (
			<ErrorBoundary>
				<Provider store={store}>
					<ApolloProvider client={client}>
						<RendererProvider renderer={renderer}>
							<PersistGate persistor={persistor}>
								{modules.getWrappedRoot(
									<ConnectedRouter history={history}>
										<MainRoute />
									</ConnectedRouter>
								)}
							</PersistGate>
						</RendererProvider>
					</ApolloProvider>
				</Provider>
			</ErrorBoundary>
		);
	}
}

export default Main;
