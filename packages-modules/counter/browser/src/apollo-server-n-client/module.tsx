import * as  React from 'react';
import { Route } from 'react-router-dom';

import { reducers } from './redux';
import { resolvers, defaults } from './graphql';

import { Feature } from '@common-stack/client-react';
import { filteredMenus, filteredRoutes } from './compute';

export default new Feature({
  resolver: resolvers,
  menuConfig: filteredMenus,
  routeConfig: filteredRoutes,
  reducer: { counter: reducers },
  clientStateParams: { resolvers, defaults },
});
