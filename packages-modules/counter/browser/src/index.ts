import { Feature } from '@common-stack/client-react';

import Common from './common';
import ApolloCounter from './apollo-server-n-client';
// import ConnectedReactRouter from './connected-react-router';
import emotion from './emotion';
// import { ElectronTrayModule } from './connected-react-router/index.electron';

export default new Feature(Common, ApolloCounter, emotion);
// export { ElectronTrayModule };
