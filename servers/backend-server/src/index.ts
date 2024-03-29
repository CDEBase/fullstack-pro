/// <reference types="webpack-env" />
import * as dotenv from 'dotenv';
import 'reflect-metadata';

if (process.env.ENV_FILE) {
    dotenv.config({ path: process.env.ENV_FILE })
}
import { logger } from '@cdm-logger/server';
import { Service } from './service';

declare let module: __WebpackModuleApi.Module;

process.on('uncaughtException', (ex) => {
    logger.error(ex);
    process.exit(1);
});

process.on('unhandledRejection', (reason) => {
    logger.error(reason);
});
const service = new Service();

async function start() {
    try {
        await service.initialize();
        await service.start();
    } catch(err) {
        console.error('START FAILED', err)
    }

}
// if (module.hot) {
//     module.hot.status((event) => {
//         if (event === 'abort' || event === 'fail') {
//             logger.error(`HMR error status: ${event}`);
//             // Signal webpack.run.js to do full-reload of the back-end
//             service.gracefulShutdown(event);
//         }
//         // adddintionally when event is idle due to external modules
//         if (event === 'idle') {
//             service.gracefulShutdown(event);
//         }
//     });
//     module.hot.accept();
// }
if (module.hot) {
    module.hot.dispose((data) => {
        // Shutdown server if changes to this module code are made
        // So that it was started afresh
        console.log('--data---', data);
        try {
            // if (service) {
            //     service.gracefulShutdown(null);
            // }
        } catch (error) {
            logger.error(error.stack);
        }
    });
}
start();
