import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import knex from 'knex'; // Garder knex pour l'initialisation de db
import knexConfig from '../knexfile'; // Garder knexConfig
import path from 'path';
import dotenv from 'dotenv';
import apiRoutes from './routes/apiRoutes'; // Importer le nouveau routeur

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Initialize Knex (garder ici car db est utilisé par les middlewares globaux ou d'autres parties du server.ts si elles existes)
const db = knex(knexConfig[process.env.NODE_ENV || 'development']);

// Middleware
// app.use(cors());
// app.use(express.json());

// Serve static files (audio and images)
console.log('process.env.AUDIO_ASSETS_DIR:', process.env.AUDIO_ASSETS_DIR);
console.log('Path for audio (new beats):', path.join(__dirname, process.env.AUDIO_ASSETS_DIR || '../../src/assets/audio'));
app.use('/audio', express.static(path.join(__dirname, process.env.AUDIO_ASSETS_DIR || '../../src/assets/audio'))); // New beats
console.log('Path for audio (6trece):', path.join(__dirname, '../../src/assets/6trece'));
app.use('/audio', express.static(path.join(__dirname, '../../src/assets/6trece'))); // Original 6trece audio
console.log('process.env.IMAGE_ASSETS_DIR:', process.env.IMAGE_ASSETS_DIR);
console.log('Path for images (new beats):', path.join(__dirname, process.env.IMAGE_ASSETS_DIR || '../../src/assets/images'));
app.use('/images', express.static(path.join(__dirname, process.env.IMAGE_ASSETS_DIR || '../../src/assets/images'))); // New beats
console.log('Path for images (6trece):', path.join(__dirname, '../../src/assets/6trece'));
app.use('/images', express.static(path.join(__dirname, '../../src/assets/6trece'))); // Original 6trece assets
console.log('Path for images (other root assets):', path.join(__dirname, '../../src/assets'));
app.use('/images', express.static(path.join(__dirname, '../../src/assets'))); // Other root assets like hero-bg.jpg, logo.png

// API Routes
// app.use('/api', apiRoutes); // Utiliser le routeur importé

// Gérer toutes les autres requêtes en renvoyant l'application frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../dist', 'index.html'));
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