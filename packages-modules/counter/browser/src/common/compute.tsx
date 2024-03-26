import { IMenuPosition } from '@common-stack/client-react';

import { getFilteredMenus, getFilteredRoutes } from '../utils';

export const commonPageStore: any[] = [
    {
        path: '/',
        key: 'home',
        exact: true,
        name: 'Home',
        component: () => import('../common/components/Home'),
        position: IMenuPosition.MIDDLE,
        file: '../common/components/Home',
    },
];

const selectedRoutesAndMenus = ['home'];

// get menus
const filteredMenus = getFilteredMenus(commonPageStore, selectedRoutesAndMenus);

// get routes
const filteredRoutes = getFilteredRoutes(commonPageStore, selectedRoutesAndMenus);

export { filteredMenus, filteredRoutes };
