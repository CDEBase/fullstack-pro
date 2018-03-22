import * as  React from 'react';
import { Route } from 'react-router-dom';

import Counter from './containers/Counter';
import resolvers from './resolvers';
import reducers from './reducers';

import Feature from '../connector';

export default new Feature({
  route: <Route exact={true} path="/" component={Counter} />,
  resolver: resolvers,
  reducer: { counter: reducers },
}as any);

// export default new Feature({
//   resolver: resolvers,
//   reducer: { counter: reducers },
// }as any);
