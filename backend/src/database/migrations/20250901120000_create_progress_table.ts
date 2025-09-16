import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('progress', (table) => {
    table.increments('id').primary();
    table.integer('current_clicks').notNullable().defaultTo(0);
    table.integer('target_clicks').notNullable();
    table.boolean('is_completed').notNullable().defaultTo(false);
  });

  // Insert initial progress entry
  await knex('progress').insert({
    current_clicks: 0,
    target_clicks: 1000, // Default target, can be configured via env later
    is_completed: false,
  });

  await knex.schema.createTable('clicked_ips', (table) => {
    table.increments('id').primary();
    table.string('ip_hash').notNullable().unique(); // Store hash of IP address
    table.timestamp('timestamp').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('clicked_ips');
  await knex.schema.dropTableIfExists('progress');
}
