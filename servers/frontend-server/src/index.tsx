/// <reference path='../../../typings/index.d.ts' />
///<reference types="webpack-env" />
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Main from './Main';


const rootEl = document.getElementById('content');
let frontendReloadCount = 0;

const renderApp = ({ key }: { key: number }) =>
    ReactDOM.render(
        <Main key={key} />,
        rootEl,
    );

renderApp({ key: frontendReloadCount });


if (__DEV__) {
    if (module.hot) {
        module.hot.accept();

        module.hot.accept('backend_reload', () => {
            // log.debug('Reloading front-end');
            window.location.reload();
        });

        module.hot.accept('./Main', () => {
            try {
                // log.debug('Updating front-end');
                frontendReloadCount = (frontendReloadCount || 0) + 1;

                renderApp({ key: frontendReloadCount });
            } catch (err) {
                // log(err.stack);
            }
        });
    }
}
