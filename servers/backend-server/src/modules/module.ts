import { ContainerModule, interfaces } from 'inversify';
import { Feature } from '@common-stack/server-core';
import CounterModule from '@sample-stack/counter-module-server';
import { TaggedType } from '@common-stack/core';
import { config } from '../config';

export const settings = {
    // mongoConnection: generateMongo(config.MONGO_URL),
    subTopic: config.CONNECTION_ID, // usually versioning
    adminApiNamespace: config.ADMIN_API_NAMESPACE,
    apiNamespace: config.API_NAMESPACE,
};

const defaultModule = () =>
    new ContainerModule((bind: interfaces.Bind) => {
        bind('Settings').toConstantValue(settings).whenTargetTagged('default', true);
        bind('Settings').toConstantValue(settings).whenTargetTagged(TaggedType.MICROSERVICE, true);
        bind('MongoOptions').toConstantValue({});
    });

const DefaultFeature = new Feature({
    createContainerFunc: [defaultModule],
    createHemeraContainerFunc: [defaultModule],
});

export const ExternalModules = new Feature<any>({});

export default new Feature(DefaultFeature, ExternalModules, CounterModule);
