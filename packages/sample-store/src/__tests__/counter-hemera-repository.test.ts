// import 'reflect-metadata';

// import * as Hemera from 'nats-hemera';
// import * as Nats from 'nats';
// import * as HemeraTestSuite from 'hemera-testsuite';
// import * as HemeraSqlStore from 'hemera-sql-store';
// import { CounterRemoteRepository } from '../repository/counter-hemera-repository';
// import { createCounter, dropCounter, Counter_Table } from '../database-store/migrations/counter';
// import * as knex from 'knex';
// import { logger } from '@cdm-logger/server';

// require('dotenv').config({ path: process.env.ENV_FILE });

// import 'jest';

// describe('Hemera-sql-store', function () {
//     let PORT = 6242;
//     let authUrl = 'nats://localhost:' + PORT;
//     let server;
//     let hemera;
//     let testDatabase = process.env.DB_DATABASE;
//     let testTable = Counter_Table;
//     let repo: CounterRemoteRepository;

//     beforeAll(async (done) => {
//         server = HemeraTestSuite.start_server(PORT, () => {
//             const nats = Nats.connect(authUrl);
//             hemera = new Hemera(nats, {});
//             hemera.use(require('hemera-safe-promises'));
//             hemera.use(HemeraSqlStore, {
//                 knex: {
//                     dialect: 'mysql',
//                     connection: {
//                         host: process.env.DB_HOST,
//                         user: process.env.DB_USER,
//                         password: process.env.DB_PASSWORD,
//                         database: testDatabase,
//                     },
//                     pool: {
//                         min: 0,
//                         max: 7,
//                     },
//                 },
//             });
//             hemera.ready(async () => {
//                 await createCounter(hemera.sqlStore.useDb(testDatabase));
//                 repo = new CounterRemoteRepository(hemera);
//                 done();
//             });
//         });
//     });

//     afterAll(async () => {
//         await dropCounter(hemera.sqlStore.useDb(testDatabase));
//         hemera.close();
//         server.kill();
//     });

//     it('create', async (done) => {
//         const count = { id: 1, amount: 1 };
//         try {
//             const addCoutOutput = await repo.create(count);
//             expect(addCoutOutput).toEqual([1]);
//             done();
//         } catch (err) {
//             logger.error(err);
//             done.fail();
//         }
//     });

//     it('getById', async (done) => {
//         try {
//             const count = await repo.getById(1);
//             expect(count[0].amount).toEqual(1);
//             done();
//         } catch (err) {
//             logger.error(err);
//             done.fail();
//         }
//     });
//     it('getCount', async (done) => {
//         try {
//             const count = await repo.getCount();
//             done();
//         } catch (err) {
//             logger.error(err);
//             done.fail();
//         }
//     });

//     it('addCount', async (done) => {
//         try {
//             await repo.addCount(1);
//             done();
//         } catch (err) {
//             logger.error(err);
//             done.fail();
//         }
//     });
// });
