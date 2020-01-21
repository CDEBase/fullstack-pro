import { TaggedType } from '@common-stack/core';
import { ContainerModule, interfaces, Container } from 'inversify';

import { TYPES } from '../constants';
import { IActivityCollector } from '../interfaces';
import { ActivityLocalservice, ActivityMicroservice } from '../services';

import { Redis } from '../storage/Redis';

export const activityModule: (settings: any, pubsub?) => interfaces.ContainerModule =
    (settings) => new ContainerModule((bind: interfaces.Bind) => {
        bind(TYPES.ActivityStorage).to(Redis);
        bind(TYPES.ActivityDBConnection).toConstantValue(settings.mongoConnection);

        bind<IActivityCollector>(TYPES.ActivityCollector)
            .to(ActivityLocalservice)
            .inSingletonScope()
            .whenTargetIsDefault();
    });

export const activityModuleNats: (settings: any, pubsub?: any) => interfaces.ContainerModule =
    settings =>
    new ContainerModule((bind: interfaces.Bind) => {
        bind(TYPES.ActivityStorage).to(Redis);
        bind(TYPES.ActivityDBConnection).toConstantValue(settings.mongoConnection);

        bind<IActivityCollector>(TYPES.ActivityCollector)
            .to(ActivityMicroservice)
            .inSingletonScope()
            .whenTargetNamed(TaggedType.MICROSERVICE);
    });
