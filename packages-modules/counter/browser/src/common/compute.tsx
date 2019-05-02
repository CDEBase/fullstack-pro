import * as React from 'react';
import { IMenuPosition } from '@common-stack/client-react';

import { Home } from '../common/components/Home';
import { getFilteredMenus, getFilteredRoutes } from '../utils';

export const commonPageStore: any[] = [
    {
        path: '/',
        key: 'home',
        exact: true,
        name: 'Home',
        component: Home,
        position: IMenuPosition.MIDDLE,
    },
];

const selectedRoutesAndMenus = ['home'];

// get menus
const filteredMenus = getFilteredMenus(commonPageStore, selectedRoutesAndMenus);

// get routes
const filteredRoutes = getFilteredRoutes(commonPageStore, selectedRoutesAndMenus);

export { filteredMenus, filteredRoutes };
