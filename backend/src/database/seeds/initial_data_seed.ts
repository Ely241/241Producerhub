import { Knex } from "knex";
import fs from 'fs';
import path from 'path';
import artistsData from "../../data/artists.json";
import type { Beat } from '@shared/types';

export async function seed(knex: Knex): Promise<void> {
    const beatsDataPath = path.join(__dirname, '../../data/beats.json');
    const beatsData = JSON.parse(fs.readFileSync(beatsDataPath, 'utf8'));

    console.log('beatsData type:', typeof beatsData, 'Is array:', Array.isArray(beatsData), 'First beat tags type:', typeof beatsData[0]?.tags, 'First beat tags is array:', Array.isArray(beatsData[0]?.tags)); // New debugging line
    // Deletes ALL existing entries in reverse order of foreign keys
    await knex("beat_tags").del();
    await knex("tags").del();
    await knex("beats").del();
    await knex("artists").del();

    // Insert artists
    await knex("artists").insert(artistsData);

    // Prepare beats data without the 'tags' property for direct insertion
    const beatsToInsert = beatsData.map((beat: Beat) => {
        const { tags, ...rest } = beat; // Destructure to exclude 'tags'
        return rest;
    });

    // Insert beats
    await knex("beats").insert(beatsToInsert);

    // Process tags and beat_tags
    for (const beat of beatsData as Beat[]) {
        if (beat.tags && Array.isArray(beat.tags)) {
            console.log('Beat ID:', beat.id, 'Tags:', beat.tags, 'Is array:', Array.isArray(beat.tags)); // Debugging line
            for (let i = 0; i < beat.tags.length; i++) {
                const tagName = beat.tags[i];
                if (typeof tagName === 'string' && tagName.trim() !== '') {
                    let tagId;
                    // Check if tag already exists
                    const existingTag = await knex('tags').where({ name: tagName.trim() }).first();
                    if (existingTag) {
                        tagId = existingTag.id;
                    } else {
                        // Insert new tag and get its ID
                        const newTagId = (await knex('tags').insert({ name: tagName.trim() }).returning('id'))[0].id;
                        tagId = newTagId;
                    }
                    // Insert into beat_tags, ignoring conflicts if already exists
                    await knex('beat_tags').insert({ beat_id: beat.id, tag_id: tagId }).onConflict(['beat_id', 'tag_id']).ignore();
                }
            }
        }
    }
};