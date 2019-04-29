import * as React from 'react';
import { Feature, IRouteData } from '@common-stack/client-react';
import { CONNECTED_REACT_ROUTER_ROUTES_TYPES } from './constants';
import { Counter } from './components/Counter';
import { Hello } from './components/Hello';
import NavBar from './components/NavBar';
import NoMatch from './components/NoMatch';
import { Home } from './components/Home';
import { connectedReactRouter_counter } from './redux';

export default new Feature({
    routeConfig: [{
        // [CONNECTED_REACT_ROUTER_ROUTES_TYPES.HOME]: { component: Home },
        [CONNECTED_REACT_ROUTER_ROUTES_TYPES.HELLO]: { component: Hello, exact: true },
        [CONNECTED_REACT_ROUTER_ROUTES_TYPES.COUNTER]: { component: Counter, exact: true },
    }] as IRouteData[],
    reducer: { connectedReactRouter_counter },
    navItem: () => <NavBar />,
});
