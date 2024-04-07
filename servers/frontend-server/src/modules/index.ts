import '../config/public-config';
import { ClientLogger } from '@cdm-logger/client';
import { MainRoute } from './module';
//@ts-ignore
import modules from 'virtual:cdm-modules'
import { Feature } from '@common-stack/client-react';


export class UtilityClass {
    // tslint:disable-next-line:no-shadowed-variable
    constructor(private modules) { }

    public getCacheKey(storeObj) {
        return this.modules.getDataIdFromObject(storeObj);
    }
}

const logger = ClientLogger.create(process.env.APP_NAME || 'Fullstack-Pro', {
    level: (process.env.LOG_LEVEL as any) || 'info',
});

export default new Feature(modules);
export { MainRoute, logger };
