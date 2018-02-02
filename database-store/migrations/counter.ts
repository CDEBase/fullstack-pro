import * as Knex from 'knex';

export const createCounter = async (driver) =>
    await driver.schema.createTable('count', table => {
        table.increments();
        table.timestamps(false, true);
        table.integer('amount').notNull();
    });
export const dropCounter = async (driver) =>
    driver.schema.dropTable('count');

export async function up(knex: Knex) {
    return createCounter(knex);
}

export async function down(knex: Knex) {
    return await dropCounter(knex);
}
