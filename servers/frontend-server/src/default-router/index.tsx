import * as React from 'react';
import { Switch } from 'react-router-dom';
import modules from '@sample-stack/counter/lib/browser';
import { Feature } from '@common-stack/client-react';

console.log(modules);
console.log(modules.route);
const routerFactory = () => <Switch>{modules.routes}</Switch>;

export default new Feature({
  routerFactory,
});
