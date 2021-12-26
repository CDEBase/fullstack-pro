/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Feature } from '@common-stack/client-react';
import { connectedReactRouterCounter } from './redux';
import { filteredRoutes } from './compute';

export default new Feature({
    routeConfig: filteredRoutes,
    reducer: { connectedReactRouterCounter },
});
