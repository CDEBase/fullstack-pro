import * as React from 'react';
import { IMenuPosition } from '@common-stack/client-react';

import { Home } from '../common/components/Home';
import { getFilteredRoutes } from '../utils';

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


// get routes
const filteredRoutes = getFilteredRoutes(commonPageStore, selectedRoutesAndMenus);

export { filteredRoutes };
