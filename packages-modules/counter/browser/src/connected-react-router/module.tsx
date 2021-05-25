/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import * as React from 'react';
import { Feature } from '@common-stack/client-react';
import { Counter } from './components/Counter';
import NavBar from './components/NavBar';
import { connectedReactRouterCounter } from './redux';
import { filteredRoutes, filteredMenus } from './compute';

export default new Feature({
    navItem: <Counter />, // used in electron
    menuConfig: filteredMenus,
    routeConfig: filteredRoutes,
    reducer: { connectedReactRouterCounter },
});
