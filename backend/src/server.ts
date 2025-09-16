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
app.use(cors());
app.use(express.json());

// Middleware pour définir la Content-Security-Policy (CSP)
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; " +
    "img-src 'self' data: https://two41producerhub-1.onrender.com; " + 
    "media-src 'self' https://two41producerhub-1.onrender.com; " + 
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " + 
    "style-src 'self' 'unsafe-inline';"
  );
  next();
});

// Serve static files (audio and images)
app.use('/audio', express.static(path.join(process.cwd(), 'backend/assets/audio'))); // New beats
app.use('/audio', express.static(path.join(process.cwd(), 'backend/assets/6trece'))); // Original 6trece audio
app.use('/images', express.static(path.join(process.cwd(), 'backend/assets/images'))); // New beats
app.use('/images', express.static(path.join(process.cwd(), 'backend/assets/6trece'))); // Original 6trece assets
app.use('/images', express.static(path.join(process.cwd(), 'backend/assets'))); // Other root assets like hero-bg.jpg, logo.png
app.use('/assets-optimized', express.static(path.join(process.cwd(), 'backend/public/assets-optimized'))); // Servir les images optimisées

// API Routes
app.use('/api', apiRoutes); // Utiliser le routeur importé

// Gérer toutes les autres requêtes en renvoyant l'application frontend
// Gérer toutes les autres requêtes en renvoyant l'application frontend
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, '../../dist', 'index.html'));
// });

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