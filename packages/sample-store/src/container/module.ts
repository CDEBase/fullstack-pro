import { TaggedType } from '@common-stack/core';
import { ContainerModule, interfaces } from 'inversify';

import { TYPES } from '../constants';
import { DbConfig } from '../db-helpers';
import { CounterRepository,ICounterRepository } from '../repository';

export const repositoryModule: (config: DbConfig) => interfaces.ContainerModule =
    (dbConfig) => new ContainerModule((bind: interfaces.Bind) => {
        bind<DbConfig>('DefaultDbConfig').toConstantValue(dbConfig);
        bind<ICounterRepository>(TYPES.ICounterRepository)
            .to(CounterRepository)
            .whenTargetIsDefault();

        // bind<ICounterRepository>(TYPES.ICounterRepository)
        //     .to(CounterRemoteRepository)
        //     .whenTargetNamed(TaggedType.MICROSERVICE);
    });
