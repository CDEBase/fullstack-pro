import { ContainerModule, interfaces } from 'inversify';
import { Feature } from '@common-stack/server-core';
import { logger } from '@cdm-logger/server';
import CounterModule from '@sample-stack/counter/lib/server';
import { pubsub } from './pubsub';
// import { generateMongo } from '@common-stack/store-mongo';
import * as NATS from 'nats';
import * as Hemera from 'nats-hemera';
import { config } from '../config';
import { hemeraGen } from './nats-connection';

export const settings = {
    // mongoConnection: generateMongo(config.MONGO_URL),
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
            bind('Hemera').toConstantValue(hemeraGen());
        }
    });


const DefaultFeature = new Feature({
    createContainerFunc: [defaultModule],
});


export default new Feature(DefaultFeature, CounterModule);
