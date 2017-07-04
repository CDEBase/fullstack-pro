import { AbstractRepository } from '@sample/server-core';
import { ICounterRepository } from './ICounterRepository';
import { ICount } from './ICountModel';
import { injectable } from 'inversify';

@injectable()
export class CounterRepository extends AbstractRepository implements ICounterRepository {

    // Set the table name to count
    protected tableName: string = 'count';

    public async getById(id: number): Promise<ICount> {
        return await this.getTable()
            .where({ id })
            .first();
    }

    public async find(filter: string, pageNumber: number = 1, count: number = 20): Promise<ICount[]> {
        return await this.getTable().where('amount', 'like', `%${filter}`).select();
    }

    public async create(dto: ICount): Promise<ICount> {
        throw new Error('Method not implemented');
    }

    public async update(dto: ICount): Promise<ICount> {
        throw new Error('Method not implemented');
    }
    public async getCount(): Promise<ICount> {
        return await this.getTable().first();
    }

    public async  addCount(amount) {
        await this.getTable().increment('amount', amount);
    }
}
