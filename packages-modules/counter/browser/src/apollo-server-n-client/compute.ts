import * as React from 'react';
import { IMenuPosition } from '@common-stack/client-react';

import Counter from './containers/Counter';
import { Dashboard } from './containers/Dashboard';
import { getFilteredMenus, getFilteredRoutes } from '../utils';

export const counterPageStore: any[] = [
    {
        exact: false,
        name: 'Counter',
        path: '/counter',
        key: 'counter',
        icon: 'appstore-o',
        component: Counter,
        position: IMenuPosition.MIDDLE,
    } as any,
    {
        path: '/',
        name: 'Home',
        icon: 'export',
        key: 'dashboard',
        exact: true,
        component: Dashboard,
        position: IMenuPosition.MIDDLE,
    },
];

const selectedRoutesAndMenus = ['dashboard', 'counter'];

// get menus
const filteredMenus = getFilteredMenus(counterPageStore, selectedRoutesAndMenus);

// get routes
const filteredRoutes = getFilteredRoutes(counterPageStore, selectedRoutesAndMenus);

export { filteredMenus, filteredRoutes };
