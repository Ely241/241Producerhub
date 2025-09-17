# Fichier de Bonnes Pratiques - Développement Full-Stack

Ce document répertorie les bonnes pratiques et les leçons apprises lors du développement et du débogage de l'application OPRAG, afin d'éviter de reproduire des erreurs courantes.

## 1. Gestion des Assets Statiques (Images, Audios, etc.)

### Problème rencontré :
- Les assets ne s'affichaient/ne se lançaient pas sur le frontend (erreurs 404, "Cannot GET").
- Incohérences entre les chemins dans `beats.json`, les scripts de copie, et les routes `express.static`.
- Problèmes de Content Security Policy (CSP) bloquant le chargement des ressources.

### Bonnes Pratiques :
- **Cohérence des Chemins :**
    - **Définir une stratégie claire pour les chemins des assets** (relatifs ou absolus) et s'y tenir.
    - S'assurer que les chemins dans les données (ex: `beats.json`) correspondent exactement aux URLs servies par le backend.
    - **Utiliser des chemins relatifs** dans le frontend pour les assets servis par le même domaine (ex: Vercel pour les images si elles sont dans `public`).
- **Processus de Build du Backend :**
    - **S'assurer que tous les assets nécessaires sont copiés** dans le dossier de build (`dist`) du backend.
    - Utiliser des scripts de copie robustes (`mkdir -p`, `cp -R`) dans `package.json`.
    - **Vérifier les logs de build** pour confirmer que la copie s'effectue sans erreur et que les fichiers sont aux emplacements attendus (`ls -laR dist/...`).
- **Attention aux Sous-Dossiers Imbriqués (`cp -R` et `express.static`) :**
    - Lorsque vous copiez un dossier (ex: `src/assets/audio`) qui contient lui-même un sous-dossier du même nom (ex: `src/assets/audio/audio.mp3`), la commande `cp -R` peut créer une structure imbriquée dans la destination (ex: `dist/backend/src/assets/audio/audio/audio.mp3`).
    - Assurez-vous que les chemins dans `express.static` (`path.join(__dirname, 'assets/audio/audio')`) correspondent exactement à cette structure imbriquée si elle est intentionnelle, ou ajustez votre script de copie pour éviter l'imbrication si elle ne l'est pas.
    - **Toujours vérifier la structure du dossier de destination avec `ls -laR` dans les logs de build.**
- **Routes Statiques Express (`express.static`) :**
    - **Vérifier attentivement les chemins source** passés à `express.static` par rapport à l'emplacement réel des fichiers dans le dossier `dist` du backend.
    - Utiliser `path.join(__dirname, 'chemin/relatif/au/fichier/compilé')` ou `path.join(process.cwd(), 'chemin/relatif/au/dossier/de/travail')` avec une bonne compréhension de ce que `__dirname` et `process.cwd()` représentent dans l'environnement de déploiement.
    - **Éviter les conflits de préfixes d'URL** (`app.use('/audio', ...)` pointant vers des dossiers différents). Utiliser des préfixes plus spécifiques si nécessaire (ex: `/audio/beats`, `/audio/6trece`).
- **Content Security Policy (CSP) :**
    - **Définir explicitement une CSP permissive** dans le backend pour autoriser le chargement des images, audios, scripts, etc., depuis les domaines nécessaires (y compris `self` et le domaine de déploiement).
    - Ne pas se fier aux CSP par défaut des plateformes de déploiement si elles sont trop restrictives.

## 2. Débogage des Problèmes de Déploiement

### Problème rencontré :
- Erreurs obscures au démarrage du serveur (`TypeError: Missing parameter name`).
- Difficulté à isoler la cause des problèmes de chargement de ressources.

### Bonnes Pratiques :
- **Débogage par Isolation :**
    - En cas d'erreur au démarrage, **commenter progressivement des blocs de code** (middlewares, routes, services) pour isoler la ligne ou le module problématique.
    - **Ajouter des `console.log` stratégiques** pour tracer le flux d'exécution et les valeurs des variables clés.
- **Vérification des Logs de Déploiement :**
    - Toujours consulter les logs de build et de runtime sur la plateforme de déploiement (Render, Vercel) pour obtenir des messages d'erreur détaillés.
- **Vérification des Requêtes Réseau du Navigateur :**
    - Utiliser l'onglet "Network" des outils de développement pour vérifier si les requêtes sont faites, leur URL exacte, leur statut (200, 404, 500), et les en-têtes de réponse (notamment `Content-Security-Policy`).
- **Vérification du DOM et du CSS :**
    - Utiliser l'onglet "Elements" pour s'assurer que les balises HTML sont rendues correctement et qu'aucun style CSS ne les masque.

## 3. Cohérence des Données et des Types

### Problème rencontré :
- Faute de frappe dans les données (`Tchief Keef` vs `Chief Keef`) entraînant un filtrage incorrect.
- Incohérences de type (`price` renvoyé comme string au lieu de number).

### Bonnes Pratiques :
- **Validation des Données :**
    - Utiliser des schémas de validation (ex: Joi) pour les données entrantes et sortantes.
    - S'assurer que les données sources (ex: `beats.json`) sont exemptes d'erreurs et cohérentes avec les schémas.
- **Typage Fort (TypeScript) :**
    - Utiliser TypeScript de manière rigoureuse pour typer toutes les variables, paramètres de fonction et retours.
    - Installer les définitions de types (`@types/package`) pour toutes les bibliothèques utilisées.
    - Configurer le compilateur TypeScript (`tsconfig.json`) pour être strict (`noImplicitAny: true`, etc.).
- **Gestion des Types de Base de Données :**
    - Configurer les pilotes de base de données (ex: `pg`) pour parser les types numériques (`DECIMAL`, `NUMERIC`) en nombres JavaScript pour éviter les problèmes de `toFixed is not a function`.

## 4. Organisation du Code (Refactorisation)

### Problème rencontré :
- Fichier `server.ts` monolithique, rendant le débogage et la maintenance difficiles.

### Bonnes Pratiques :
- **Modularisation des Routes :**
    - Séparer les routes API en modules distincts (ex: `routes/beats.ts`, `routes/artists.ts`).
    - Utiliser un routeur Express (`express.Router()`) pour chaque module.
    - Intégrer ces modules dans le fichier principal du serveur (`server.ts`) via `app.use()`.
- **Centralisation des Configurations :**
    - Garder les configurations (ex: Knex, variables d'environnement) dans des fichiers dédiés.

## 5. Gestion de Version (Git)

### Problème rencontré :
- Modifications locales non poussées, entraînant des incohérences entre le code local et le code déployé.

### Bonnes Pratiques :
- **Commits Fréquents et Atomiques :**
    - Commiter de petits changements logiques et fonctionnels.
    - Utiliser des messages de commit clairs et descriptifs.
- **Push Réguliers :**
    - Pousser les changements fréquemment vers le dépôt distant pour s'assurer que la plateforme de déploiement a la dernière version du code.
- **Vérification du Commit ID :**
    - Toujours vérifier le commit ID du déploiement sur la plateforme pour s'assurer que la bonne version du code est déployée.
