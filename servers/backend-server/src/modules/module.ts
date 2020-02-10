import { ContainerModule, interfaces } from 'inversify';
import { Feature } from '@common-stack/server-core';
import { logger } from '@cdm-logger/server';
import CounterModule from '@sample-stack/counter-module-server';
import HealthCheckModule from '@sample-stack/healthcheck-server';
import { pubsubGen } from './pubsub';
// import { generateMongo } from '@common-stack/store-mongo';
import { config } from '../config';
import { hemeraGen } from './nats-connection';
import { broker } from './moleculer-broker';
import { TaggedType } from '@common-stack/core';

export const settings = {
    // mongoConnection: generateMongo(config.MONGO_URL),
    subTopic: `${config.NAMESPACE}.${config.CONNECTION_ID}`,
};


const defaultModule =
    () => new ContainerModule((bind: interfaces.Bind) => {
        bind('Logger').toConstantValue(logger);
        bind('Settings').toConstantValue(settings).whenTargetTagged('default', true);
        bind('Settings').toConstantValue(settings).whenTargetTagged(TaggedType.MICROSERVICE, true);
        bind('Environment').toConstantValue(config.NODE_ENV || 'development');
        bind('PubSub').toConstantValue(pubsubGen());
        bind('MongoOptions').toConstantValue({});

        if (config.NODE_ENV !== 'development') {
            bind('Hemera').toConstantValue(hemeraGen());
            bind('MoleculerBroker').toConstantValue(broker);
        }
    });


const DefaultFeature = new Feature({
    createContainerFunc: [defaultModule],
});


export default new Feature(DefaultFeature, CounterModule, HealthCheckModule);
