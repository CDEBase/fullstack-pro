import * as  React from 'react';
import { Route } from 'react-router-dom';

import Counter from './containers/Counter';
import { resolvers, defaults } from './resolvers';
import reducers from './reducers';

import { Feature } from '@common-stack/client-react';

const ROUTE_PATH = '/';
export default new Feature({
  routeConfig: [{ [ROUTE_PATH]: { path: '/', component: Counter } }],
  clientStateParams: { resolvers, defaults },
  resolver: resolvers,
  reducer: { counter: reducers },
});
