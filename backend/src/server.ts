import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import knex from 'knex';
import knexConfig from '../knexfile';
import path from 'path';
import type { Beat } from '@shared/types';
import dotenv from 'dotenv';
import Joi from 'joi';
import crypto from 'crypto';

dotenv.config();

const MAX_PAGINATION_LIMIT = parseInt(process.env.MAX_PAGINATION_LIMIT || '100', 10);

// Joi Schemas
const beatsQuerySchema = Joi.object({
  q: Joi.string().trim().optional(),
  genre: Joi.string().trim().optional(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(MAX_PAGINATION_LIMIT).default(6),
});

const app = express();
const port = process.env.PORT || 3001;

// Initialize Knex
const db = knex(knexConfig[process.env.NODE_ENV || 'development']);

// Validation Middleware
const validate = (schema: Joi.ObjectSchema) => (req: Request, res: Response, next: NextFunction) => {
  const { error, value } = schema.validate(req.query);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  res.locals.validatedQuery = value;
  next();
};

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files (audio and images)
app.use('/audio', express.static(path.join(__dirname, process.env.AUDIO_ASSETS_DIR || '../../src/assets/audio'))); // New beats
app.use('/audio', express.static(path.join(__dirname, '../../src/assets/6trece'))); // Original 6trece audio
app.use('/images', express.static(path.join(__dirname, process.env.IMAGE_ASSETS_DIR || '../../src/assets/images'))); // New beats
app.use('/images', express.static(path.join(__dirname, '../../src/assets/6trece'))); // Original 6trece assets
app.use('/images', express.static(path.join(__dirname, '../../src/assets'))); // Other root assets like hero-bg.jpg, logo.png

// API Routes
app.get('/api/beats', validate(beatsQuerySchema), async (req, res, next) => {
  try {
    const { q, genre, page, limit } = res.locals.validatedQuery as { q?: string, genre?: string, page: number, limit: number };
    const offset = (page - 1) * limit;

    const getGroupConcatFunction = (dbClient: string) => {
      if (dbClient === 'sqlite3') {
        return 'GROUP_CONCAT';
      } else if (dbClient === 'pg') {
        return 'STRING_AGG';
      }
      return 'GROUP_CONCAT'; // Default or throw error
    };

    const groupConcatFn = getGroupConcatFunction(db.client.config.client);

    let beatsQuery = db('beats')
      .select(
        'beats.*',
        'artists.name as artist_name',
        db.raw(db.client.config.client === 'pg' ? 'STRING_AGG(tags.name, ",") as tags_list' : 'GROUP_CONCAT(tags.name) as tags_list')
      )
      .leftJoin('artists', 'beats.artist_id', 'artists.id')
      .leftJoin('beat_tags', 'beats.id', 'beat_tags.beat_id')
      .leftJoin('tags', 'beat_tags.tag_id', 'tags.id')
      .groupBy('beats.id', 'artists.name', 'beats.title', 'beats.price', 'beats.cover_image_url', 'beats.audio_file_url', 'beats.likes', 'beats.genre', 'beats.bpm', 'beats.duration', 'beats.author', 'beats.artist_id') // Group by all selected non-aggregated columns
      .orderBy('beats.id'); // Order by a stable column for consistent pagination

    if (q) {
      beatsQuery = beatsQuery.where('beats.title', 'like', `%${q}%`).orWhere('artists.name', 'like', `%${q}%`);
    }

    if (genre) {
      beatsQuery = beatsQuery.andWhere('beats.genre', genre as string);
    }

    // Get total count for pagination (before applying limit/offset)
    // This count needs to be done on the base query before grouping/joining for tags
    const totalCountQuery = db('beats')
      .count({ count: 'beats.id' }) // Use beats.id for accuracy with joins
      .first();

    if (q) {
      // Join artists table only when searching, as it's needed for the where clause
      totalCountQuery.leftJoin('artists', 'beats.artist_id', 'artists.id');
      totalCountQuery.where('beats.title', 'like', `%${q}%`).orWhere('artists.name', 'like', `%${q}%`);
    }
    if (genre) {
      totalCountQuery.andWhere('beats.genre', genre as string);
    }

    const { count } = (await totalCountQuery) as { count: number | string };
    const totalCount = typeof count === 'string' ? parseInt(count, 10) : count;

    const beats = await beatsQuery.offset(offset).limit(limit);

    // Post-process tags_list into an array
    const processedBeats = beats.map(beat => ({
      ...beat,
      tags: beat.tags_list ? (beat.tags_list as string).split(',') : [],
      tags_list: undefined // Remove the raw tags_list field
    }));

    res.json({ beats: processedBeats, totalCount });
  } catch (err) {
    next(err);
  }
});

app.get('/api/genres', async (req, res, next) => {
  try {
    const genres = await db<Beat>('beats').distinct('genre').whereNotNull('genre');
    res.json(genres.map(g => g.genre).filter(g => g && g.trim() !== ''));
  } catch (err) {
    next(err);
  }
});

app.get('/api/beats/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const getGroupConcatFunction = (dbClient: string) => {
      if (dbClient === 'sqlite3') {
        return 'GROUP_CONCAT';
      } else if (dbClient === 'pg') {
        return 'STRING_AGG';
      }
      return 'GROUP_CONCAT'; // Default or throw error
    };

    const groupConcatFn = getGroupConcatFunction(db.client.config.client);

    const beat = await db('beats')
      .select(
        'beats.*',
        'artists.name as artist_name',
        db.raw(db.client.config.client === 'pg' ? 'STRING_AGG(tags.name, ",") as tags_list' : 'GROUP_CONCAT(tags.name) as tags_list')
      )
      .leftJoin('artists', 'beats.artist_id', 'artists.id')
      .leftJoin('beat_tags', 'beats.id', 'beat_tags.beat_id')
      .leftJoin('tags', 'beat_tags.tag_id', 'tags.id')
      .where('beats.id', id)
      .groupBy('beats.id', 'artists.name', 'beats.title', 'beats.price', 'beats.cover_image_url', 'beats.audio_file_url', 'beats.likes', 'beats.genre', 'beats.bpm', 'beats.duration', 'beats.author', 'beats.artist_id')
      .first();

    if (beat) {
      const processedBeat = {
        ...beat,
        tags: beat.tags_list ? (beat.tags_list as string).split(',') : [],
        tags_list: undefined // Remove the raw tags_list field
      };
      res.json(processedBeat);
    } else {
      res.status(404).json({ message: 'Beat not found' });
    }
  } catch (err) {
    next(err);
  }
});

