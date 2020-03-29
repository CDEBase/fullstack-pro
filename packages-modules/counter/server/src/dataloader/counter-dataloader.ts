import { DataSource, DataSourceConfig } from 'apollo-datasource';
import { ApolloError } from 'apollo-server-errors';
import { InMemoryLRUCache } from 'apollo-server-caching';
// import { setupCaching } from './cache';
import { KeyValueCache } from 'apollo-server-caching';
import { IService, IContext, ICounterService } from '../interfaces';
import { setupCaching } from './cache';
import { Counter } from '../generated-models';

export interface CacheOptions {
    ttl?: number;
}


export class CounterDataSource extends DataSource<IService> implements ICounterService {
    private context!: IContext;
    private cacheCounterService: ICounterService;

    constructor() {
        super();
    }
    public counterQuery(): Counter | Promise<Counter> | PromiseLike<Counter> {
        return this.cacheCounterService.counterQuery();
    }
    public addCounter(amount?: number) {
        return this.cacheCounterService.addCounter();
    }

    public initialize(config: DataSourceConfig<IContext>) {
        this.context = config.context;
        if (!this.context.counterMockService) {

            throw new ApolloError(
                'Missing TextFileService in the context!',
            );
        }
        try {
            const cache = config.cache as KeyValueCache<string> || new InMemoryLRUCache<string>();
            this.cacheCounterService = setupCaching({ counterService: config.context.counterMockService, cache });
        } catch (err) {
            throw new ApolloError(`Setting up cache in the FilesDataSource failed due to ${err}`);
        }
    }
}
