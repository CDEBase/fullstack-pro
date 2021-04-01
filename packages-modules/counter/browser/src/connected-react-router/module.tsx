import * as React from 'react';
import { Feature } from '@common-stack/client-react';
import NavBar from './components/NavBar';
import { connectedReactRouter_counter } from './redux';
import { filteredRoutes } from './compute';

export default new Feature({
    navItem: () => <NavBar />, // although not used
    routeConfig: filteredRoutes,
    reducer: { connectedReactRouter_counter },
});
