import { ContainerModule, interfaces } from 'inversify';
import { Feature, logger } from '@common-stack/server-core';
import CounterModule from '@sample-stack/counter/lib/server';
import { pubsub, client } from './pubsub';
import { generateMongo } from '@common-stack/store-mongo';
import * as NATS from 'nats';
import * as Hemera from 'nats-hemera';
import { config } from '../config';

export const settings = {
    mongoConnection: generateMongo(config.MONGO_URL),
    subTopic: `${config.NAMESPACE}/${config.CONNECTION_ID}`,
};


const defaultModule =
    () => new ContainerModule((bind: interfaces.Bind) => {
        bind('Logger').toConstantValue(logger);
        bind('Settings').toConstantValue(settings).whenTargetTagged('default', true);
        bind('Settings').toConstantValue(settings).whenTargetTagged('microservice', true);
        bind('Environment').toConstantValue(config.NODE_ENV || 'development');
        bind('PubSub').toConstantValue(pubsub);
        bind('MongoOptions').toConstantValue({});

        if (process.env.NODE_ENV !== 'development') {
            const hemera = new Hemera(client(), {
                logLevel: config.HEMERA_LOG_LEVEL as Hemera.LogLevel || 'info',
                childLogger: true,
                tag: 'hemera-server',
                timeout: 10000,
            });
            bind('Hemera').toConstantValue(hemera);
        }
    });


const DefaultFeature = new Feature({
    createContainerFunc: [defaultModule],
});


export default new Feature(DefaultFeature, CounterModule);
