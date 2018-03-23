import { Feature, FeatureWithRouterFactory } from '@common-stack/client-react';
import counterModules from '@sample-stack/counter/lib/browser';
export const modules =  new Feature(FeatureWithRouterFactory, counterModules);
