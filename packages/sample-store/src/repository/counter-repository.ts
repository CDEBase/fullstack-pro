import { injectable } from 'inversify';

import { Counter_Table } from '../database-store/migrations/counter';
import { AbstractRepository } from '../db-helpers';
import { ICount } from '../models';
import { ICounterRepository } from './interfaces';

@injectable()
export class CounterRepository
    extends AbstractRepository
    implements ICounterRepository {
    // Set the table name to count
    public readonly tableName: string = Counter_Table;

    public async getById(id: number): Promise<ICount> {
        return this.getTable().where({ id }).first();
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public async find(
        filter: string,
        pageNumber = 1,
        count = 20,
    ): Promise<ICount[]> {
        return this.getTable().where('amount', 'like', `%${filter}`).select();
    }

    public async create(dto: ICount): Promise<ICount> {
        return this.create(dto);
    }

    public async update(dto: ICount): Promise<ICount> {
        return this.getTable().update(dto);
    }

    public async getCount(): Promise<ICount> {
        return this.getTable().first();
    }

    public async addCount(amount) {
        await this.getTable().increment('amount', amount);
    }
}
