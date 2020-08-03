
import { ContainerModule, interfaces, Container } from 'inversify';

export const platformModule: () => interfaces.ContainerModule =
    () => new ContainerModule((bind: interfaces.Bind) => {

});

