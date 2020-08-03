import { Feature } from '@common-stack/client-react';

import { interfaces } from 'inversify';
import { dataIdFromObject, resolvers, schema } from './graphql';
import { ApolloClient } from 'apollo-client';
import { ClientTypes as BrowserTypes } from '@common-stack/client-core';
import { platformModule } from './inversify-containers';
import { IClientContainerService } from '@adminide-stack/core';
import { ClientTypes } from '@workbench-stack/core';


const platformServiceGen = (container: interfaces.Container) => {
    return {
        apolloClient: container.get<ApolloClient<any>>(BrowserTypes.ApolloClient),
        cache: container.get<any>(BrowserTypes.InMemoryCache),
        utility: container.get(BrowserTypes.UtilityClass),
        lifecycleService: container.get(ClientTypes.ILifecycleService),
        orgnaizationContextService: container.get(IClientContainerService.IOrganizationContextService),
        configurationService: container.get(IClientContainerService.IConfigurationService),
    }
}
export default new Feature({
    dataIdFromObject,
    createContainerFunc: platformModule,
    createServiceFunc: platformServiceGen,
    clientStateParams: { resolvers: resolvers, typeDefs: schema }
});
