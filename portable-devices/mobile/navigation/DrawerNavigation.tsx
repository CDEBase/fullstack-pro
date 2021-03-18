import * as React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { RootNavigator } from ".";
import CounterScreen from "../screens/CounterScreen";
import CounterStackScreen from "./CounterStackScreen";

const Drawer = createDrawerNavigator();

export default function DrawerNavigation() {
  return (
    <Drawer.Navigator initialRouteName="Home">
      <Drawer.Screen name="Home" component={RootNavigator} />
      <Drawer.Screen name="Counter" component={CounterStackScreen} />
    </Drawer.Navigator>
  );
}
