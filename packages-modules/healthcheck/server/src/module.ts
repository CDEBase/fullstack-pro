import schema from './schema/schema.graphql';
import { interfaces, ContainerModule } from 'inversify';

import { resolver } from './resolvers';
import { HealthCheck } from './services';

import { Feature } from '@common-stack/server-core';

function createContainer() {
    return new ContainerModule((bind: interfaces.Bind) => {
        bind(HealthCheck).toSelf();
    });
}

export default new Feature({
    schema,
    createResolversFunc: resolver,
    createContainerFunc: [createContainer],
    createServiceFunc: (container: interfaces.Container) => ({
        healthcheck: container.get<HealthCheck>(HealthCheck),
    }), // note anything set here should be singleton.
});
