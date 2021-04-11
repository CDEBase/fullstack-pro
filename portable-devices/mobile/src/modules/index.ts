/* eslint-disable import/no-cycle */
/* eslint-disable @typescript-eslint/no-var-requires */
import modules, { MainRoute } from './modules';

Object.assign(global, require('../../build.config'));

export default modules;
export { MainRoute };
