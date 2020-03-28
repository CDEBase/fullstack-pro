import { DataSource, DataSourceConfig } from 'apollo-datasource';
import { ApolloError } from 'apollo-server-errors';
import { InMemoryLRUCache } from 'apollo-server-caching';
// import { setupCaching } from './cache';
import { KeyValueCache } from 'apollo-server-caching';
import { IService } from '../interfaces';

export interface CacheOptions {
    ttl?: number;
}


export class CounterDataSource extends DataSource<IService> {
    private context!: IService;

    constructor() {
        super();
    }

    public initialize(config: DataSourceConfig<IService>) {
        console.log('---CONFIG', config);
        this.context = config.context;
    }
}
