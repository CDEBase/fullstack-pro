import * as React from 'react';
import { IMenuPosition } from '@common-stack/client-react';
import { lazy } from '@loadable/component'
import { getFilteredMenus, getFilteredRoutes } from '../utils';

const Dashboard = lazy(() => import('../common/components/Dashboard'));
const Counter = lazy(() => import('./containers/Counter'));

export const counterPageStore: any[] = [
    {
        exact: false,
        icon: 'export',
        key: 'dashboard',
        component: Dashboard,
        tab: 'Apollo Server & Client',
        position: IMenuPosition.MIDDLE,
        name: 'Apollo Server & Client',
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
