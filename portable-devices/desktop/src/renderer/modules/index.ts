/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { logger } from '@cdm-logger/client';
import { ClientTypes } from '@common-stack/client-react';
import modules, { MainRoute } from './module';

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
export { MainRoute, container };
