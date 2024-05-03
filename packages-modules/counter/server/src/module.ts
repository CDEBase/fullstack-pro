import { Feature } from '@common-stack/server-core';
import { interfaces } from 'inversify';
import schema from './schema/schema.graphql';
import { ICounterService, IService } from './interfaces';
import { resolver } from './resolvers';
import { externalCounterModule, localCounterModule } from './containers';
import { CounterMockMoleculerService } from './services';
import { TYPES } from './constants';
import { CounterDataSource } from './dataloader';

const counterServiceGen = (container: interfaces.Container): IService => ({
    counterMockService: container.getNamed<ICounterService>(TYPES.CounterMockService, 'proxy'),
});

export default new Feature({
    schema,
    createContainerFunc: [localCounterModule],
    createResolversFunc: resolver,
    createServiceFunc: counterServiceGen,
    createDataSourceFunc: (options) => ({
        counterCache: new CounterDataSource(options),
    }),
    createHemeraContainerFunc: [externalCounterModule],
    addBrokerClientServiceClass: [CounterMockMoleculerService],
    addBrokerMainServiceClass: [],
});
