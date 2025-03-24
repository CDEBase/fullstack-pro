import { ContainerModule, interfaces } from 'inversify';
import { Feature } from '@common-stack/server-core';
import { TaggedType } from '@common-stack/core';
import { config } from '../config';

const subTopic = config.CONNECTION_ID;
export const settings: any = {
    connectionId: config.CONNECTION_ID,
    namespace: config.NAMESPACE,
    subTopic,
    logger: config.LOG_LEVEL,
    workspaceId: config.CONNECTION_ID || 'DEFAULT',
    configPath: process.env.CONFIG_PATH,
    adminApiNamespace: 'api-admin',
    apiNamespace: 'api-admin',
};

const defaultModule = () =>
    new ContainerModule((bind: interfaces.Bind) => {
        bind('Settings').toConstantValue(settings).whenTargetTagged('default', true);
        bind('Settings').toConstantValue(settings).whenTargetTagged('microservice', true);
        bind('Settings').toConstantValue(settings).whenTargetTagged(TaggedType.MICROSERVICE, true);
        bind('MongoOptions').toConstantValue({});
    });

const DefaultFeature = new Feature({
    createContainerFunc: [defaultModule],
    createHemeraContainerFunc: [defaultModule],
});

export default new Feature<any>(DefaultFeature);
