import { ContainerModule, interfaces } from 'inversify';
import CounterModule from '@sample-stack/counter-module-server';
import { config } from '../config';
import { NATS_MOLECULER_COUNTER_SERIVCE } from '@sample-stack/counter-module-server';
import { Feature } from '@common-stack/server-core';


const subTopic = config.CONNECTION_ID; // version.topic.action

export const settings: any & { name: string } = {
    name: NATS_MOLECULER_COUNTER_SERIVCE,
    connectionId: config.CONNECTION_ID,
    namespace: config.NAMESPACE,
    subTopic,
    logger: config.LOG_LEVEL,
    workspaceId: config.CONNECTION_ID || 'DEFAULT',
    configPath: process.env.CONFIG_PATH,
};


const defaultModule =
    () => new ContainerModule((bind: interfaces.Bind) => {
        bind('Settings').toConstantValue(settings).whenTargetTagged('default', true);
        bind('Settings').toConstantValue(settings).whenTargetTagged('microservice', true);
        bind('MongoOptions').toConstantValue({});
    });

const DefaultFeature = new Feature({
    createContainerFunc: [defaultModule],
    createHemeraContainerFunc: [defaultModule],
});

export default new Feature(
    DefaultFeature,
    CounterModule,
);
