import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  const beatsToUpdate = [
    'Inspiré de Big Scarr',
    'Inspiré de Key Glock',
    'Inspiré de Tchief Keef',
  ];

  for (const title of beatsToUpdate) {
    const beat = await knex('beats').where({ title: title }).first();
    if (beat && beat.audio_file_url.startsWith('/assets/audio/')) {
      const newUrl = beat.audio_file_url.replace('/assets/audio/', '/audio/');
      await knex('beats').where({ id: beat.id }).update({ audio_file_url: newUrl });
    }
  }
}
