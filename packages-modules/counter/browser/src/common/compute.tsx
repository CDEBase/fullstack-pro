import { IMenuPosition } from '@common-stack/client-react';

import { getFilteredMenus, getFilteredRoutes } from '../utils';

export const commonPageStore: any[] = [
    {
        path: '/',
        key: 'home',
        exact: false,
        name: 'Home',
        component: () => import('../common/components/Home'),
        wrapper: () => import('../common/components/Wrapper'),
        position: IMenuPosition.MIDDLE,
    },
];

const selectedRoutesAndMenus = ['home'];

// get menus
const filteredMenus = getFilteredMenus(commonPageStore, selectedRoutesAndMenus);

// get routes
const filteredRoutes = getFilteredRoutes(commonPageStore, selectedRoutesAndMenus);

export { filteredMenus, filteredRoutes };
