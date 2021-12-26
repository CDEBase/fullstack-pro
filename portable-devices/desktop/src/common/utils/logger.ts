/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/ban-types */
import { CdmLogger } from '@cdm-logger/core';
/**
 *  Create log proxy method
 * @param logLevel log level
 * @param mainLogger log object
 * @return {function}
 */
export const createLogProxy =
    (logLevel: string, mainLogger: CdmLogger.ILogger) =>
    (fn: Function) =>
    (...args: any) => {
        fn(...args);
        mainLogger[logLevel](...args);
    };
