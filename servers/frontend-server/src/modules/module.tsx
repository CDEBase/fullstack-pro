import * as React from 'react';
import { Route, Switch } from 'react-router';
import { Feature, FeatureWithRouterFactory } from '@common-stack/client-react';
import counterModules from '@sample-stack/counter-module-browser';
const features = new Feature(FeatureWithRouterFactory, counterModules);

const Layout = (props) => <div >{features.getRoutes()}</div>;
const navItem = features.navItems[0];
console.log(navItem);
export const MainRoute = (
    <div>
        {features.getRoutes()}
</div>
);

export default features;
