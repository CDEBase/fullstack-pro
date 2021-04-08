/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from 'react';
import { History } from 'history';
import { Feature, FeatureWithRouterFactory, renderRoutes2 } from '@common-stack/client-react';
import counterModule from '@sample-stack/counter-module-browser/lib/index.native';
import { Navigation } from '../routes/main-navigation';
import LayoutModule from '../components/layout/module';

const features = new Feature(FeatureWithRouterFactory, LayoutModule, counterModule);
const configuredRoutes = features.getConfiguredRoutes();
const routes = renderRoutes2({ routes: configuredRoutes });

console.log('--ROUTES', routes)
export const MainRoute = (props: { history: History<any> }) => {
    return (
        <Navigation
            history={props.history}
            routes={routes}
            defaultTitle="Test"
            initialRouteName="/"
            screenOptions={{}}
        />
    );
};

export default features;
