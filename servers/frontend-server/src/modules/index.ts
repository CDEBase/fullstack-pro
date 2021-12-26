import '../config/public-config';
import { ClientLogger } from '@cdm-logger/client';
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

const logger = ClientLogger.create(process.env.APP_NAME || 'Fullstack-Pro', {
    level: (process.env.LOG_LEVEL as any) || 'info',
});
// additional bindings to container
const container = modules.createContainers({}) as any;
container.bind(ClientTypes.Logger).toConstantValue(logger);
container.bind(ClientTypes.UtilityClass).toConstantValue(utility);

export default modules;
export { MainRoute, container, logger };
