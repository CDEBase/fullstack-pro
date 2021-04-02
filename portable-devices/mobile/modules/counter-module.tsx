import * as React from "react";
import { IMenuPosition } from "@common-stack/client-react";
import { Feature, IRouteData } from "@common-stack/client-react";
import { View, Text } from "react-native";
import {Dashboard, Hello, Calendar} from "../pages"

export enum CONNECTED_REACT_ROUTER_ROUTES_TYPES {
    HOME = "/",
    HELLO = "/hello",
    CALENDAR = "/calendar",
}

export const getFilteredRoutes = (
    accountPageStore: [{ key: string; path: string; valid: boolean }],
    selectedRoutes: any
) =>
    accountPageStore
        .map((item) => {
            if (selectedRoutes.indexOf(item.key) !== -1) {
                const { path } = item;
                return {
                    [path]: item,
                };
            }
            return null;
        })
        .filter((valid) => valid);

export const counterPageStore: any = [
    {
        exact: false,
        icon: "export",
        component: Dashboard,
        position: IMenuPosition.MIDDLE,
        name: "Connected React Router",
        key: CONNECTED_REACT_ROUTER_ROUTES_TYPES.HOME,
        path: CONNECTED_REACT_ROUTER_ROUTES_TYPES.HOME,
        title: "Dashboard",
        headerTintColor: "#ffffff",
        headerTitleStyle: {
            fontWeight: "bold",
        },
        headerStyle: {
            backgroundColor: "#FFC100",
        },
    },
    {
        exact: true,
        icon: "export",
        name: "Hello",
        component: Hello,
        title: "Hello",
        position: IMenuPosition.MIDDLE,
        key: CONNECTED_REACT_ROUTER_ROUTES_TYPES.HELLO,
        path: CONNECTED_REACT_ROUTER_ROUTES_TYPES.HELLO,
    },
    {
        exact: true,
        icon: "export",
        name: "Calendar",
        title: "Calendar",
        component: Calendar,
        position: IMenuPosition.MIDDLE,
        key: CONNECTED_REACT_ROUTER_ROUTES_TYPES.CALENDAR,
        path: CONNECTED_REACT_ROUTER_ROUTES_TYPES.CALENDAR,
    },
];

const selectedRoutesAndMenus = [
    CONNECTED_REACT_ROUTER_ROUTES_TYPES.HOME,
    CONNECTED_REACT_ROUTER_ROUTES_TYPES.HELLO,
    CONNECTED_REACT_ROUTER_ROUTES_TYPES.CALENDAR,
];

// get routes
const filteredRoutes = getFilteredRoutes(
    counterPageStore,
    selectedRoutesAndMenus
);

export default new Feature({
    routeConfig: filteredRoutes as any,
});
