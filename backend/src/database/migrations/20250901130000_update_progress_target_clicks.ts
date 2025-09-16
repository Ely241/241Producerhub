import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  // Update the target_clicks to 10 for testing purposes
  await knex('progress').update({ target_clicks: 10 }).where({ id: 1 }); // Assuming id 1 is the main progress record
}

export async function down(knex: Knex): Promise<void> {
  // Revert target_clicks to its original value (e.g., 1000)
  await knex('progress').update({ target_clicks: 1000 }).where({ id: 1 });
}
