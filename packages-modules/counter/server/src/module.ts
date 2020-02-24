import schema from './schema/schema.graphql';
import { ICounterService, IService } from './interfaces';
import { resolver } from './resolvers';
import { localCounterModule, externalCounterModule } from './containers';
import { Feature } from '@common-stack/server-core';
import { interfaces } from 'inversify';
import { TYPES } from './constants';

const counterServiceGen = (container: interfaces.Container): IService => {
    const environment = container.get('Environment');
    if (environment === 'development') {
        return {
            counterMockService: container.get<ICounterService>(TYPES.CounterMockService),
        };
    } else {
        return {
            counterMockService: container.getNamed<ICounterService>(TYPES.CounterMockService, 'proxy'),
        };
    }
};

export default new Feature({
    schema: schema,
    createContainerFunc: [localCounterModule],
    createResolversFunc: resolver,
    createServiceFunc: counterServiceGen,
    // createContextFunc: () => ({ counterMock: counterMock }), // note anything set here should be singleton.
    createHemeraContainerFunc: [externalCounterModule],
});
