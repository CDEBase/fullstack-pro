///<reference types="webpack-env" />
import 'reflect-metadata';

import { logger } from '@sample/utils';
import './api-server';

process.on('uncaughtException', (ex) => {
    logger.error(ex);
    process.exit(1);
});

process.on('unhandledRejection', reason => {
  logger.error(reason);
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

