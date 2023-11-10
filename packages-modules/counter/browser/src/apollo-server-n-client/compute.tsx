import * as React from 'react';
import { IMenuPosition } from '@common-stack/client-react';
import loadable from '@loadable/component'
import { getFilteredMenus, getFilteredRoutes } from '../utils';

const Dashboard = loadable(() => import('../common/components/Dashboard'));
const Counter = loadable(() => import('./containers/Counter'));

export const counterPageStore: any[] = [
    {
        exact: false,
        icon: 'export',
        key: 'dashboard',
        component: Dashboard,
        tab: 'Apollo Server',
        position: IMenuPosition.MIDDLE,
        name: 'Apollo Server',
        path: '/apollo-server-n-client',
    },
    {
        key: 'counter',
        name: 'Counter',
        icon: 'appstore-o',
        component: Counter,
        position: IMenuPosition.MIDDLE,
        path: '/apollo-server-n-client/counter',
    },
];

const selectedRoutesAndMenus = ['dashboard', 'counter'];

// get menus
const filteredMenus = getFilteredMenus(counterPageStore, selectedRoutesAndMenus);

// get routes
const filteredRoutes = getFilteredRoutes(counterPageStore, selectedRoutesAndMenus);

export { filteredMenus, filteredRoutes };
