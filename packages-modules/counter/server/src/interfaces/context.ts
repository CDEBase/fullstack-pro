
import { ICounterService } from './counter-service';

export interface IContext extends  IService {
}

export interface IService {
    counterMockService: ICounterService;
    counterMockProxyService?: ICounterService;
}
