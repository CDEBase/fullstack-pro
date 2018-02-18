import { ConsoleLogger, IConsoleLoggerSettings } from '@cdm-logger/server';
import { LoggerLevel } from '@cdm-logger/core';
import * as Logger from 'bunyan';

const settings: IConsoleLoggerSettings = {
    level: process.env.LOG_LEVEL as LoggerLevel  || 'trace',
};

export const logger: Logger = ConsoleLogger.create('@sample-stack-server', settings);

