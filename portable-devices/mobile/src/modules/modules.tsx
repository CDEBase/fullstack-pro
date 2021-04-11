/* eslint-disable react/style-prop-object */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useRef } from 'react';
import { History } from 'history';
import { Feature, FeatureWithRouterFactory } from '@common-stack/client-react';
import { NativeRouter } from 'react-router-native';
import { StatusBar } from 'expo-status-bar';
import counterModule from '@sample-stack/counter-module-browser/lib/index.native';
import { enableScreens } from 'react-native-screens';
import LayoutModule from '../components/layout/module';
import { renderRoutes2 } from './render';

const features = new Feature(LayoutModule, counterModule);
const configuredRoutes = features.getConfiguredRoutes();

const routes = renderRoutes2({ routes: configuredRoutes });
enableScreens();

console.log('--ROUTES', routes);
export const MainRoute = (props: { history: History<any> }) => {
    return (
        <NativeRouter>
            {routes}
            <StatusBar style="auto" />
        </NativeRouter>
    );
};

export default features;
