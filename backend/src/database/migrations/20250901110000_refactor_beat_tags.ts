import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  // Create tags table
  await knex.schema.createTable('tags', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable().unique();
  });

  // Create beat_tags join table
  await knex.schema.createTable('beat_tags', (table) => {
    table.integer('beat_id').unsigned().notNullable();
    table.integer('tag_id').unsigned().notNullable();
    table.primary(['beat_id', 'tag_id']);
    table.foreign('beat_id').references('id').inTable('beats').onDelete('CASCADE');
    table.foreign('tag_id').references('id').inTable('tags').onDelete('CASCADE');
  });

  // Migrate existing tags data
  const beatsWithTags = await knex('beats').select('id', 'tags').whereNotNull('tags');

  for (const beat of beatsWithTags) {
    try {
      const tags = JSON.parse(beat.tags as string);
      if (Array.isArray(tags)) {
        for (const tagName of tags) {
          if (typeof tagName === 'string' && tagName.trim() !== '') {
            let tagId;
            // Check if tag already exists
            const existingTag = await knex('tags').where({ name: tagName.trim() }).first();
            if (existingTag) {
              tagId = existingTag.id;
            } else {
              // Insert new tag
              const [newTagId] = await knex('tags').insert({ name: tagName.trim() });
              tagId = newTagId;
            }
            // Insert into beat_tags
            await knex('beat_tags').insert({ beat_id: beat.id, tag_id: tagId }).onConflict(['beat_id', 'tag_id']).ignore();
          }
        }
      }
    } catch (e) {
      console.error(`Failed to parse tags for beat ID ${beat.id}:`, e);
    }
  }

  // Drop the old tags column from beats table
  await knex.schema.table('beats', (table) => {
    table.dropColumn('tags');
  });
}

export async function down(knex: Knex): Promise<void> {
  // Re-add the tags column to beats table (as string)
  await knex.schema.table('beats', (table) => {
    table.json('tags'); // Use json type as it was before
  });

  // Note: Reverting data from beat_tags back to a single JSON string in 'beats.tags' is complex and not handled here.
  // This 'down' function primarily reverts schema changes.

  // Drop join table
  await knex.schema.dropTableIfExists('beat_tags');
  // Drop tags table
  await knex.schema.dropTableIfExists('tags');
}
