import { ClientLogger } from '@cdm-logger/client';

const logLevel = process.env.LOG_LEVEL || 'trace';
const logger = ClientLogger.create('FullStack', { level: logLevel });

export { logger };
