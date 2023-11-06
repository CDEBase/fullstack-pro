/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import * as React from 'react';
import { IMenuPosition } from '@common-stack/client-react';
import loadable from '@loadable/component'

import { getFilteredMenus, getFilteredRoutes } from '../utils';

const ComplexWithTheme = loadable(() => import('./components/CompledWithTheme'));

export const emotionPageStore: any[] = [
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
const filteredMenus = getFilteredMenus(emotionPageStore, selectedRoutesAndMenus);

// get routes
const filteredRoutes = getFilteredRoutes(emotionPageStore, selectedRoutesAndMenus);

export { filteredMenus, filteredRoutes };
