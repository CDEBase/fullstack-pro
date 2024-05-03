import { Container } from 'inversify';
import type { KeyValueCache } from '@apollo/utils.keyvaluecache';
import { ApolloError } from 'apollo-server-errors';
import { ICounterService } from '../interfaces';
import { setupCaching } from './cache';
import { Counter } from '../generated-models';
import { TYPES } from '../constants';

export interface CacheOptions {
    ttl?: number;
}

type Options = {
    cache: KeyValueCache;
    context: {
        container: Container;
    };
};

export class CounterDataSource implements ICounterService {
    // eslint-disable-next-line no-useless-constructor
    constructor(private readonly options: Options) {
        this.initialize();
    }

    private cacheCounterService: ICounterService;

    public counterQuery(): Counter | Promise<Counter> | PromiseLike<Counter> {
        return this.cacheCounterService.counterQuery();
    }

    public addCounter(amount?: number) {
        return this.cacheCounterService.addCounter();
    }

    public initialize() {
        const { context, cache } = this.options;
        const counterService = context.container.getNamed<ICounterService>(TYPES.CounterMockService, 'proxy');
        if (!counterService) {
            throw new ApolloError('Missing TextFileService in the context!');
        }
        try {
            this.cacheCounterService = setupCaching({ counterService, cache });
        } catch (err) {
            throw new ApolloError(`Setting up cache in the FilesDataSource failed due to ${err}`);
        }
    }
}
