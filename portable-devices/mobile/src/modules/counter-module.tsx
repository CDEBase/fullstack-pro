import * as React from "react";
import { IMenuPosition } from "@common-stack/client-react";
import { Feature, FeatureWithRouterFactory } from "@common-stack/client-react";
import { Hello, CalendarScreen} from "../pages"
import childModules from "./child-modules"

const features = new Feature(FeatureWithRouterFactory, childModules);

const subRoutes = features.getConfiguredRoutes();

export enum CONNECTED_REACT_ROUTER_ROUTES_TYPES {
    HELLO = "/org/hello",
    CALENDAR = "/org/calendar",
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
        exact: true,
        icon: "export",
        name: "Hello",
        title: "Hello",
        component: Hello, 
        id: 'drawer',
        position: IMenuPosition.MIDDLE,
        key: CONNECTED_REACT_ROUTER_ROUTES_TYPES.HELLO,
        path: CONNECTED_REACT_ROUTER_ROUTES_TYPES.HELLO,
        /* childern: subRoutes */
    },
    {
        exact: true,
        icon: "export",
        name: "Calendar",
        title: "Calendar",
        id: 'drawer',
        component: CalendarScreen,
        position: IMenuPosition.MIDDLE,
        key: CONNECTED_REACT_ROUTER_ROUTES_TYPES.CALENDAR,
        path: CONNECTED_REACT_ROUTER_ROUTES_TYPES.CALENDAR,
    },
];

const selectedRoutesAndMenus = [
    CONNECTED_REACT_ROUTER_ROUTES_TYPES.HELLO,
    CONNECTED_REACT_ROUTER_ROUTES_TYPES.CALENDAR,
];

// get routes
const filteredRoutes = getFilteredRoutes(
    counterPageStore,
    selectedRoutesAndMenus
);

console.log('-FILERERED ORUTES', filteredRoutes);
export default new Feature({
    routeConfig: filteredRoutes as any,
});
