import { CounterMockService } from '../services';
import { CouterMockProxySerice } from '../proxies';
import { ContainerModule, interfaces } from 'inversify';
import { TYPES } from '../constants';
import { ICounterService } from '../interfaces';


export const counterModule: (settings) => interfaces.ContainerModule =
    (settings) => new ContainerModule((bind: interfaces.Bind) => {

        bind<ICounterService>(TYPES.CounterMockService)
            .to(CounterMockService)
            .inSingletonScope();

        bind<ICounterService>(TYPES.CouterMockProxySerice)
            .to(CouterMockProxySerice)
            .inSingletonScope();

    });


export const sideCarModule: (settings) => interfaces.ContainerModule =
(settings) => new ContainerModule((bind: interfaces.Bind) => {

    bind<ICounterService>(TYPES.CounterMockService)
        .to(CounterMockService)
        .inSingletonScope();

});
