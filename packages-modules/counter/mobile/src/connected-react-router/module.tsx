/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Feature, IRouteData } from '@common-stack/client-react-native';
import { connectedReactRouterCounter } from './redux';
import { filteredRoutes } from './compute';

export default new Feature({
    routeConfig: filteredRoutes,
    reducer: { connectedReactRouterCounter },
});
