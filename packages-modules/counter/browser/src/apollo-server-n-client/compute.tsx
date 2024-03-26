import * as React from 'react';
import { IMenuPosition } from '@common-stack/client-react';
import { getFilteredMenus, getFilteredRoutes } from '../utils';

export const counterPageStore: any[] = [
    {
        exact: false,
        icon: 'export',
        key: 'dashboard',
        // component: Dashboard,
        tab: 'Apollo Server',
        position: IMenuPosition.MIDDLE,
        name: 'Apollo Server',
        path: '/apollo-server-n-client',
        file: import('../common/components/Dashboard'),
    },
    {
        key: 'counter',
        name: 'Counter',
        icon: 'appstore-o',
        // component: Counter,
        position: IMenuPosition.MIDDLE,
        path: '/apollo-server-n-client/counter',
        // file: import('./containers/Counter'),
    },
];

const selectedRoutesAndMenus = ['dashboard', 'counter'];

// get menus
const filteredMenus = getFilteredMenus(counterPageStore, selectedRoutesAndMenus);

// get routes
const filteredRoutes = getFilteredRoutes(counterPageStore, selectedRoutesAndMenus);

export { filteredMenus, filteredRoutes };
