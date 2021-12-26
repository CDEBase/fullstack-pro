/* eslint-disable @typescript-eslint/ban-types */
import { arch, cpus, platform, release, totalmem } from 'os';
import osName from 'os-name';
import { app } from 'electron';
import { isDev } from '../../common';
import { logger, getLogger } from '../utils';

interface LogInfo {
    level: any;
    message: string;
    key: any;
}

interface WithLogParams {
    before?: LogInfo | Function;
    after?: LogInfo | Function;
}

export class Logger {
    /**
     * Record system log
     */
    static logSystemInfo = () => {
        if (isDev) return;
        logger.divider();
        logger.info('Start the app...');

        logger.info(`Operating system: ${platform()} ${release()}(${arch()}`);
        logger.info(`System version: ${osName()}`);
        logger.info(`Processor: ${cpus().length} core`);
        logger.info(`Total memory: ${(totalmem() / 1024 / 1024 / 1024).toFixed(0)}G`);
        logger.info(`installation path: ${app.getAppPath()}`);
        logger.divider();
    };

    /**
     * Bring the log section to the subject
     * @param before
     * @param after
     */
    static withLog =
        ({ before, after }: WithLogParams) =>
        (func: Function) => {
            if (before) {
                if (typeof before === 'function') {
                    before();
                } else {
                    const logger = getLogger(before.key);
                    logger[before.level](before.message);
                }
            }

            func();

            if (after) {
                if (typeof after === 'function') {
                    after();
                } else {
                    const logger = getLogger(after.key);
                    logger[after.level](after.message);
                }
            }
        };
}
