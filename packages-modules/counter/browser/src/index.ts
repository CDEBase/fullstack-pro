import { Feature } from '@common-stack/client-react';

import Common from './common';
import ApolloCounter from './apollo-server-n-client';
import ReduxFirstHistory from './redux-first-history';
import EpicModule from './epics/module';
import emotion from './emotion';
// import { ElectronTrayModule } from './redux-first-history/index.electron';

export default new Feature(Common, ReduxFirstHistory, ApolloCounter, emotion, EpicModule);
// export { ElectronTrayModule };
