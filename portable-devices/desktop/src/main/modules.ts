import { Feature } from '@common-stack/client-react';
import { ElectronModule } from '@sample-stack/counter-module-browser';
import { basicModule } from './local-module';

const modules = new Feature(basicModule, ElectronModule);

export const services = modules.createService({}, {});
export default modules;
