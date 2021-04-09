/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Feature, IRouteData } from '@common-stack/client-react-native';
import { connectedReactRouter_counter } from './redux';
import { filteredRoutes } from './compute.native';

export default new Feature({
    routeConfig: filteredRoutes,
    reducer: { connectedReactRouter_counter },
});
