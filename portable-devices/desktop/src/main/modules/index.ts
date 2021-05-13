import { ClientTypes } from '@common-stack/client-react';
import { interfaces } from 'inversify';
import modules from './module';
import parentContainer from '../ioc';
import { logger } from '../utils/logger';

class UtilityClass {
    // tslint:disable-next-line:no-shadowed-variable
    constructor(private modules) {}

    public getCacheKey(storeObj) {
        return this.modules.getDataIdFromObject(storeObj);
    }
}

const utility = new UtilityClass(modules);

// additional bindings to container
const container = modules.createContainers({}) as interfaces.Container;
container.bind(ClientTypes.Logger).toConstantValue(logger);
container.bind(ClientTypes.UtilityClass).toConstantValue(utility);
container.parent = parentContainer;

export default modules;
export { container };
