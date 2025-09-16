import type { Knex } from "knex";
import pg from 'pg'; // Importer le module pg

// Configurer le parseur de type pour les nombres décimaux/numériques de PostgreSQL
// OID 1700 est le type NUMERIC/DECIMAL en PostgreSQL
pg.types.setTypeParser(pg.types.builtins.NUMERIC, parseFloat);

const config: { [key: string]: Knex.Config } = {
  development: {
    client: "sqlite3",
    connection: {
      filename: "./dev.sqlite3"
    },
    useNullAsDefault: true,
    migrations: {
      directory: "./src/database/migrations"
    },
    seeds: {
      directory: "./src/database/seeds"
    }
  },

  production: {
    client: "pg",
    connection: {
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      }
    },
    migrations: {
      directory: "./src/database/migrations"
    },
    seeds: {
      directory: "./src/database/seeds"
    }
  }
};

export default config;
