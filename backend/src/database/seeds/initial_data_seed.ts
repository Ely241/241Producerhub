import { Knex } from "knex";
import beatsData from "../../data/beats.json";
import artistsData from "../../data/artists.json";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("beats").del();
    await knex("artists").del();

    // Inserts seed entries
    await knex("artists").insert(artistsData);

    // Process beatsData to stringify the tags array
    const processedBeatsData = beatsData.map(beat => ({
        ...beat,
        tags: JSON.stringify(beat.tags) // Stringify the tags array
    }));

    await knex("beats").insert(processedBeatsData);
};
