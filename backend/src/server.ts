import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import knex from 'knex'; // Garder knex pour l'initialisation de db
import knexConfig from '../knexfile'; // Garder knexConfig
import path from 'path';
import dotenv from 'dotenv';
import apiRoutes from './routes/apiRoutes'; // Importer le nouveau routeur

dotenv.config({ path: path.resolve(__dirname, '../../../..', '.env') });

const distRoot = path.join(__dirname, '..', '..'); // Points to backend/dist

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
    `img-src 'self' data: ${process.env.FRONTEND_URL}; ` +
    `media-src 'self' ${process.env.FRONTEND_URL}; ` +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " + 
    "style-src 'self' 'unsafe-inline';"
  );
  next();
});

// Serve static files from a consolidated public_assets directory
const publicAssetsPath = path.join(distRoot, 'public_assets');
app.use(express.static(publicAssetsPath));

// API Routes
app.use('/api', apiRoutes(db)); // Utiliser le routeur importé



// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack); // Always log the error stack for debugging

  // Determine the status code and message
  let statusCode = 500;
  let message = 'An unexpected server error occurred.';

  // For development, send more detailed error information
  if (process.env.NODE_ENV === 'development') {
    message = err.message || message; // Use error message if available
  }

  res.status(statusCode).json({
    message: message,
    // Optionally, send the full error object in development for more details
    ...(process.env.NODE_ENV === 'development' && { error: err.message })
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});