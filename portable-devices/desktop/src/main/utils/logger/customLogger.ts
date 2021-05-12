import { ConsoleLogger } from '@cdm-logger/server';

const logger = ConsoleLogger.create('main');
logger.divider = (str = '-', length = 10) => {
    let line = '';
    for (let i = 0; i < length; i += 1) {
        line += str;
    }
    logger.info(line);
};
export { logger };
export const getLogger = (name) => logger.child({ className: name });
