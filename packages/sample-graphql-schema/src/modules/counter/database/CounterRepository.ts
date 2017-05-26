import { AbstractRepository } from '../../AbstractRepository';
import { ICounterRepository } from './ICounterRepository';
import { ICount } from './ICountModel';
import { injectable } from 'inversify';

@injectable()
export class CounterRepository extends AbstractRepository implements ICounterRepository {

    // Set the table name to count
    tableName: string = "counter";

    async getById(id: number): Promise<ICount> {
        return await this.getTable()
                        .where({id})
                        .first();
    }

    async find(filter: string, pageNumber: number = 1, count: number = 20): Promise<ICount[]> {
        return await this.getTable().where('amount', 'like', `%${filter}`).select();
    }

    async create(dto: ICount): Promise<ICount> {
        throw new Error("Method not implemented");
    }

    async update(dto: ICount): Promise<ICount> {
        throw new Error("Method not implemented");
    }
    async getCount(): Promise<ICount> {
        return await this.getTable().first();
    }

    async addCount(amount) {
        await this.getTable().increment('amount', amount);
    }
}
