import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { createRenderer as createFelaRenderer } from 'fela';

import Main from './Main';
const rootEl = document.getElementById('content');
import 'backend_reload';

let frontendReloadCount = 0;



// Commented out ("let HTML app be HTML app!")
window.addEventListener('DOMContentLoaded', () => {
    const mountNode = document.getElementById('stylesheet');
    // const renderer = createRenderer(document.getElementById('font-stylesheet'));
    const renderer = createFelaRenderer();
    if (rootEl) {
        ReactDOM.render(
            <Main />
            , rootEl);
    }
});

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

                // renderApp({ key: frontendReloadCount });
            } catch (err) {
                // log(err.stack);
            }
        });
    }
}