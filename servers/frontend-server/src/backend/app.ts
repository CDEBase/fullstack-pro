/* eslint-disable import/first */
/* eslint-disable no-unused-expressions */
/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable jest/require-hook */
// tslint:disable-next-line:no-unused-expression
process.env.ENV_FILE !== null && require('dotenv').config({ path: process.env.ENV_FILE });

import { logger } from '@cdm-logger/server';

import './server';

process.on('uncaughtException', (ex: Error) => {
    logger.error(ex, 'uncaughtException');
    process.exit(1);
});

process.on('unhandledRejection', (reason: Error) => {
    logger.error(reason, 'unhandledRejection');
});

if ((module as any).hot) {
    (module as any).hot.status((event) => {
        if (event === 'abort' || event === 'fail') {
            logger.error(`HMR error status: ${event}`);
            // Signal webpack.run.js to do full-reload of the back-end
            process.exit(250);
        }
    });

    (module as any).hot.accept();
}
