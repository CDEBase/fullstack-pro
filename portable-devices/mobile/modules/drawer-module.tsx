import * as React from 'react';
import { History } from 'history';
import { DrawerNavigation } from '../routes/drawer-navigation';

export const DrawerRoute = (props: { history: History<any>, location: any, routes: any }) => {
    console.log('---DRAWER ___PROPS', props)
    return <DrawerNavigation
        history={props.history}
        routes={props.routes}
        location={props.location}
        defaultTitle={'Test'}
        initialRouteName={'/org'}
        // getMatchedRoute={props.getMatchedRoute}
        screenOptions={{}}
    />
}