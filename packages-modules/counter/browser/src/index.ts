import { Feature } from '@common-stack/client-react';

import Common from './common';
import ApolloCounter from './apollo-server-n-client';
import ConnectedReactRouter from './connected-react-router';

export default new Feature(Common, ConnectedReactRouter, ApolloCounter);

