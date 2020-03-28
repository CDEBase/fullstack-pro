
import { ICounterService } from './counter-service';

export interface IContext extends  IService {
    dataSources: IDataSources;
}


export interface IDataSources {
    counterCache: ICounterService;
}
export interface IService {
    counterMockService: ICounterService;
    // counterMockProxyService?: ICounterService;
}
