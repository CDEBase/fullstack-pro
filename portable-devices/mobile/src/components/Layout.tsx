/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { Feature, FeatureWithRouterFactory } from '@common-stack/client-react';
import { connect } from 'react-redux';
import { MainHeader, DrawerRoute } from '../modules';
import * as RootNavigation from '../routes/root-navigation';
import { Dashboard } from '../pages';
import counterModules from '../modules/counter-module';

const features = new Feature(FeatureWithRouterFactory, counterModules);

const Layout = ({ history, routes, location }: any) => {
    const subRoutes = routes.filter((route: any) => route.id === 'drawer');
    const [route, setRoute] = useState<any>({});
    const getMatchedRoute = (route: any) => {
        setRoute(route);
    };
    return (
        <>
            <MainHeader title={route?.title} navigation={RootNavigation} />
            <DrawerRoute history={history} getMatchedRoute={getMatchedRoute} location={location} routes={subRoutes} />
        </>
    );
};

export const ProLayout = connect((state: any) => {
    return {
        settings: state.settings,
        location: state.router.location,
    };
})(Layout);

export default new Feature({
    routeConfig: [
        {
            '/org': {
                exact: true,
                component: ProLayout,
            },
        },
        {
            '/': {
                exact: true,
                component: Dashboard,
            },
        },
    ],
});
