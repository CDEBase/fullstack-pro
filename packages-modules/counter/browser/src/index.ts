import { Feature } from '@common-stack/client-react';

import Common from './common';
import ApolloCounter from './apollo-server-n-client';
import ConnectedReactRouter from './redux-first-history';
import emotion from './emotion';
import { ElectronTrayModule } from './redux-first-history/index.electron';

export default new Feature(Common, ConnectedReactRouter, ApolloCounter, emotion);
export { ElectronTrayModule };
