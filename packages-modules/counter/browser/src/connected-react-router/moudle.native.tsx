import * as React from 'react';
import { Feature, IRouteData } from '@common-stack/client-react-native';


export default new Feature({
    navItem: () => <NavBar />, // although not used
    routeConfig: filteredRoutes,
    reducer: { connectedReactRouter_counter },
});
