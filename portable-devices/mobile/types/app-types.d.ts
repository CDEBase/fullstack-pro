import { NavigatorScreenParams } from "@react-navigation/native";

export type DrawerScreensParamList = {
  Home: NavigatorScreenParams<RootNavigationParamList>;
  Notifications: undefined;
};

export type RootStackParamList = {
  Root: NavigatorScreenParams<BottomTabParamList>;
  NotFound: undefined;
};

export type BottomTabParamList = {
  TabOne: NavigatorScreenParams<TabOneParamList>;
  TabTwo: NavigatorScreenParams<TabTwoParamList>;
};

export type TabOneParamList = {
  TabOneScreen: undefined;
};

export type TabTwoParamList = {
  TabTwoScreen: undefined;
};
