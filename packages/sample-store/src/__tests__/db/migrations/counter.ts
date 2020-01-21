import * as Knex from 'knex';
export async function up(knex: Knex) {
    return knex.schema.createTable('count', table => {
        table.increments();
        table.timestamps();
        table.integer('amount').notNullable();
    });
}

export async function down(knex: Knex) {
    return knex.schema.dropTable('count');
}
