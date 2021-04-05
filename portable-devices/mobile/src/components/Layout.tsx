import React, {useState} from 'react';
import { Feature, FeatureWithRouterFactory } from '@common-stack/client-react';
import {MainHeader, DrawerRoute} from "../modules";
import * as RootNavigation from "../routes/root-navigation"
import { connect } from 'react-redux';


const Layout = ({history, routes, location}: any) => {
    console.log('---LAYOUT ROUTES AND HISTORY', history, routes)
    const [route, setRoute] = useState<any>({})
    // const getMatchedRoute = (route: any) => {
    //     setRoute(route)
    // }
    return(
        <>
            <MainHeader title={route?.title} navigation={RootNavigation}/>
            <DrawerRoute history={history} location={location} routes={routes}/>
        </>
    )
}

export const ProLayout = connect(({ settings, router }: any) => ({
    settings,
    location: router.location,
}))(Layout);

export default new Feature({
    routeConfig: [
        {
            ['/org']:{
                exact:false,
                component: ProLayout
            }
        }
    ],
});