import * as React from "react";
import { IMenuPosition } from "@common-stack/client-react";
import { Feature, IRouteData } from "@common-stack/client-react";
import MainHeader from "./header"
import { View, Text } from "react-native";

export enum CONNECTED_REACT_ROUTER_ROUTES_TYPES {
    HOME = "/",
    HELLO = "/hello",
    COUNTER = "/counter",
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

const Counter = () => {
  return(
    <>
    <MainHeader title="Counter"/>
    <View style={{ marginTop: 20 }}>
        <View style={{ marginBottom: 20 }}>
        <Text>Counter value</Text>
        </View>
    </View>
      </>
  );
}

const Dashboard = () => {
  return(
    <>
    <MainHeader title="Dashboard"/>
    <View style={{ marginTop: 20 }}>
        <View style={{ marginBottom: 20 }}>
        <Text>Dashboard value</Text>
        </View>
    </View>
      </>
  );
}
const Hello = () => {
  return(
    <>
    <MainHeader title="Hello"/>
    <View style={{ marginTop: 20 }}>
        <View style={{ marginBottom: 20 }}>
        <Text>Hello value</Text>
        </View>
    </View>
      </>
  );
}

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
        name: "Counter",
        title: "Counter",
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
const filteredRoutes = getFilteredRoutes(
    counterPageStore,
    selectedRoutesAndMenus
);

export default new Feature({
    routeConfig: filteredRoutes as any,
});
