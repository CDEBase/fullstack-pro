/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/ban-types */
import { CdmLogger } from '@cdm-logger/core';
import { logger } from './customLogger';

interface LogParams {
    message: string;
    scope: any;
    level: CdmLogger.LoggerLevel;
}

const log = (propertyName: string, params: string | LogParams) => {
    // If it is plain text, output directly
    if (typeof params === 'string') {
        logger.info(`(${propertyName}) ${params}`);
    } else {
        // If it is an object, three parameters must be passed in and then output
        const { level, message, scope } = params;
        logger[`${level}`](`(${scope || propertyName}) ${message}`);
    }
};

/**
 * Call log before execution
 */
export const logBefore = (params: string | LogParams) => (
    target: Object,
    propertyName: string,
    descriptor: PropertyDescriptor,
) => {
    const method = descriptor.value;
    // Require, in order to work with decorator
    // eslint-disable-next-line func-names,no-param-reassign
    descriptor.value = function (...args: any[]) {
        log('main', params);
        return method.apply(this, args);
    };
};

/**
 * Call log after execution
 * @param params
 */
export const logAfter = (params: string | LogParams) => (
    target: Object,
    propertyName: string,
    descriptor: PropertyDescriptor,
) => {
    const method = descriptor.value;
    // Require, in order to work with decorator
    // eslint-disable-next-line func-names,no-param-reassign
    descriptor.value = function (...args: any[]) {
        try {
            return method.apply(this, args);
        } finally {
            log('main', params);
        }
    };
};
