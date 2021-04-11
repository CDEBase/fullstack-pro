/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { connect } from 'react-redux';
import MainHeader from './Header';
import * as RootNavigation from './root-navigation';
import { DrawerRoute } from './Drawer';

const Layout = ({ history, routes, location, descriptors }: any) => {

    console.log('---Layout ROUTES', routes, descriptors)
    // const subRoutes = routes.filter((route: any) => route.id === 'drawer');
    console.log('--RENDER __LAYOUT')
    return (
        <>
            <MainHeader title={route?.title} />
            <DrawerRoute history={history} location={location} routes={routes} />
        </>
    );
};

export const ProLayout = connect((state: any) => {
    return {
        settings: state.settings,
        location: state.router.location,
    };
})(Layout);
