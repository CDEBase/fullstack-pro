// version 11/12/2021
 
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-var-requires */
 
 
import {
	Action,
	applyMiddleware,
	combineReducers,
	compose,
	createStore,
	Middleware,
	PreloadedState,
	ReducersMapObject,
	StoreEnhancer,
} from 'redux';
import { Epic,EpicMiddleware } from 'redux-observable';
import { PersistConfig,persistReducer } from 'redux-persist';

interface IReduxStore<S = any> {
	epicMiddleware?: EpicMiddleware<Action<S>, Action<any>>;
	initialState: PreloadedState<S>;
	isDebug: boolean;
	isDev: boolean;
	middleware?: Middleware[];
	persistConfig?: PersistConfig<S, any>;
	postMiddleware?: Middleware[];
	preMiddleware?: Middleware[];
	reducers: ReducersMapObject<S>;
	rootEpic?: Epic<Action<S>, Action<any>, void, any>;
	scope: 'browser' | 'server' | 'native' | 'ElectronMain';
}
/**
 * Add any reducers required for this app dirctly in to
 * `combineReducers`
 */
export const createReduxStore = ({
	scope,
	isDebug,
	isDev,
	reducers,
	rootEpic,
	epicMiddleware,
	preMiddleware,
	postMiddleware,
	middleware,
	initialState = {},
	persistConfig,
}: IReduxStore<any>) => {
	const isBrowser = scope === 'browser';
	const isElectronMain = scope === 'ElectronMain';
	/**
	 * Add middleware that required for this app.
	 */

	const middlewares: Middleware[] = [];
	// add epicMiddleware
	if (epicMiddleware) {
		middlewares.push(epicMiddleware);
	}
	if (preMiddleware) {
		middlewares.unshift(...preMiddleware);
	}
	// Add redux logger during development only
	if ((isDev || isDebug) && isBrowser) {
		const { createLogger } = require('redux-logger');

		middlewares.push(
			createLogger({
				level: 'info',
				collapsed: true,
			})
		);
	}

	if (middleware) {
		middlewares.push(...middleware);
	}

	if (postMiddleware) {
		middlewares.push(...postMiddleware);
	}

	const enhancers: () => StoreEnhancer<any>[] = () => [
		applyMiddleware(...middlewares),
	];

	const composeEnhancers: any =
		((isDev || isDebug) &&
			isBrowser &&
			window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
		compose;

	const rootReducer = combineReducers(reducers);
	const persistedReducer = persistConfig
		? persistReducer(persistConfig, rootReducer)
		: rootReducer;

	const store = createStore(
		persistedReducer,
		initialState,
		composeEnhancers(...enhancers())
	);
	if (isBrowser || isElectronMain) {
		// no SSR for now
		if (epicMiddleware) {
			epicMiddleware.run(rootEpic);
		}
	}

	return store;
};
