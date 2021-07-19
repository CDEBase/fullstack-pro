import { getLogger as createLogger } from '@cdm-logger/electron';

// const logger = ConsoleLogger.create('main');
const logger = createLogger('log');
logger.divider = (str = '-', length = 10) => {
    let line = '';
    for (let i = 0; i < length; i += 1) {
        line += str;
    }
    logger.info(line);
};
export { logger };
export const getLogger = (name) => logger.child({ className: name });
