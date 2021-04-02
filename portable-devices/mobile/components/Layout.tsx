import React, {useState} from 'react';
import { Feature, FeatureWithRouterFactory } from '@common-stack/client-react';
import {matchRoutes} from "react-router-config"
import {useSelector} from "react-redux"

import {MainHeader, MainRoute} from "../modules";
import * as RootNavigation from "../routes/root-navigation"
import counterModules from '../modules/counter-module';

const features = new Feature(FeatureWithRouterFactory, counterModules);

const Layout = ({history}: any) => {
    const routes = features.getConfiguredRoutes()
    const [route, setRoute] = useState<any>({})
    const getMatchedRoute = (route: any) => {
        setRoute(route)
    }
    return(
        <>
            <MainHeader title={route.title} navigation={RootNavigation}/>
            <MainRoute history={history} routes={routes} getMatchedRoute={getMatchedRoute}/>
        </>
    )
}

export default Layout