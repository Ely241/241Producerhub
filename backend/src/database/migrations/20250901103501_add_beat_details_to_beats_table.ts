import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.table('beats', function(table) {
        table.string('genre');
        table.integer('bpm');
        table.string('duration');
        table.string('author');
        table.json('tags');
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.table('beats', function(table) {
        table.dropColumn('genre');
        table.dropColumn('bpm');
        table.dropColumn('duration');
        table.dropColumn('author');
        table.dropColumn('tags');
    });
}