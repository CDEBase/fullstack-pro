import { Feature } from '@common-stack/client-react';
import { connectedReactRouterCounter } from '@sample-stack/counter-module-browser/lib/connected-react-router/redux/reducers/counter';
import { onCountChangedEpic } from './epics';
import { config } from './config';

console.log('Test Envalid', config.APP_NAME1);
const ElectronMainModule = new Feature({
    reducer: { connectedReactRouterCounter },
    epic: [onCountChangedEpic],
});

export default new Feature(ElectronMainModule);
