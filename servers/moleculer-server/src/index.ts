///<reference types="webpack-env" />

import 'reflect-metadata';
import { StackServer } from './stack-server';
import { logger } from '@cdm-logger/server';


declare var module: __WebpackModuleApi.Module;


const service = new StackServer();
async function start() {
    await service.initialize();
    await service.start();
}

if (module.hot) {
    module.hot.status(event => {
        if (event === 'abort' || event === 'fail') {
            logger.error('HMR error status: ' + event);
            // Signal webpack.run.js to do full-reload of the back-end
            service.cleanup();
        }
        // adddintionally when event is idle due to external modules
        if (event === 'idle') {
            service.cleanup();
        }
    });
    module.hot.accept();
}

start();
