import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.table('beats', function(table) {
        table.integer('likes').notNullable().defaultTo(0);
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.table('beats', function(table) {
        table.dropColumn('likes');
    });
}