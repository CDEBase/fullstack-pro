
import { ServiceBroker, ServiceSettingSchema } from 'moleculer';
import { NatsPubSub } from 'graphql-nats-subscriptions';
import { Container, ContainerModule, interfaces } from 'inversify';
import * as ILogger from 'bunyan';
import { Feature } from '@common-stack/server-core';
import * as nats from 'nats';
import { logger } from '@cdm-logger/server';
import { config } from './config';
import CounterModule, { CounterMoleculerService } from '@sample-stack/counter-module-server';


export async function createServices(broker: ServiceBroker, client: nats.Client, settings: { name: string }) {

    const defaultModule =
        () => new ContainerModule((bind: interfaces.Bind) => {
            bind('Logger').toConstantValue(logger);
            bind('Settings').toConstantValue(settings).whenTargetTagged('default', true);
            bind('Settings').toConstantValue(settings).whenTargetTagged('microservice', true);
            bind('Environment').toConstantValue(config.NODE_ENV || 'development');
            bind('PubSub').toConstantValue(pubsub);
            bind('MongoOptions').toConstantValue({});
            // if (config.NODE_ENV !== 'development') {
            //     bind('Hemera').toConstantValue(hemeraGen());
            // }
        });

    const pubsub = new NatsPubSub({ client, logger });

    const defaultServiceGen = (container: interfaces.Container) => ({
        apollo: container.get('ApolloClient'),
        connectionManager: container.get('ConnectionManager'),
    });

    const DefaultFeature = new Feature({
        createServiceFunc: defaultServiceGen,
        createContainerFunc: [defaultModule],
    });


    const modules = new Feature(
        DefaultFeature,
        CounterModule,
    );

    const container: Container = await modules.createHemeraContainers(settings);

    broker.createService(CounterMoleculerService, { ...settings, container });
}
