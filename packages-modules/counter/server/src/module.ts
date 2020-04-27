import schema from './schema/schema.graphql';
import { ICounterService, IService } from './interfaces';
import { resolver } from './resolvers';
import { localCounterModule, externalCounterModule } from './containers';
import { CounterMockMoleculerService } from './services';
import { Feature } from '@common-stack/server-core';
import { interfaces } from 'inversify';
import { TYPES } from './constants';
import { CounterDataSource } from './dataloader';

const counterServiceGen = (container: interfaces.Container): IService => {
    return {
        counterMockService: container.getNamed<ICounterService>(TYPES.CounterMockService, 'proxy'),
    };
};

const dataSources: (container: interfaces.Container) => any = () => {
    return {
        counterCache: new CounterDataSource(),
    };
};

export default new Feature({
    schema: schema,
    createContainerFunc: [localCounterModule],
    createResolversFunc: resolver,
    createServiceFunc: counterServiceGen,
    // createContextFunc: () => ({ counterMock: counterMock }), // note anything set here should be singleton.
    createDataSourceFunc: dataSources,
    createHemeraContainerFunc: [externalCounterModule],
    addBrokerClientServiceClass: [CounterMockMoleculerService],
    addBrokerMainServiceClass: [],
});
