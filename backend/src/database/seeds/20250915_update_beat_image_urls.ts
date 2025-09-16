import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  const beatsToUpdate = [
    'Inspiré de Big Scarr',
    'Inspiré de Key Glock',
    'Inspiré de Tchief Keef',
  ];

  for (const title of beatsToUpdate) {
    const beat = await knex('beats').where({ title: title }).first();
    if (beat && beat.cover_image_url.startsWith('/assets/images/')) {
      const newUrl = beat.cover_image_url.replace('/assets/images/', '/images/');
      await knex('beats').where({ id: beat.id }).update({ cover_image_url: newUrl });
    }
  }
}
