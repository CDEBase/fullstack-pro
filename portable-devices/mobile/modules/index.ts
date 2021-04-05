Object.assign(global, require('../build.config'));

import { DrawerRoute} from './drawer-module';
import modules, {MainRoute} from "./main-module"
import MainHeader from "./header"
export default modules;
export { DrawerRoute, MainHeader, MainRoute };
