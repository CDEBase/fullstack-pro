import React from 'react';
import { NavigatorItem, isStackOrTab } from './types';

const childrenToRoutes = (
    children: { [name: string]: NavigatorItem },
    parentNavigator: NavigatorItem,
    parentRouteName: string,
) => Object.entries(children).map(([key, child]: any) => resolveRoute(key, child, parentNavigator, parentRouteName));

const resolveRoute = (
    routeName: string | null,
    route: any,
    // parentNavigator: NavigatorItem,
    parentNavigator: any,
    parentRouteName: string,
) => {
    if (isStackOrTab(route)) {
        const navigatorRouteName = parentRouteName + (routeName === null ? '' : '.' + routeName);
        const navigator = (
            <route.container.Navigator
                {...route.props}
                key={navigatorRouteName}
                children={childrenToRoutes(route.children, route, navigatorRouteName)}
            />
        );
        if (!parentNavigator) {
            return navigator;
        } else {
            return (
                <parentNavigator.container.Screen
                    key={navigatorRouteName}
                    name={navigatorRouteName}
                    children={() => navigator}
                />
            );
        }
    } else {
        const { component: C, ...rest } = route.props;
        const screenName = parentRouteName + '.' + routeName;
        return <parentNavigator.container.Screen {...rest} key={screenName} name={screenName} children={() => <C />} />;
    }
};

const resolveRootRoute = (rootRoute: NavigatorItem, rootRouteName: string) =>
    resolveRoute(null, rootRoute, null, rootRouteName);

export default resolveRootRoute;
