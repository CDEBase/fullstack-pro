import * as React from 'react';
import { IMenuPosition } from '@common-stack/client-react';
import { getFilteredMenus, getFilteredRoutes } from '../utils';
import { ComplexWithTheme } from './components/CompledWithTheme';



export const felaPageStore: any[] = [
    {
        component: ComplexWithTheme,
        tab: 'Fela Styling',
        key: 'fela',
        position: IMenuPosition.MIDDLE,
        name: 'Fela Styling',
        path: '/fela',
    },
];

const selectedRoutesAndMenus = ['fela'];

// get menus
const filteredMenus = getFilteredMenus(felaPageStore, selectedRoutesAndMenus);

// get routes
const filteredRoutes = getFilteredRoutes(felaPageStore, selectedRoutesAndMenus);

export { filteredMenus, filteredRoutes };
