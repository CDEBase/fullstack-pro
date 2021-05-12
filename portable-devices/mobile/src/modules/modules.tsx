import * as React from 'react';
import { Feature, FeatureWithRouterFactory } from '@common-stack/client-react';
import counterModule from '@sample-stack/counter-module-mobile';
import { StatusBar } from 'expo-status-bar';
import { enableScreens } from 'react-native-screens';
import { Route } from 'react-router-native';
import LayoutModule from '../components/layout/module';
import { renderRoutes2 } from './render';

const features = new Feature(FeatureWithRouterFactory, LayoutModule, counterModule);
const configuredRoutes = features.getConfiguredRoutes();
const routes = renderRoutes2({ routes: configuredRoutes }) || [];
enableScreens();

export const MainRoute = () => {
  return (
    <>
      {configuredRoutes.map((route: any) => {
        console.log('---ROUTE_--', route);
        return (
          <Route
            key={route.path}
            exact={route.exact}
            path={route.path}
            component={(props: any) => route.component(props, route)}
          />
        )
      })}
    </>
  );
};

export default features;
