import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Update author for the specific beats added previously
  const beatsToUpdate = [
    'Inspiré de Big Scarr',
    'Inspiré de Key Glock',
    'Inspiré de Tchief Keef',
  ];

  for (const title of beatsToUpdate) {
    await knex('beats')
      .where({ title: title })
      .update({ author: 'JYLSTHEPRODUCER' });
  }
}
