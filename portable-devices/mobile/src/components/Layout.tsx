import React from 'react';
import { Feature } from '@common-stack/client-react';
import {DrawerModule} from "../modules";
import { connect } from 'react-redux';
import {Dashboard} from "../pages"

const Layout = ({history, routes, location}: any) => {
    let subRoutes = routes.find((route: any) => route.routes)
    return(
        <>
            <DrawerModule history={history} location={location} routes={subRoutes.routes}/>
        </>
    )
}

export const ProLayout = connect((state: any) => {
    return ({
    settings: state.settings,
    location: state.router.location,
    })
})(Layout);

export default new Feature({
    routeConfig: [
        {
            ['/org']:{
                exact:false,
                component: ProLayout
            },
        },
        {
            ['/']:{
                exact: true,
                component: Dashboard,
            }
        }
    ],
});