import * as React from 'react';
import { Feature, FeatureWithRouterFactory } from '@common-stack/client-react';
// import counterModules from '@sample-stack/counter-module-browser';
import { History } from 'history';
import { Navigation } from '../routes/navigation';
import counterModules from './counter-module';

const features = new Feature(FeatureWithRouterFactory, counterModules);


export const MainRoute = (props: { history: History<any> }) => {
    const routes = features.getConfiguredRoutes();
    console.log('--Routes---', routes);
    return <Navigation
        history={props.history}
        routes={routes}
        defaultTitle={'Test'}
        initialRouteName={'/'}
        screenOptions={{}}
    />
}

export default features;