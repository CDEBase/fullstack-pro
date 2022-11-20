import { ComponentProps } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

interface Navigator<T extends (...args: any) => any> {
	container: ReturnType<T>;
	props: Omit<ComponentProps<ReturnType<T>['Navigator']>, 'name' | 'children'>;
	children: {
		[routeName: string]: NavigatorItem;
	};
}

export type TabNavigator = Navigator<typeof createBottomTabNavigator>;
export type StackNavigationNavigator = Navigator<typeof createStackNavigator>;

interface StackNavigationScreen {
	props: Omit<
		ComponentProps<ReturnType<typeof createStackNavigator>['Screen']>,
		'name'
	> & { component: any };
}

interface TabNavigationScreen {
	props: Omit<
		ComponentProps<ReturnType<typeof createBottomTabNavigator>['Screen']>,
		'name'
	> & { component: any };
}

export type NavigatorItem =
	| StackNavigationNavigator
	| StackNavigationScreen
	| TabNavigator
	| TabNavigationScreen;

export type RootAppNavigators = {
	[routeName: string]: NavigatorItem;
};

export const isStackOrTab = (s: NavigatorItem): s is Navigator<any> =>
	s.hasOwnProperty('children');
