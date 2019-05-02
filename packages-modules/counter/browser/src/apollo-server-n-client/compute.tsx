import * as React from 'react';
import { IMenuPosition } from '@common-stack/client-react';

import Counter from './containers/Counter';
import { Dashboard } from '../common/components/Dashboard';
import { getFilteredMenus, getFilteredRoutes } from '../utils';

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
