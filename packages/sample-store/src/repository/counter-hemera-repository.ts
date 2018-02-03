import { AbstractRepository } from '../db-helpers';
import { ICounterRepository } from './interfaces';
import { ICount } from '../models';
import { injectable, inject, named } from 'inversify';
import * as Hemera from 'nats-hemera';
import HemeraJoi from 'hemera-joi';
import * as Nats from 'nats';

const NATS_HEMERA_DATBASE_MANAGER = 'sql-store';

@injectable()
export class CounterRemoteRepository implements ICounterRepository {

    constructor(
        @inject('Hemera') private hemera: Hemera,
    ) {
    }
    // Set the table name to count
    public static tableName: string = 'count';
    private topic = NATS_HEMERA_DATBASE_MANAGER;

    public async getById(id) {
        return await this.hemera.act(
            {
                topic: NATS_HEMERA_DATBASE_MANAGER,
                cmd: 'findById',
                collection: CounterRemoteRepository.tableName,
                id,
            },
        ) as Promise<ICount>;
    }

    public async find(filter: string, pageNumber: number = 1, count: number = 20): Promise<ICount[]> {
        return await this.hemera.act(
            {
                topic: NATS_HEMERA_DATBASE_MANAGER,
                cmd: 'find',
                collection: CounterRemoteRepository.tableName,
                query: {},
            },
        );
    }

    public async create(data: ICount): Promise<ICount> {
        return await this.hemera.act(
            {
                topic: NATS_HEMERA_DATBASE_MANAGER,
                cmd: 'create',
                collection: CounterRemoteRepository.tableName,
                data,
            },
        );
    }

    // TODO Due to error not using asyn/await
    // https://github.com/hemerajs/hemera-sql-store/issues
    public async update(data: ICount): Promise<ICount> {
        return await this.hemera.act(
            {
                topic: NATS_HEMERA_DATBASE_MANAGER,
                cmd: 'update',
                collection: CounterRemoteRepository.tableName,
                query: {
                    id: data.id,
                },
                data: {
                    amount: data.amount,
                },
            },
        );
    }

    // public update(data: ICount) {
    //     return this.hemera.act(
    //         {
    //             topic: NATS_HEMERA_DATBASE_MANAGER,
    //             cmd: 'update',
    //             collection: CounterRemoteRepository.tableName,
    //             query: {
    //                 id: data.id,
    //             },
    //             data: {
    //                 amount: data.amount,
    //             },
    //         },
    //         (err, resp) => {
    //             return new Promise((resolve, reject) => {
    //                 if (err) {
    //                     reject(err);
    //                 }
    //                 resolve(resp);
    //             });
    //         },
    //     );
    // }
    public async getCount(): Promise<ICount> {
        return this.getById(1);
    }

    public async  addCount(amount) {
        return this.update({ id: 1, amount: amount });
    }


}
