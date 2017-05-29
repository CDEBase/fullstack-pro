///<reference types="webpack-env" />
import 'reflect-metadata';

import { logger } from '../../../tools/logger';
import './api_server';

process.on('uncaughtException', (ex) => {
    logger.error(ex);
    process.exit(1);
});

if (module.hot) {
    module.hot.status(event => {
        if (event === 'abort' || event === 'fail') {
            logger.error('HMR error status: ' + event);
            // Signal webpack.run.js to do full-reload of the back-end
            process.exit(250);
        }
    });

    module.hot.accept();
}