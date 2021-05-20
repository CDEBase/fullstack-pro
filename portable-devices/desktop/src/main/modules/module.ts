import { Feature } from '@common-stack/client-react';
import ElectronMainModule from '@sample-stack/counter-module-electron';
import { basicModule } from './local-module';

const modules = new Feature(ElectronMainModule, basicModule);

export default modules;
