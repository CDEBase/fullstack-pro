import { Feature } from '@common-stack/client-react';

import { interfaces } from 'inversify';
import { ApolloClient } from '@apollo/client';
import { ClientTypes as BrowserTypes } from '@common-stack/client-core';
import { platformModule } from './inversify-containers';

const platformServiceGen = (container: interfaces.Container) => ({
    apolloClient: container.get<ApolloClient<any>>(BrowserTypes.ApolloClient),
    cache: container.get<any>(BrowserTypes.InMemoryCache),
    utility: container.get(BrowserTypes.UtilityClass),
});
export default new Feature({
    createContainerFunc: platformModule,
    createServiceFunc: platformServiceGen,
});
