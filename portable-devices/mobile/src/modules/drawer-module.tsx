import * as React from 'react';
import { History } from 'history';
import {createDrawerNavigator} from "@react-navigation/drawer"
import { matchPath, __RouterContext as RouterContext } from 'react-router';

const Drawer = createDrawerNavigator()

export const DrawerRoute = (props: { history: History<any>, location: any, routes: any, getMatchedRoute: any }) => {

    return (
    <Drawer.Navigator initialRouteName={"/org/calendar"}>
        {props.routes.map((route: any) => (
            <Drawer.Screen
                name={route.name}
                key={route.key}
                options={{
                    ...route.options,
                    title: route.title,
                }}
                component={route.component}
                />
             ))}
        </Drawer.Navigator>
    )
}