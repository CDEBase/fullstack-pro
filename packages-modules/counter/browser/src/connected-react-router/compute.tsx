import * as React from 'react';
import { IMenuPosition } from '@common-stack/client-react';

import { Hello } from './components/Hello';
import { Counter } from './components/Counter';
import { Dashboard } from '../common/components/Dashboard';
import { getFilteredMenus, getFilteredRoutes } from '../utils';
import { CONNECTED_REACT_ROUTER_ROUTES_TYPES } from './constants';

export const counterPageStore: any[] = [
    {
        exact: false,
        icon: 'export',
        component: Dashboard,
        position: IMenuPosition.MIDDLE,
        name: 'Connected React Router',
        key: CONNECTED_REACT_ROUTER_ROUTES_TYPES.HOME,
        path: CONNECTED_REACT_ROUTER_ROUTES_TYPES.HOME,
    },
    {
        exact: true,
        icon: 'export',
        name: 'Hello',
        component: Hello,
        position: IMenuPosition.MIDDLE,
        key: CONNECTED_REACT_ROUTER_ROUTES_TYPES.HELLO,
        path: CONNECTED_REACT_ROUTER_ROUTES_TYPES.HELLO,
    },
    {
        exact: true,
        icon: 'export',
        name: 'Counter',
        component: Counter,
        position: IMenuPosition.MIDDLE,
        key: CONNECTED_REACT_ROUTER_ROUTES_TYPES.COUNTER,
        path: CONNECTED_REACT_ROUTER_ROUTES_TYPES.COUNTER,
    },
];

const selectedRoutesAndMenus = [
    CONNECTED_REACT_ROUTER_ROUTES_TYPES.HOME,
    CONNECTED_REACT_ROUTER_ROUTES_TYPES.HELLO,
    CONNECTED_REACT_ROUTER_ROUTES_TYPES.COUNTER,
];

// get menus
const filteredMenus = getFilteredMenus(counterPageStore, selectedRoutesAndMenus);

// get routes
const filteredRoutes = getFilteredRoutes(counterPageStore, selectedRoutesAndMenus);

export { filteredMenus, filteredRoutes };
