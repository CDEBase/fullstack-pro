import { ConsoleLogger, IConsoleLoggerSettings } from '@cdm-logger/server';
import * as Logger from 'bunyan';

const settings: IConsoleLoggerSettings = {
    level: 'debug',
};

export const logger: Logger = ConsoleLogger.create('fullstack-server', settings);

