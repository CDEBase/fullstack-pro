import * as Knex from 'knex';

const initialAmount = 5;

export async function seed(knex: Knex) {
    await knex('count').truncate();

    return knex('count').insert({ amount: initialAmount });
}
