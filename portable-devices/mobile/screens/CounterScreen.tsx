import { DrawerScreenProps } from "@react-navigation/drawer";
import * as React from "react";
import { Button, View, Text } from "react-native";
import { DrawerScreensParamList } from "../types/app-types";

function CounterScreen(
  props: DrawerScreenProps<DrawerScreensParamList, "Notifications">
) {
  const { navigation } = props;
  const [counter, setCounter] = React.useState(0);

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Button
        onPress={() => navigation.goBack()}
        title="Go back home"
        testID="go-back-home-btn"
      />

      <View style={{ marginTop: 20 }}>
        <View style={{ marginBottom: 20 }}>
          <Text>Counter value: {counter}</Text>
        </View>

        <Button
          onPress={() => setCounter((c) => c + 1)}
          title="Increment Counter"
          testID="inc-btn"
        />

        <View style={{ marginTop: 10 }}>
          <Button
            onPress={() => setCounter(0)}
            title="Reset Counter"
            testID="reset-btn"
          />
        </View>
      </View>
    </View>
  );
}

export default CounterScreen;
