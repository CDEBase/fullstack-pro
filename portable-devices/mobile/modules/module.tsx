import * as React from 'react';
import { Feature, FeatureWithRouterFactory } from '@common-stack/client-react';
// import counterModules from '@sample-stack/counter-module-browser';
import { History } from 'history';
import { Navigation } from '../routes/navigation';
import counterModules from './counter-module';

const features = new Feature(FeatureWithRouterFactory, counterModules);

export const MainRoute = (props: { history: History<any>, routes: any, getMatchedRoute: any }) => {
    return <Navigation
        history={props.history}
        routes={props.routes}
        defaultTitle={'Test'}
        initialRouteName={'/'}
        getMatchedRoute={props.getMatchedRoute}
        screenOptions={{}}
    />
}

export default features;