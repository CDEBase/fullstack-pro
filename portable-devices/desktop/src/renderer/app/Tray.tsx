import { hot } from 'react-hot-loader/root';
import * as React from 'react';
import { RendererProvider } from 'react-fela';
import { Provider } from 'react-redux';
import { rehydrate } from 'fela-dom';
import createRenderer from '../config/fela-renderer';
import { epic$ } from '../config/tray/epic-config';
import { createReduxStore, history } from '../config/tray/redux-config';
import { MainRoute } from '../modules/electron-module';
import { ErrorBoundary } from './ErrorBoundary';


let store;
if ((module as any).hot && (module as any).hot.data && (module as any).hot.data.store) {
    // console.log('Restoring Redux store:', JSON.stringify((module as any).hot.data.store.getState()));
    store = (module as any).hot.data.store;
    // replace the reducers always as we don't have ablity to find
    // new reducer added through our `modules`
    // store.replaceReducer(storeReducer((module as any).hot.data.history || history));
} else {
    store = createReduxStore();
}
if ((module as any).hot) {
    (module as any).hot.dispose((data) => {
        // console.log("Saving Redux store:", JSON.stringify(store.getState()));
        data.store = store;
        data.history = history;
        // Force Apollo to fetch the latest data from the server
        delete window.__APOLLO_STATE__;
    });
    (module as any).hot.accept('../config/epic-config', () => {
        // we may need to reload epic always as we don't
        // know whether it is updated using our `modules`
        const nextRootEpic = require('../config/epic-config').rootEpic;
        // First kill any running epics
        store.dispatch({ type: 'EPIC_END' });
        // Now setup the new one
        epic$.next(nextRootEpic);
    });
}
export class Main extends React.Component<{}, {}> {
    public render() {
        const renderer = createRenderer();
        rehydrate(renderer);
        return (
            <ErrorBoundary>
                <Provider store={store}>
                    <RendererProvider renderer={renderer}>
                        <MainRoute history={history} />
                    </RendererProvider>
                </Provider>
            </ErrorBoundary>
        );
    }
}

export default hot(Main);
