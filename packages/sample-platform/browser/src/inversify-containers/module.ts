
import { ContainerModule, interfaces, Container } from 'inversify';
import { OrganizationContextService, ConfigurationService, LifecycleService } from '../services';
import { IClientContainerService } from '@adminide-stack/core';
import { ILifecycleService, ClientTypes, LifecyclePhase, NullLifecycleService } from '@workbench-stack/core';

export const platformModule: () => interfaces.ContainerModule =
    () => new ContainerModule((bind: interfaces.Bind) => {

        bind(ClientTypes.ILifecycleService).to(LifecycleService).inSingletonScope();

        bind(IClientContainerService.IOrganizationContextService).to(OrganizationContextService).inSingletonScope();

        bind(IClientContainerService.IConfigurationService).to(ConfigurationService).inSingletonScope();


});

