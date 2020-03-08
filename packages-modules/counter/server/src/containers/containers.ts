import { CounterMockService, CounterMockProxyService } from '../services';
import { ContainerModule, interfaces } from 'inversify';
import { TYPES } from '../constants';
import { ICounterService } from '../interfaces';

/**
 * Local services and exposed micro services to serve remote connections.
 * Operates within in the Gateway.
 *
 * @param settings Settings
 */
export const localCounterModule: (settings) => interfaces.ContainerModule =
    (settings) => new ContainerModule((bind: interfaces.Bind) => {

        // bind<ICounterService>(TYPES.CounterMockService)
        //     .to(CounterMockService)
        //     .inSingletonScope()
        //     .whenTargetIsDefault();

        bind<ICounterService>(TYPES.CounterMockService)
            .to(CounterMockProxyService)
            .inSingletonScope()
            .whenTargetNamed('proxy');

    });


/**
 * Operates external to the Gateway. Usually a broker listen to calls and invoke this service
 * local to the micro container.
 *
 * @param settings Settings
 */
export const externalCounterModule: (settings) => interfaces.ContainerModule =
(settings) => new ContainerModule((bind: interfaces.Bind) => {

    bind<ICounterService>(TYPES.CounterMockService)
        .to(CounterMockService)
        .inSingletonScope();

});
