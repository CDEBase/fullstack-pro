import * as React from 'react';
import { Route } from 'react-router-dom';
import { Feature, FeatureWithRouterFactory } from '@common-stack/client-react';
import counterModules from '@sample-stack/counter/lib/browser';
const features =   new Feature(FeatureWithRouterFactory, counterModules);

const Layout = (props) => <div >{features.getRoutes()}</div>;

export const MainRoute =  features.getRoutes();

export default features;
