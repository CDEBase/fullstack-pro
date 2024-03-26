/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { IMenuPosition, IRoute } from '@common-stack/client-react';

import { getFilteredMenus, getFilteredRoutes } from '../utils/menu';
import { CONNECTED_REACT_ROUTER_ROUTES_TYPES } from './constants';


export const counterPageStore = [
    {
        exact: false,
        icon: 'export',
        component: () => import('../common/components/Dashboard'),
        position: IMenuPosition.MIDDLE,
        name: 'Redux First History',
        key: CONNECTED_REACT_ROUTER_ROUTES_TYPES.HOME,
        path: CONNECTED_REACT_ROUTER_ROUTES_TYPES.HOME,
        file: '../common/components/Dashboard',
    },
    {
        exact: true,
        icon: 'export',
        name: 'Hello',
        component: () => import('./components/Hello'),
        position: IMenuPosition.MIDDLE,
        key: CONNECTED_REACT_ROUTER_ROUTES_TYPES.HELLO,
        path: CONNECTED_REACT_ROUTER_ROUTES_TYPES.HELLO,
        file: './components/Hello',
    },
    {
        exact: true,
        icon: 'export',
        name: 'Counter',
        component: () => import('./components/Counter'),
        position: IMenuPosition.MIDDLE,
        key: CONNECTED_REACT_ROUTER_ROUTES_TYPES.COUNTER,
        path: CONNECTED_REACT_ROUTER_ROUTES_TYPES.COUNTER,
        file: './components/Counter',
    },
];

const selectedRoutesAndMenus = [
    CONNECTED_REACT_ROUTER_ROUTES_TYPES.HOME,
    CONNECTED_REACT_ROUTER_ROUTES_TYPES.HELLO,
    CONNECTED_REACT_ROUTER_ROUTES_TYPES.COUNTER,
];

// get routes
const filteredRoutes = getFilteredRoutes(counterPageStore, selectedRoutesAndMenus);

// get menus
const filteredMenus = getFilteredMenus(counterPageStore, selectedRoutesAndMenus);

export { filteredRoutes, filteredMenus };
