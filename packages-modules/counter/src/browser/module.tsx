import * as  React from 'react';
import { Route } from 'react-router-dom';

import Counter from './containers/Counter';
import clientStateParams from './resolvers';
import reducers from './reducers';

import { Feature } from '@common-stack/client-react';

export default new Feature({
  route: <Route exact={true} path="/" component={Counter} />,
  clientStateParams,
  reducer: { counter: reducers },
});
