Object.assign(global, require('../build.config'));

import modules, { MainRoute} from './module';
import MainHeader from "./header"
export default modules;
export { MainRoute, MainHeader };
