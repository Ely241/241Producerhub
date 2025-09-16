import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Fetch existing artists to link beats
  const artists = await knex('artists').select('id', 'name');
  const artistMap = new Map(artists.map(artist => [artist.name, artist.id]));

  // Ensure artists exist, create if not
  const getOrCreateArtistId = async (artistName: string): Promise<number> => {
    let artistId = artistMap.get(artistName);
    if (!artistId) {
      const [newId] = await knex('artists').insert({ name: artistName }).returning('id');
      artistId = newId.id || newId; // Knex returns different types based on DB
      artistMap.set(artistName, artistId);
    }
    return artistId;
  };

  const bigScarrId = await getOrCreateArtistId('Big Scarr');
  const keyGlockId = await getOrCreateArtistId('Key Glock');
  const tchiefKeefId = await getOrCreateArtistId('Tchief Keef');

  // Insert beats
  const beatsToInsert = [
    {
      title: 'Inspiré de Big Scarr',
      artist_id: bigScarrId,
      price: 0.00, // Écoute seule
      cover_image_url: '/assets/images/BIGSCARR-PNG.png',
      audio_file_url: '/assets/audio/BIGSCARR-BEAT.mp3',
      likes: 0,
      genre: 'Trap',
      bpm: 140,
      duration: '2:22',
      author: 'Big Scarr',
    },
    {
      title: 'Inspiré de Key Glock',
      artist_id: keyGlockId,
      price: 0.00, // Écoute seule
      cover_image_url: '/assets/images/KEYGLOCK-PNG.png',
      audio_file_url: '/assets/audio/KEYGLOCK-BEAT.mp3',
      likes: 0,
      genre: 'Trap',
      bpm: 140,
      duration: '4:27',
      author: 'Key Glock',
    },
    {
      title: 'Inspiré de Tchief Keef',
      artist_id: tchiefKeefId,
      price: 0.00, // Écoute seule
      cover_image_url: '/assets/images/CHIEFKEEF-PNG.png',
      audio_file_url: '/assets/audio/CHIEFKEEF-BEAT.mp3',
      likes: 0,
      genre: 'Drill',
      bpm: 140,
      duration: '4:18',
      author: 'Tchief Keef',
    },
  ];

  // Check if beats already exist to prevent duplicates
  for (const beat of beatsToInsert) {
    const existingBeat = await knex('beats').where({ title: beat.title, artist_id: beat.artist_id }).first();
    if (!existingBeat) {
      await knex('beats').insert(beat);
    }
  }

  // Note: Tags are not handled in this seed as the schema for tags was refactored.
  // If tags are needed, they would require a separate seed or migration to link.
}
