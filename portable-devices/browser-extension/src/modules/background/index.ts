import { logger } from '@cdm-logger/client';
import { ClientTypes } from '@common-stack/client-react';
import modules, { MainRoute } from './module';

class UtilityClass {
    // eslint-disable-next-line no-useless-constructor
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
