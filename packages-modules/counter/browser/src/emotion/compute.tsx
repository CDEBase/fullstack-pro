/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { IMenuPosition } from '@common-stack/client-react';

import { getFilteredMenus, getFilteredRoutes } from '../utils';

export const emotionPageStore: any[] = [
    {
        // component: ComplexWithTheme,
        tab: 'Emotion Styling',
        key: 'emotion',
        position: IMenuPosition.MIDDLE,
        name: 'Emotion Styling',
        path: '/emotion',
        file: import('./components/CompledWithTheme')
    },
];

const selectedRoutesAndMenus = ['emotion'];

// get menus
const filteredMenus = getFilteredMenus(emotionPageStore, selectedRoutesAndMenus);

// get routes
const filteredRoutes = getFilteredRoutes(emotionPageStore, selectedRoutesAndMenus);

export { filteredMenus, filteredRoutes };
