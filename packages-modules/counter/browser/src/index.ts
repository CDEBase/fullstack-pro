import ApolloCounter from './apollo-server-n-client';
import { Feature } from '@common-stack/client-react';
import ConnectedReactRouter from './connected-react-router';

export default new Feature(ConnectedReactRouter, ApolloCounter);

