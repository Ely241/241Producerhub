import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('artists', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('profile_image_url');
  });

  await knex.schema.createTable('beats', (table) => {
    table.increments('id').primary();
    table.string('title').notNullable();
    table.integer('artist_id').unsigned().notNullable();
    table.foreign('artist_id').references('id').inTable('artists');
    table.decimal('price', 10, 2).notNullable();
    table.string('cover_image_url');
    table.string('audio_file_url').notNullable();
  });
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('beats');
  await knex.schema.dropTableIfExists('artists');
}

