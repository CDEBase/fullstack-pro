import { ConsoleLogger, IConsoleLoggerSettings } from '@cdm-logger/server';
import * as Logger from 'bunyan';

const settings: IConsoleLoggerSettings = {
    level: 'trace',
};

export const logger: Logger = ConsoleLogger.create('@sample-stack-server', settings);

