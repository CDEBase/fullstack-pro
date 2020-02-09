import schema from './schema/schema.graphql';
import { ICounterService, IService } from './interfaces';
import { resolver } from './resolvers';
import { counterModule, sideCarModule } from './containers';
import { Feature } from '@common-stack/server-core';
import { interfaces } from 'inversify';
import { TYPES } from './constants';

const counterServiceGen = (container: interfaces.Container): IService => {

    return {
        counterMockService: container.get<ICounterService>(TYPES.CounterMockService),
        counterMockProxyService: container.get<ICounterService>(TYPES.CouterMockProxySerice),
    };
};

export default new Feature({
    schema: schema,
    createContainerFunc: [counterModule],
    createResolversFunc: resolver,
    createServiceFunc: counterServiceGen,
    // createContextFunc: () => ({ counterMock: counterMock }), // note anything set here should be singleton.
    createHemeraContainerFunc: [sideCarModule],
});
