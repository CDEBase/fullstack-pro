import * as  React from 'react';
import { Route } from 'react-router-dom';

import { reducers } from './redux';
import { resolvers, defaults, schema } from './graphql';

import { Feature } from '@common-stack/client-react';
import { filteredMenus, filteredRoutes } from './compute';

console.log('---SCHEMA ', schema);
export default new Feature({
  menuConfig: filteredMenus,
  routeConfig: filteredRoutes,
  reducer: { counter: reducers },
  clientStateParams: { resolvers, defaults, typeDefs: schema },
});
