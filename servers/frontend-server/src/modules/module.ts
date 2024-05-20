import "reflect-metadata";
import { Feature } from '@common-stack/client-react';
import CounterModule from '@sample-stack/counter-module-browser';
import '@sample-stack/assets';

const features = new Feature(
    CounterModule,
);

export const plugins = features.getComponentFillPlugins();
export default features;
