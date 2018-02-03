import { ContainerModule, interfaces } from 'inversify';
import { ICounterRepository, CounterRepository, CounterRemoteRepository } from '../repository';
import { TaggedType } from '@sample-stack/core';
import { TYPES } from '../constants';

export const repositoryModule: interfaces.ContainerModule = new ContainerModule((bind: interfaces.Bind) => {
    bind<ICounterRepository>(TYPES.ICounterRepository)
        .to(CounterRepository)
        .whenTargetIsDefault();

    bind<ICounterRepository>(TYPES.ICounterRepository)
        .to(CounterRemoteRepository)
        .whenTargetNamed(TaggedType.MICROSERVICE);
});
