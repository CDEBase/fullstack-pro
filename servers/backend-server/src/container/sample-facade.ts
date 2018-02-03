import { Container } from 'inversify';

import { DbConfig, RepositoryDiSetup, repositoryModule, TYPES as RepoTypes, ICounterRepository } from '@sample-stack/store';
import * as NATS from 'nats';
import * as Hemera from 'nats-hemera';
import { pubsub } from './pubsub';

import { database as DEFAULT_DB_CONFIG } from '../../../../config/development/settings.json';
import { logger } from '@sample-stack/utils';
const dbConfig = new DbConfig(DEFAULT_DB_CONFIG);
let counterRepo;
try {
    let container = new Container();

    container.bind<DbConfig>('DefaultDbConfig').toConstantValue(dbConfig);
    container.load(repositoryModule(dbConfig));
    // container...
    new RepositoryDiSetup().setup(container);

    if (process.env.NODE_ENV === 'development') {
        // development
        counterRepo = container.get<ICounterRepository>(RepoTypes.ICounterRepository);
    } else {
        // all other environment
        const nats = NATS.connect({
            'url': process.env.NATS_URL,
            'user': process.env.NATS_USER,
            'pass': process.env.NATS_PW,
        });

        const hemera = new Hemera(nats, {
            logLevel: process.env.HEMERA_LOG_LEVEL as Hemera.LogLevel || 'info',
            childLogger: true,
            tag: 'hemera-server',
            timeout: 10000,
        });
        container.bind('Hemera').toConstantValue(hemera);
        counterRepo = container.getNamed<ICounterRepository>(RepoTypes.ICounterRepository, RepoTypes.ICounterRepository);
    }
} catch (err) {
    logger.error('Server start failed when building the containers');
    logger.error(err);
}


export { counterRepo };
