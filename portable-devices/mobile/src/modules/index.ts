/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/no-cycle */
/* eslint-disable @typescript-eslint/no-var-requires */
import { ClientLogger } from '@cdm-logger/client';
import modules, { MainRoute } from './modules';
import { navigate } from './navigator';

Object.assign(global, require('../../build.config'));

export class UtilityClass {
    // tslint:disable-next-line:no-shadowed-variable
    constructor(private modules) {}

    public getCacheKey(storeObj) {
        return this.modules.getDataIdFromObject(storeObj);
    }

    public navigate(name: string, params: never) {
        return navigate(name, params);
    }
}

const logger = ClientLogger.create(process.env.APP_NAME || 'Fullstack-Pro', {
    level: (process.env.LOG_LEVEL as any) || 'info',
});

export default modules;
export { MainRoute, logger };
