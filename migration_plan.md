# Plan de Migration vers Supabase

Ce document décrit les étapes pour migrer la base de données et l'accès aux données du projet "Beats Blast" vers Supabase.

## 1. Évaluation Préliminaire

*   **Avantages de Supabase pour ce projet :**
    *   Base de données PostgreSQL managée (moins de gestion d'infrastructure).
    *   APIs instantanées (REST et GraphQL) générées automatiquement, potentiellement simplifiant le backend.
    *   Fonctionnalités temps réel (si nécessaires à l'avenir).
    *   Authentification intégrée (si des comptes utilisateurs sont prévus).
*   **Considérations :**
    *   Effort de migration des données existantes.
    *   Adaptation du code backend (Knex.js vs client Supabase).
    *   Coût potentiel si le projet dépasse le tier gratuit.

## 2. Étapes de Migration

### 2.1. Préparation de l'Environnement Supabase

1.  **Créer un compte Supabase :** Si ce n'est pas déjà fait, créer un compte sur [Supabase.com](https://supabase.com/).
2.  **Créer un nouveau projet Supabase :** Choisir une région proche de vos utilisateurs cibles.
3.  **Récupérer les informations de connexion :** Noter l'URL de l'API et la clé `anon` (public) et `service_role` (secrète) de votre projet Supabase.

### 2.2. Migration du Schéma de la Base de Données

1.  **Exporter le schéma actuel :** Utiliser `pg_dump` (pour PostgreSQL) ou un outil SQLite pour exporter le schéma de votre base de données actuelle.
2.  **Créer les tables dans Supabase :** Utiliser l'interface SQL de Supabase ou un client PostgreSQL (comme `psql` ou DBeaver) pour exécuter les commandes `CREATE TABLE` basées sur votre schéma existant (`artists`, `beats`, `tags`, `beat_tags`, `progress`).
    *   **Attention aux types de données :** S'assurer que les types de données correspondent bien entre votre base actuelle et PostgreSQL de Supabase.

### 2.3. Migration des Données Existantes

1.  **Exporter les données actuelles :** Exporter les données de chaque table (`artists`, `beats`, `tags`, `beat_tags`, `progress`) dans un format compatible (CSV, SQL `INSERT` statements).
2.  **Importer les données dans Supabase :** Utiliser l'interface de chargement CSV de Supabase ou exécuter les commandes `INSERT` via le client SQL.

### 2.4. Adaptation du Code Backend (Node.js)

1.  **Installer le client Supabase :**
    ```bash
    npm install @supabase/supabase-js
    ```
2.  **Remplacer Knex.js par le client Supabase :**
    *   **Initialisation :** Remplacer l'initialisation de Knex par l'initialisation du client Supabase en utilisant l'URL de l'API et la clé `anon` (pour les requêtes publiques) ou `service_role` (pour les requêtes sécurisées côté serveur).
    *   **Requêtes de données :** Réécrire les requêtes Knex (`db('beats').select(...)`) pour utiliser la syntaxe du client Supabase (`supabase.from('beats').select('*')`).
        *   Exemple pour `/beats` :
            ```typescript
            // Ancien (Knex)
            // let beatsQuery = db('beats').select(...).leftJoin(...).where(...).limit(...).offset(...);
            // Nouveau (Supabase)
            let beatsQuery = supabase.from('beats').select('*, artists(name), beat_tags(tag_id), tags(name)'); // Exemple de jointure
            if (q) beatsQuery = beatsQuery.ilike('title', `%${q}%`); // ou d'autres filtres
            // Gérer la pagination manuellement ou via des fonctions Supabase
            ```
    *   **Mutations (likes) :** Adapter les opérations `increment` et `update`.
    *   **Authentification :** Si l'authentification est ajoutée, utiliser les méthodes d'authentification de Supabase.
3.  **Mettre à jour les variables d'environnement :**
    *   `SUPABASE_URL`
    *   `SUPABASE_ANON_KEY`
    *   `SUPABASE_SERVICE_ROLE_KEY`

### 2.5. Adaptation du Code Frontend (React)

1.  **Installer le client Supabase :**
    ```bash
    npm install @supabase/supabase-js
    ```
2.  **Initialiser le client Supabase :** Dans un fichier de configuration (`src/lib/supabase.ts`), initialiser le client Supabase avec l'URL de l'API et la clé `anon`.
3.  **Adapter les appels API :** Remplacer les appels `fetch` vers votre backend par des appels directs au client Supabase pour les données qui peuvent être récupérées via les APIs instantanées de Supabase.
    *   Exemple pour `/beats` :
        ```typescript
        // Ancien (fetch vers votre backend)
        // const res = await fetch(`${API_BASE_URL}/api/beats?...`);
        // Nouveau (Supabase client)
        const { data, error } = await supabase.from('beats').select('*'); // ou des selects plus complexes
        ```
    *   **Attention :** Si votre backend actuel effectue des logiques complexes (jointures, agrégations, etc.) qui ne sont pas directement gérables par les APIs instantanées de Supabase, vous devrez soit :
        *   Créer des "Views" ou des "Functions" (Procédures Stockées) dans PostgreSQL de Supabase.
        *   Conserver une partie de votre backend Node.js pour ces logiques spécifiques, et le faire communiquer avec Supabase.

### 2.6. Déploiement et Tests

1.  **Déployer le backend mis à jour sur Render.**
2.  **Déployer le frontend mis à jour sur Vercel.**
3.  **Tests complets :** Tester toutes les fonctionnalités (affichage des beats, lecture audio, likes, etc.) pour s'assurer que la migration n'a pas introduit de régressions.

## 3. Considérations Post-Migration

*   **Gestion des Fichiers Statiques :** Supabase offre un service de stockage (Storage) qui pourrait être utilisé pour héberger les fichiers audio et images, remplaçant ainsi la copie des assets dans le `dist` du backend.
*   **Authentification :** Si des fonctionnalités d'authentification sont ajoutées, Supabase fournit des solutions robustes.
*   **Temps Réel :** Explorer les fonctionnalités de temps réel de Supabase pour des mises à jour instantanées (par exemple, le nombre de likes).