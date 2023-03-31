import 'reflect-metadata';
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
// load environment config
import './config/public-config';

// add any css files

import Main from './app/Main';

// Virtual (module as any), generated in-memory by zenjs, contains count of backend rebuilds
// tslint:disable-next-line
const rootEl = document.getElementById('content');
let frontendReloadCount = 0;

const renderApp = ({ key }: { key: number }) => createRoot(rootEl!).render(<Main key={key} />);
renderApp({ key: frontendReloadCount });
if (__DEV__) {
    if ((module as any).hot) {
        (module as any).hot.accept();
        // (module as any).hot.accept('backend_reload', () => {
        //     // log.debug('Reloading front-end');
        //     // when the backend restarts wait for 5 seconds
        //     setTimeout(() => window.location.reload(), 5000);
        //     // window.location.reload();
        // });
        (module as any).hot.accept((err) => {
            if (err) {
                console.error('Cannot apply HMR update.', err);
            }
        });
        //  but if RHL not working we can uncomment below code to make normal HMR to refresh the page
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
