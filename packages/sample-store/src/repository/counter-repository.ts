import { AbstractRepository } from '../db-helpers';
import { ICounterRepository } from './interfaces';
import { ICount } from '../models';
import { injectable } from 'inversify';
import { Counter_Table } from '../database-store/migrations/counter';

@injectable()
export class CounterRepository extends AbstractRepository implements ICounterRepository {

    // Set the table name to count
    public readonly tableName: string = Counter_Table;

    public async getById(id: number): Promise<ICount> {
        return await this.getTable()
            .where({ id })
            .first();
    }

    public async find(filter: string, pageNumber: number = 1, count: number = 20): Promise<ICount[]> {
        return await this.getTable().where('amount', 'like', `%${filter}`).select();
    }

    public async create(dto: ICount): Promise<ICount> {
        return await this.create(dto);
    }

    public async update(dto: ICount): Promise<ICount> {
        return await this.getTable().update(dto);
    }
    public async getCount(): Promise<ICount> {
        return await this.getTable().first();
    }

    public async  addCount(amount) {
        await this.getTable().increment('amount', amount);
    }
}
