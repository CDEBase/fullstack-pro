import * as React from "react";
import { Button, View, Text } from "react-native";
import {
  createDrawerNavigator,
  DrawerScreenProps,
} from "@react-navigation/drawer";
import { RootNavigator } from ".";
import { Ionicons } from "@expo/vector-icons";
import { DrawerActions, useNavigation } from "@react-navigation/native";

type DrawerScreensParamList = {
  Home: undefined;
  Notifications: undefined;
};

function CounterScreen(
  props: DrawerScreenProps<DrawerScreensParamList, "Notifications">
) {
  const { navigation } = props;
  const [counter, setCounter] = React.useState(0);

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Button onPress={() => navigation.goBack()} title="Go back home" />

      <View style={{ marginTop: 20 }}>
        <View style={{ marginBottom: 20 }}>
          <Text>Counter value: {counter}</Text>
        </View>

        <Button
          onPress={() => setCounter((c) => c + 1)}
          title="Increment Counter"
        />

        <View style={{ marginTop: 10 }}>
          <Button onPress={() => setCounter(0)} title="Reset Counter" />
        </View>
      </View>
    </View>
  );
}

const Drawer = createDrawerNavigator();

export default function DrawerNavigation() {
  return (
    <Drawer.Navigator initialRouteName="Home">
      <Drawer.Screen name="Home" component={RootNavigator} />
      <Drawer.Screen name="Counter" component={CounterScreen} />
    </Drawer.Navigator>
  );
}
