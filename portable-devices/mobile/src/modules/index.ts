/* eslint-disable import/no-cycle */
/* eslint-disable @typescript-eslint/no-var-requires */
import { ClientTypes } from '@common-stack/client-react';
import { logger } from '@cdm-logger/client';
import modules, { MainRoute } from './modules';

Object.assign(global, require('../../build.config'));


class UtilityClass {
    // tslint:disable-next-line:no-shadowed-variable
    constructor(private modules) {}

    public getCacheKey(storeObj) {
        return this.modules.getDataIdFromObject(storeObj);
    }
}

const utility = new UtilityClass(modules);
// additional bindings to container
const container = modules.createContainers({}) as any;
container.bind(ClientTypes.Logger).toConstantValue(logger);
container.bind(ClientTypes.UtilityClass).toConstantValue(utility);

export default modules;
export { MainRoute, container, logger };
