# Backend - Beats Blast API

This directory contains the backend API for the Beats Blast application. It provides endpoints for managing beats, artists, genres, and tracking user progress.

## ✨ Fonctionnalités

*   **Beats Management**: Retrieve a list of beats, filter them by genre or search query, and get detailed information for a single beat.
*   **Artist Management**: Retrieve a list of all artists.
*   **Genre Listing**: Get a list of available genres.
*   **Like Functionality**: Increment likes for a specific beat.
*   **Progress Tracking**: Track user clicks on the landing page.

## 🚀 Stack Technique

This backend is built with a modern and efficient stack:

*   **Framework**: [Express.js](https://expressjs.com/)
*   **Database ORM/Query Builder**: [Knex.js](https://knexjs.org/)
*   **Database**: SQLite3 (development) / PostgreSQL (production - configurable)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
*   **Environment Variables**: [dotenv](https://www.npmjs.com/package/dotenv)
*   **Input Validation**: [Joi](https://joi.dev/)
*   **Image Optimization**: [Sharp](https://sharp.pixelplumbing.com/) (used in `optimize-images.ts` script)

## 📂 Structure du Projet

```
backend/
├── .env.example        # Example environment variables
├── knexfile.ts         # Knex.js configuration for database connections
├── package.json        # Backend dependencies and scripts
├── scripts/
│   └── optimize-images.ts # Script for image optimization
└── src/
    ├── server.ts       # Main Express server application
    ├── data/           # JSON data files (artists, beats)
    └── database/       # Database related files
        ├── migrations/ # Knex.js migration files for schema management
        └── seeds/      # Knex.js seed files for initial data population
```

## 🛠️ Scripts Disponibles

Assurez-vous d'être dans le répertoire `backend/` pour exécuter ces commandes.

1.  **Installer les dépendances** :
    ```bash
    npm install
    ```

2.  **Lancer le serveur de développement** :
    ```bash
    npm run start
    ```

3.  **Construire le projet TypeScript** :
    ```bash
    npm run build
    ```

4.  **Optimiser les images** :
    ```bash
    npm run optimize:images
    ```

## ⚙️ Configuration de la Base de Données

Ce projet utilise Knex.js pour la gestion de la base de données. Les migrations et les seeds sont utilisées pour configurer et peupler la base de données.

1.  **Créer la base de données (si nécessaire)** :
    Pour SQLite, un fichier `dev.sqlite3` sera créé automatiquement.

2.  **Exécuter les migrations** (crée les tables de la base de données) :
    ```bash
    npx knex migrate:latest --knexfile knexfile.ts
    ```

3.  **Exécuter les seeds** (peuple la base de données avec des données initiales) :
    ```bash
    npx knex seed:run --knexfile knexfile.ts
    ```

## 环境变量 (Environment Variables)

Créez un fichier `.env` à la racine du répertoire `backend/` basé sur `.env.example` et configurez les variables suivantes :

*   `PORT`: Port sur lequel le serveur Express écoutera (par défaut `3001`).
*   `NODE_ENV`: Environnement d'exécution (`development` ou `production`).
*   `MAX_PAGINATION_LIMIT`: Limite maximale pour la pagination des beats (par défaut `100`).
*   `AUDIO_ASSETS_DIR`: Chemin relatif vers le répertoire des fichiers audio (par défaut `../../src/assets/6trece`).
*   `IMAGE_ASSETS_DIR`: Chemin relatif vers le répertoire des fichiers image (par défaut `../../src/assets/6trece`).
