import { Knex } from "knex";
import beatsData from "../../data/beats.json";
import artistsData from "../../data/artists.json";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries in reverse order of foreign keys
    await knex("beat_tags").del();
    await knex("tags").del();
    await knex("beats").del();
    await knex("artists").del();

    // Insert artists
    await knex("artists").insert(artistsData);

    // Prepare beats data without the 'tags' property for direct insertion
    const beatsToInsert = beatsData.map(beat => {
        const { tags, ...rest } = beat; // Destructure to exclude 'tags'
        return rest;
    });

    // Insert beats
    await knex("beats").insert(beatsToInsert);

    // Process tags and beat_tags
    for (const beat of beatsData) {
        if (beat.tags && Array.isArray(beat.tags)) {
            console.log('Beat ID:', beat.id, 'Tags:', beat.tags, 'Is array:', Array.isArray(beat.tags)); // Debugging line
            for (const tagName of Array.from(beat.tags)) {
                if (typeof tagName === 'string' && tagName.trim() !== '') {
                    let tagId;
                    // Check if tag already exists
                    const existingTag = await knex('tags').where({ name: tagName.trim() }).first();
                    if (existingTag) {
                        tagId = existingTag.id;
                    } else {
                        // Insert new tag and get its ID
                        const [newTagId] = await knex('tags').insert({ name: tagName.trim() });
                        tagId = newTagId;
                    }
                    // Insert into beat_tags, ignoring conflicts if already exists
                    await knex('beat_tags').insert({ beat_id: beat.id, tag_id: tagId }).onConflict(['beat_id', 'tag_id']).ignore();
                }
            }
        }
    }
};