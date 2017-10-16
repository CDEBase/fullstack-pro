import { ClientLogger } from '@cdm-logger/client';
import * as Logger from 'bunyan';

const logger = ClientLogger.create('FullStack', { level: 'trace'});

export { logger };
