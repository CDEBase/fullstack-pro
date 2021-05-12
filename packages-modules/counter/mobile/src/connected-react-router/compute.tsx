/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { IMenuPosition } from '@common-stack/client-react';
import { Hello } from './components/Hello';
import { Counter } from './components/Counter';
import { getFilteredRoutes } from '../utils';

enum CONNECTED_REACT_ROUTER_ROUTES_TYPES {
    HOME = '/org',
    HELLO = '/org/hello',
    COUNTER = '/org/counter',
}

export const counterPageStore: any[] = [
    {
        exact: true,
        icon: 'export',
        name: 'Hello',
        component: Hello,
        position: IMenuPosition.MIDDLE,
        key: CONNECTED_REACT_ROUTER_ROUTES_TYPES.HELLO,
        path: CONNECTED_REACT_ROUTER_ROUTES_TYPES.HELLO,
    },
    {
        exact: true,
        icon: 'export',
        name: 'Counter',
        component: Counter,
        position: IMenuPosition.MIDDLE,
        key: CONNECTED_REACT_ROUTER_ROUTES_TYPES.COUNTER,
        path: CONNECTED_REACT_ROUTER_ROUTES_TYPES.COUNTER,
    },
];

const selectedRoutesAndMenus = [
    CONNECTED_REACT_ROUTER_ROUTES_TYPES.HOME,
    CONNECTED_REACT_ROUTER_ROUTES_TYPES.HELLO,
    CONNECTED_REACT_ROUTER_ROUTES_TYPES.COUNTER,
];

// get routes
const filteredRoutes = getFilteredRoutes(counterPageStore, selectedRoutesAndMenus);

export { filteredRoutes };