app.get('/api/artists', async (req, res, next) => {
  try {
    const artists = await db('artists').select('*');
    res.json(artists);
  } catch (err) {
    next(err);
  }
});

app.post('/api/beats/:id/like', async (req, res, next) => {
  try {
    const { id } = req.params;
    await db('beats').where({ id }).increment('likes', 1);
    const beat = await db<Beat>('beats').where('id', id).first();
    res.json(beat);
  } catch (err) {
    next(err);
  }
});

// Progress API Routes
app.post('/api/click', async (req, res, next) => {
  try {
    // const clientIp = req.ip || 'unknown'; // No longer needed for unique click tracking
    // const ipHash = crypto.createHash('sha256').update(clientIp).digest('hex');

    // // Check if IP has already clicked
    // const existingClick = await db('clicked_ips').where({ ip_hash: ipHash }).first();

    // if (existingClick) {
    //   // IP has already clicked, return current progress without incrementing
    //   const progress = await db('progress').first();
    //   return res.json(progress);
    // }

    // // Record the click
    // await db('clicked_ips').insert({ ip_hash: ipHash });

    // Increment current_clicks and update is_completed
    await db.transaction(async trx => {
      const progress = await trx('progress').first();
      if (!progress) {
        throw new Error('Progress record not found.');
      }

      const newCurrentClicks = progress.current_clicks + 1;
      const newIsCompleted = newCurrentClicks >= progress.target_clicks;

      await trx('progress')
        .update({
          current_clicks: newCurrentClicks,
          is_completed: newIsCompleted,
        })
        .where({ id: progress.id }); // Assuming only one progress record

      const updatedProgress = await trx('progress').first();
      res.json(updatedProgress);
    });

  } catch (err) {
    next(err);
  }
});

app.get('/api/progress', async (req, res, next) => {
  try {
    const progress = await db('progress').first();
    if (!progress) {
      return res.status(404).json({ message: 'Progress record not found.' });
    }
    res.json(progress);
  } catch (err) {
    next(err);
  }
});



// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack); // Log the error stack for debugging
  res.status(500).json({
    message: 'An unexpected error occurred',
    error: process.env.NODE_ENV === 'development' ? err.message : {} // Only send error message in development
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});