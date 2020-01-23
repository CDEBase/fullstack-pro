import { Application } from 'express';
import { interfaces, ContainerModule } from 'inversify';

import { resolver } from './resolvers';
import { HealthCheck } from './services';
import schema from './schema/schema.graphql';

import { Feature } from '@common-stack/server-core';

function createContainer() {
    return new ContainerModule((bind: interfaces.Bind) => {
        bind(HealthCheck).toSelf();
    });
}

function createMiddleware(app: Application) {
    app.get('/healthcheck', (req: any, res: any) => {
        Promise.all([
            req.services.healthcheck.nats().catch(err => `[Nats Error]: ${err}`),
            req.services.healthcheck.redis().catch(err => `[Redis Error]: ${err}`),
            req.services.healthcheck.mongo().catch(err => `[Mongo Error]: ${err}`),
        ]).then(([ nats, redis, mongo ]) => {
            res.json({ nats, redis, mongo, ok: true });
        }).catch(err => res.json({ ok: false, error: err }));
    });

    return;
}

export default new Feature({
    schema,
    middleware: createMiddleware,
    createResolversFunc: resolver,
    createContainerFunc: [createContainer],
    createServiceFunc: (container: interfaces.Container) => ({
        healthcheck: container.get<HealthCheck>(HealthCheck),
    }),
});
