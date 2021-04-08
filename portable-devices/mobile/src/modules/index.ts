/* eslint-disable import/no-cycle */
/* eslint-disable @typescript-eslint/no-var-requires */
import { DrawerModule } from './drawer-module';
import modules, { MainRoute } from './main-module';
import MainHeader from './header';

Object.assign(global, require('../../build.config'));

export default modules;
export { DrawerModule, MainHeader, MainRoute };
