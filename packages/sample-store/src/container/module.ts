import { ContainerModule, interfaces } from 'inversify';
import { ICounterRepository, CounterRepository, CounterRemoteRepository } from '../repository';
import { DbConfig } from '../db-helpers';
import { TaggedType } from '@common-stack/core';
import { TYPES } from '../constants';

export const repositoryModule: (config: DbConfig) => interfaces.ContainerModule =
    (dbConfig) => new ContainerModule((bind: interfaces.Bind) => {
        bind<DbConfig>('DefaultDbConfig').toConstantValue(dbConfig);
        bind<ICounterRepository>(TYPES.ICounterRepository)
            .to(CounterRepository)
            .whenTargetIsDefault();

        bind<ICounterRepository>(TYPES.ICounterRepository)
            .to(CounterRemoteRepository)
            .whenTargetNamed(TaggedType.MICROSERVICE);
    });
