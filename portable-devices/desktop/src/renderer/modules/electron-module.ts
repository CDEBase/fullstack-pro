import { ElectronModule } from '@sample-stack/counter-module-browser';
import { Feature, FeatureWithRouterFactory } from '@common-stack/client-react';
import counterModules from '@sample-stack/counter-module-browser';

const features = new Feature(FeatureWithRouterFactory, counterModules);

export const MainRoute = (props) => features.getRoutes();