/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Feature } from '@common-stack/client-react';
import { IMenuPosition, IRoute } from '@common-stack/client-react';
import { Counter } from './components/Counter';
import { connectedReactRouterCounter } from './redux';
import { CONNECTED_REACT_ROUTER_ROUTES_TYPES } from './constants';
import { getFilteredRoutes } from '../utils';


export const counterPageStore: IRoute[] = [
    {
        exact: true,
        icon: 'export',
        name: 'Counter',
        component: Counter,
        position: IMenuPosition.MIDDLE,
        key: CONNECTED_REACT_ROUTER_ROUTES_TYPES.ROOT,
        path: CONNECTED_REACT_ROUTER_ROUTES_TYPES.ROOT,
    },
];

const selectedRoutesAndMenus = [
    CONNECTED_REACT_ROUTER_ROUTES_TYPES.ROOT,
];
// get routes
const filteredRoutes = getFilteredRoutes(counterPageStore, selectedRoutesAndMenus);

export const ElectronTrayModule = new Feature({
    routeConfig: filteredRoutes,
    reducer: { connectedReactRouterCounter },
});

