import { Feature, FeatureWithRouterFactory } from '@common-stack/client-react';
import counterModules from '@sample-stack/counter/lib/browser';
export default  new Feature(FeatureWithRouterFactory, counterModules);
