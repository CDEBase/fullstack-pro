import 'reflect-metadata';

import * as Knex from 'knex';
import { DbConfig } from '../db-helpers';
import { Container } from 'inversify';
import { ICounterRepository, CounterRepository } from '../repository';
import { TYPES } from '../constants';
import 'jest';
const DEFAULT_DB_CONFIG = require('./db/config.json');

describe('DI Test', () => {
    let container: Container;
    let knex;
    beforeAll(async () => {
        knex = Knex(DEFAULT_DB_CONFIG);
        await knex.migrate.latest();
        await knex.seed.run();

        const dbConfig = new DbConfig(DEFAULT_DB_CONFIG);
        container = new Container();

        container.bind<DbConfig>('DefaultDbConfig').toConstantValue(dbConfig);

        // container...
        container.bind<ICounterRepository>(TYPES.ICounterRepository).to(CounterRepository);

    });

    afterAll(() => {
        knex.destroy();
    });

    it('counter', async () => {
        const repository = container.get<ICounterRepository>(TYPES.ICounterRepository);
        expect(repository).toBeInstanceOf(CounterRepository);
        try {
            const count = await repository.getById(1);
            expect(count.amount).toEqual(5);
        } catch (e) {
            expect(e).toBeUndefined();
        }
    });

    it('add counter', async () => {
        const repository = container.get<ICounterRepository>(TYPES.ICounterRepository);
        try {
            await repository.addCount(2);
            const cnt = await repository.getCount();
            expect(cnt.amount).toEqual(7);
        } catch (e) {
            expect(e).toBeUndefined();
        }
    });


});
