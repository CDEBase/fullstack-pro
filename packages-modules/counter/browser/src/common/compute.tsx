import * as React from 'react';
import { IMenuPosition } from '@common-stack/client-react';
import loadable from '@loadable/component'

import { getFilteredMenus, getFilteredRoutes } from '../utils';

const Home = loadable(() => import('../common/components/Home'));

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
