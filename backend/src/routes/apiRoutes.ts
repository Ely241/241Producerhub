import express, { Request, Response, NextFunction } from 'express';
import knex from 'knex';
import knexConfig from '../../knexfile';
import type { Beat } from '@shared/types';
import Joi from 'joi';
import crypto from 'crypto'; // Nécessaire pour la route /api/click

const router = express.Router();

// Initialize Knex (do it here for the router)
const db = knex(knexConfig[process.env.NODE_ENV || 'development']);

const MAX_PAGINATION_LIMIT = parseInt(process.env.MAX_PAGINATION_LIMIT || '100', 10);

// Joi Schemas
const beatsQuerySchema = Joi.object({
  q: Joi.string().trim().optional(),
  genre: Joi.string().trim().optional(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(MAX_PAGINATION_LIMIT).default(6),
});

// Validation Middleware
const validate = (schema: Joi.ObjectSchema) => (req: Request, res: Response, next: NextFunction) => {
  const { error, value } = schema.validate(req.query);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  res.locals.validatedQuery = value;
  next();
};

// Helper function for GROUP_CONCAT/STRING_AGG
const getGroupConcatFunction = (dbClient: string) => {
  if (dbClient === 'sqlite3') {
    return 'GROUP_CONCAT';
  } else if (dbClient === 'pg') {
    return 'STRING_AGG';
  }
  return 'GROUP_CONCAT'; // Default or throw error
};

// Route de test simple pour vérifier que le routeur fonctionne
router.get('/', (req, res) => res.send('API Works!'));

// API Routes (commented for debugging)
router.get('/beats', validate(beatsQuerySchema), async (req, res, next) => {
  try {
    const { q, genre, page, limit } = res.locals.validatedQuery as { q?: string, genre?: string, page: number, limit: number };
    const offset = (page - 1) * limit;

    const tagsAggregation = db.client.config.client === 'pg'
    ? db.raw('STRING_AGG(tags.name, ?) as tags_list', [','])
    : db.raw('GROUP_CONCAT(tags.name) as tags_list');

    let beatsQuery = db('beats')
      .select(
        'beats.*',
        'artists.name as artist_name',
        tagsAggregation
      )
      .leftJoin('artists', 'beats.artist_id', 'artists.id')
      .leftJoin('beat_tags', 'beats.id', 'beat_tags.beat_id')
      .leftJoin('tags', 'beat_tags.tag_id', 'tags.id')
      .groupBy('beats.id', 'artists.name', 'beats.title', 'beats.price', 'beats.cover_image_url', 'beats.audio_file_url', 'beats.likes', 'beats.genre', 'beats.bpm', 'beats.duration', 'beats.author', 'beats.artist_id')
      .orderBy('beats.id');

    if (q) {
      beatsQuery = beatsQuery.where('beats.title', 'like', `%${q}%`).orWhere('artists.name', 'like', `%${q}%`);
    }

    if (genre) {
      beatsQuery = beatsQuery.andWhere('beats.genre', genre as string);
    }

    const totalCountQuery = db('beats')
      .count({ count: 'beats.id' })
      .first();

    if (q) {
      totalCountQuery.leftJoin('artists', 'beats.artist_id', 'artists.id');
      totalCountQuery.where('beats.title', 'like', `%${q}%`).orWhere('artists.name', 'like', `%${q}%`);
    }
    if (genre) {
      totalCountQuery.andWhere('beats.genre', genre as string);
    }

    const { count } = (await totalCountQuery) as { count: number | string };
    const totalCount = typeof count === 'string' ? parseInt(count, 10) : count;

    console.log('Nombre total de beats avant pagination:', totalCount); // Log de débogage
    const beats = await beatsQuery.offset(offset).limit(limit);
    console.log('Beats récupérés après pagination:', beats.length); // Log de débogage

    const processedBeats = beats.map(beat => ({
      ...beat,
      tags: beat.tags_list ? (beat.tags_list as string).split(',') : [],
      tags_list: undefined
    }));

    console.log('Beats processed and sent to frontend:', processedBeats.map(b => ({ id: b.id, title: b.title, cover_image_url: b.cover_image_url }))); // Log des URLs d'images

    res.json({ beats: processedBeats, totalCount });
  } catch (err) {
    next(err);
  }
});
//
router.get('/genres', async (req, res, next) => {
  try {
    const genres = await db<Beat>('beats').distinct('genre').whereNotNull('genre');
    res.json(genres.map(g => g.genre).filter(g => g && g.trim() !== ''));
  } catch (err) {
    next(err);
  }
});
//
// router.get('/beats/:id', async (req, res, next) => {
//   try {
//     const { id } = req.params;
//
//     const groupConcatFn = getGroupConcatFunction(db.client.config.client);
//
//     const beat = await db('beats')
//       .select(
//         'beats.*',
//         'artists.name as artist_name',
//         db.raw(db.client.config.client === 'pg' ? 'STRING_AGG(tags.name, ?) as tags_list' : 'GROUP_CONCAT(tags.name) as tags_list', [','])
//       )
//       .leftJoin('artists', 'beats.artist_id', 'artists.id')
//       .leftJoin('beat_tags', 'beats.id', 'beat_tags.beat_id')
//       .leftJoin('tags', 'beat_tags.tag_id', 'tags.id')
//       .where('beats.id', id)
//       .groupBy('beats.id', 'artists.name', 'beats.title', 'beats.price', 'beats.cover_image_url', 'beats.audio_file_url', 'beats.likes', 'beats.genre', 'beats.bpm', 'beats.duration', 'beats.author', 'beats.artist_id')
//       .first();
//
//     if (beat) {
//       const processedBeat = {
//         ...beat,
//         tags: beat.tags_list ? (beat.tags_list as string).split(',') : [],
//         tags_list: undefined
//       };
//       res.json(processedBeat);
//     } else {
//       res.status(404).json({ message: 'Beat not found' });
//     }
//   } catch (err) {
//     next(err);
//   }
// });
//
// router.get('/artists', async (req, res, next) => {
//   try {
//     const artists = await db('artists').select('*');
//     res.json(artists);
//   } catch (err) {
//     next(err);
//   }
// });
//
// router.post('/beats/:id/like', async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     await db('beats').where({ id }).increment('likes', 1);
//     const beat = await db<Beat>('beats').where('id', id).first();
//     res.json(beat);
//   } catch (err) {
//     next(err);
//   }
// });
//
// // Progress API Routes
// router.post('/click', async (req, res, next) => {
//   try {
//     await db.transaction(async trx => {
//       const progress = await trx('progress').first();
//       if (!progress) {
//         throw new Error('Progress record not found.');
//       }
//
//       const newCurrentClicks = progress.current_clicks + 1;
//       const newIsCompleted = newCurrentClicks >= progress.target_clicks;
//
//       await trx('progress')
//         .update({
//           current_clicks: newCurrentClicks,
//           is_completed: newIsCompleted,
//         })
//         .where({ id: progress.id });
//
//       const updatedProgress = await trx('progress').first();
//       res.json(updatedProgress);
//     });
//
//   } catch (err) {
//     next(err);
//   }
// });
//
// router.get('/progress', async (req, res, next) => {
//   try {
//     const progress = await db('progress').first();
//     if (!progress) {
//       return res.status(404).json({ message: 'Progress record not found.' });
//     }
//     res.json(progress);
//   } catch (err) {
//     next(err);
//   }
// });

console.log('apiRoutes initialized with test route.');
export default router;