import '../config/public-config';
import { ClientLogger } from '@cdm-logger/client';
import modules, { MainRoute } from './module';

export class UtilityClass {
    // tslint:disable-next-line:no-shadowed-variable
    constructor(private modules) {}

    public getCacheKey(storeObj) {
        return this.modules.getDataIdFromObject(storeObj);
    }
}

const logger = ClientLogger.create(process.env.APP_NAME || 'Fullstack-Pro', {
    level: (process.env.LOG_LEVEL as any) || 'info',
});

export default modules;
export { MainRoute, logger };
