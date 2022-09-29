/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import * as React from 'react';
import { IMenuPosition } from '@common-stack/client-react';
import { lazy } from '@loadable/component'

import { getFilteredMenus, getFilteredRoutes } from '../utils';

const ComplexWithTheme = lazy(() => import('./components/CompledWithTheme'));

export const felaPageStore: any[] = [
    {
        component: ComplexWithTheme,
        tab: 'Emotion Styling',
        key: 'emotion',
        position: IMenuPosition.MIDDLE,
        name: 'Emotion Styling',
        path: '/emotion',
    },
];

const selectedRoutesAndMenus = ['emotion'];

// get menus
const filteredMenus = getFilteredMenus(felaPageStore, selectedRoutesAndMenus);

// get routes
const filteredRoutes = getFilteredRoutes(felaPageStore, selectedRoutesAndMenus);

export { filteredMenus, filteredRoutes };
