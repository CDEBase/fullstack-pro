import * as React from 'react';
import { History } from 'history';
import { DrawerNavigation } from '../routes/drawer-navigation';

export const DrawerRoute = (props: { history: History<any>, routes: any, getMatchedRoute: any }) => {
    return <DrawerNavigation
        history={props.history}
        routes={props.routes}
        defaultTitle={'Test'}
        initialRouteName={'/'}
        getMatchedRoute={props.getMatchedRoute}
        screenOptions={{}}
    />
}