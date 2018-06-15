/// <reference path='../../../typings/index.d.ts' />
///<reference types="webpack-env" />
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Main from './app/Main';

// Virtual module, generated in-memory by spinjs, contains count of backend rebuilds
// tslint:disable-next-line
import 'backend_reload';

const rootEl = document.getElementById('content');
let frontendReloadCount = 0;

const renderApp = ({ key }: { key: number }) =>
    ReactDOM.render(
        <Main key={key} />,
        rootEl,
    );
renderApp({ key: frontendReloadCount });
if (__DEV__) {
    if ((module as any).hot) {
        (module as any).hot.accept();
        (module as any).hot.accept('backend_reload', () => {
            // log.debug('Reloading front-end');
            window.location.reload();
        });
        (module as any).hot.accept((err) => {
            if (err) {
              console.error('Cannot apply HMR update.', err);
            }
          });
          (module as any).hot.accept('./app/Main', () => {
            try {
                console.log('Updating front-end');
                frontendReloadCount = (frontendReloadCount || 0) + 1;

                renderApp({ key: frontendReloadCount });
            } catch (err) {
                // log(err.stack);
            }
        });
    }
}
