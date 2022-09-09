import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';

import { RootAppNavigators, resolveRootRoute } from '../../react-navigation';
import { Dashboard, Hello, Settings, PersonalInfo } from '../../pages';

export const Navigation = () => {
    const rootRoutes: RootAppNavigators = {
        MainStack: {
            container: createStackNavigator(),
            props: {
                initialRouteName: 'Guest',
                screenOptions: {
                    headerShown: false,
                },
            },
            children: {
                Guest: {
                    container: createBottomTabNavigator(),
                    props: {
                        initialRouteName: 'Home',
                        screenOptions: {
                            headerShown: false,
                            tabBarLabel: 'About',
                            tabBarIcon: ({ color }) => <Ionicons name="person" size={24} color={color} />,
                        },
                    },
                    children: {
                        Home: {
                            props: {
                                initialParams: {},
                                component: Dashboard,
                                options: {
                                    headerShown: true,
                                    tabBarLabel: 'Home',
                                    headerTitle: 'Home',
                                    tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />,
                                },
                            },
                        },
                        About: {
                            container: createStackNavigator(),
                            props: {
                                initialRouteName: 'Hello',
                            },
                            children: {
                                Hello: {
                                    props: {
                                        initialParams: {},
                                        component: Hello,
                                        options: {
                                            headerTitle: 'About',
                                        },
                                    },
                                },
                                PersonalInfo: {
                                    props: {
                                        initialParams: { name: 'Test' },
                                        component: PersonalInfo,
                                        options: {
                                            headerTitle: 'Personal Info',
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                Setting: {
                    props: {
                        initialParams: {},
                        component: Settings,
                        options: {
                            headerShown: true,
                            headerTitle: 'Settings',
                            headerBackTitle: 'Back',
                        },
                    },
                },
            },
        },
    };

    const MainStack = resolveRootRoute(rootRoutes.MainStack, 'MainStack');
    return <NavigationContainer>{MainStack}</NavigationContainer>;
};
