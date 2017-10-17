import { Container } from 'inversify';

import { DbConfig, RepositoryDiSetup } from '@sample-stack/store';
import * as NATS from 'nats';
import * as Hemera from 'nats-hemera';
import { pubsub } from './pubsub';

import { database as DEFAULT_DB_CONFIG } from '../../../../config/development/settings.json';

const dbConfig = new DbConfig(DEFAULT_DB_CONFIG);
let container = new Container();

container.bind<DbConfig>('DefaultDbConfig').toConstantValue(dbConfig);

// container...
new RepositoryDiSetup().setup(container);

if (process.env.NODE_ENV === 'development') {
// development
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

}

export { container };
