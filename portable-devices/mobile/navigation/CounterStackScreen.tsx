import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import CounterScreen from "../screens/CounterScreen";
import { Ionicons } from "@expo/vector-icons";
import { DrawerActions, useNavigation } from "@react-navigation/native";

const CounterStack = createStackNavigator();

function CounterStackScreen() {
  const navigation = useNavigation();
  return (
    <CounterStack.Navigator
      screenOptions={{
        headerLeft: () => (
          <Ionicons
            name="menu"
            style={{ marginLeft: 10 }}
            size={32}
            onPress={() => {
              navigation.dispatch(DrawerActions.openDrawer());
            }}
          />
        ),
      }}
    >
      <CounterStack.Screen name="CounterScreen" component={CounterScreen} />
    </CounterStack.Navigator>
  );
}

export default CounterStackScreen;
