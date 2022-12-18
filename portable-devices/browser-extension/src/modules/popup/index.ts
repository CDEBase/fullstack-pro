// eslint-disable-next-line jsonc/indent
import { logger } from '@cdm-logger/client';
import { ClientTypes } from '@common-stack/client-react';
import features, { MainRoute } from './module';

class UtilityClass {
    // eslint-disable-next-line no-useless-constructor
    constructor(private modules) {}

    public getCacheKey(storeObj) {
        return this.modules.getDataIdFromObject(storeObj);
    }
}

const utility = new UtilityClass(features);

// additional bindings to container
const container = features.createContainers({}) as any;
// eslint-disable-next-line jest/require-hook
container.bind(ClientTypes.Logger).toConstantValue(logger);
// eslint-disable-next-line jest/require-hook
container.bind(ClientTypes.UtilityClass).toConstantValue(utility);

export default features;
export { MainRoute, container, logger };
