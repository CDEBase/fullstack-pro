import { Container } from 'inversify';

import { DbConfig, repositoryModule, TYPES as RepoTypes, ICounterRepository } from '@sample-stack/store';
import * as Hemera from 'nats-hemera';
import { pubsub, client as natsClient } from './pubsub';
import { TaggedType } from '@common-stack/core';
import { database as DEFAULT_DB_CONFIG } from '../../../../config/development/settings.json';
import { logger } from '@sample-stack/utils';
const dbConfig = new DbConfig(DEFAULT_DB_CONFIG);
let counterRepo;
try {
    let container = new Container();
    container.load(repositoryModule(dbConfig));
    logger.info('Running in environment : [%s]', process.env.NODE_ENV);
    if (process.env.NODE_ENV === 'development') {
        // development
        counterRepo = container.get<ICounterRepository>(RepoTypes.ICounterRepository);
    } else {
        // all other environment

        const hemera = new Hemera(natsClient, {
            logLevel: process.env.HEMERA_LOG_LEVEL as Hemera.LogLevel || 'info',
            childLogger: true,
            tag: 'hemera-server',
            timeout: 10000,
        });
        container.bind('Hemera').toConstantValue(hemera);
        counterRepo = container.getNamed<ICounterRepository>(RepoTypes.ICounterRepository, TaggedType.MICROSERVICE);
    }
} catch (err) {
    logger.error('Server start failed when building the containers');
    logger.error(err);
}


export { counterRepo };
