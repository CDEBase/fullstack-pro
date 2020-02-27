// import { AbstractRepository } from '../db-helpers';
// import { ICounterRepository } from './interfaces';
// import { ICount } from '../models';
// import { injectable, inject, named } from 'inversify';
// import * as Hemera from 'nats-hemera';
// import HemeraJoi from 'hemera-joi';
// import * as Nats from 'nats';
// import { Counter_Table } from '../database-store/migrations/counter';

// const NATS_HEMERA_DATBASE_MANAGER = 'sql-store';

// @injectable()
// export class CounterRemoteRepository implements ICounterRepository {

//     constructor(
//         @inject('Hemera') private hemera: Hemera<any, any>,
//     ) {
//     }
//     // Set the table name to count
//     public readonly tableName: string = Counter_Table;
//     private topic = NATS_HEMERA_DATBASE_MANAGER;

//     public async getById(id) {
//         const result = await this.hemera.act<ICount>(
//             {
//                 topic: NATS_HEMERA_DATBASE_MANAGER,
//                 cmd: 'findById',
//                 collection: this.tableName,
//                 id,
//             },
//         );
//         return result.data;
//     }

//     public async find(filter: string, pageNumber: number = 1, count: number = 20): Promise<ICount[]> {
//         const result = await this.hemera.act<ICount[]>(
//             {
//                 topic: NATS_HEMERA_DATBASE_MANAGER,
//                 cmd: 'find',
//                 collection: this.tableName,
//                 query: {},
//             },
//         );
//         return result.data;
//     }

//     public async create(data: ICount): Promise<ICount> {
//         const result = await this.hemera.act<ICount>(
//             {
//                 topic: NATS_HEMERA_DATBASE_MANAGER,
//                 cmd: 'create',
//                 collection: this.tableName,
//                 data,
//             },
//         );
//         return result.data;
//     }

//     public async update(data: ICount): Promise<ICount> {
//         const result = await this.hemera.act<ICount>(
//             {
//                 topic: NATS_HEMERA_DATBASE_MANAGER,
//                 cmd: 'update',
//                 collection: this.tableName,
//                 query: {
//                     id: data.id,
//                 },
//                 data: {
//                     amount: data.amount,
//                 },
//             },
//         );
//         return result.data;
//     }

//     public async getCount(): Promise<ICount> {
//         return this.getById(1);
//     }

//     public async  addCount(amount) {
//         return this.update({ id: 1, amount: amount });
//     }


// }
