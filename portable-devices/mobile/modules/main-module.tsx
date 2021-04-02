import * as React from 'react';
import { Feature, FeatureWithRouterFactory } from '@common-stack/client-react';
// import counterModules from '@sample-stack/counter-module-browser';
import { History } from 'history';
import { Navigation } from '../routes/main-navigation';
import Layout from "../components/Layout"

const features = new Feature(FeatureWithRouterFactory, Layout);

export const MainRoute = (props: { history: History<any>}) => {
    const routes = features.getConfiguredRoutes()
    return <Navigation
        history={props.history}
        routes={routes}
        defaultTitle={'Test'}
        initialRouteName={'/CDMBase'}
        screenOptions={{}}
    />
}

export default features;