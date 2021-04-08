/* eslint-disable react/no-unused-prop-types */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import * as React from 'react';
import { History } from 'history';
// import { DrawerNavigation } from './drawer-navigation';
import SideBar from './SideBar';

export const DrawerRoute = (props: { history: History<any>; location: any; routes: any; getMatchedRoute: any }) => {
    return (
        <SideBar
            history={props.history}
            routes={props.routes}
            defaultTitle="Test"
            initialRouteName="/org/calendar"
            screenOptions={{}}
        />
    );
};
