import * as React from 'react';
import { Feature, IRouteData } from '@common-stack/client-react';
import { CONNECTED_REACT_ROUTER_ROUTES_TYPES } from './constants';
import { Counter } from './components/Counter';
import { Hello } from './components/Hello';
import NavBar from './components/NavBar';
import NoMatch from './components/NoMatch';
import { Home } from './components/Home';
import { connectedReactRouter_counter } from './redux';
import { filteredMenus, filteredRoutes } from './compute';

export default new Feature({
    navItem: () => <NavBar />, // although not used
    menuConfig: filteredMenus,
    routeConfig: filteredRoutes,
    reducer: { connectedReactRouter_counter },
});
