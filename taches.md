# Tâches et Améliorations pour "Beats Blast"

Voici la liste des tâches à accomplir pour préparer le site à sa mise en production et les pistes d'améliorations futures.

### Contenu et Fonctionnalités 🎯

- [ ] **Intégrer la première prod :** Ajouter le fichier audio et les informations (titre, etc.) dans la page "Beats".
- [ ] **Finaliser le contenu textuel :** Remplacer les textes de remplissage par le contenu final sur les autres pages (Accueil, À Propos).

### Performance 🚀

- [ ] **Optimiser les images :** Compresser les images (`hero-bg.jpg`, `logo.png`, etc.) et les convertir au format WebP pour un chargement plus rapide.
- [ ] **Vérifier la taille du build :** Lancer `npm run build` et analyser la taille des fichiers générés pour identifier d'éventuels paquets trop lourds.

### SEO (Référencement) 📈

- [ ] **Mettre à jour l'image de partage social :** Dans `index.html`, remplacer l'URL de `lovable.dev` dans les balises `og:image` et `twitter:image` par une image représentative du site.
- [ ] **Générer et ajouter un `sitemap.xml` :** Créer un sitemap listant toutes les pages du site (`/`, `/beats`, `/about`) et le placer dans le dossier `public/`.

### Sécurité 🛡️

- [ ] **Auditer les dépendances :** Lancer la commande `npm audit --production` pour détecter et corriger les vulnérabilités dans les paquets utilisés en production.

### Légal ⚖️

- [ ] **Créer une page "Politique de Confidentialité" :** Obligatoire pour informer les utilisateurs sur la collecte et l'utilisation de leurs données.
- [ ] **Ajouter les liens vers les pages légales :** Typiquement dans le pied de page (footer) du site.

### Déploiement 🌐

- [ ] **Choisir un hébergeur :** Sélectionner une plateforme comme [Vercel](https://vercel.com/) ou [Netlify](https://www.netlify.com/), qui sont optimisées pour les projets React/Vite.
- [ ] **Configurer le déploiement continu (CI/CD) :** Lier le dépôt Git à l'hébergeur pour que chaque `push` sur la branche principale déclenche automatiquement un nouveau déploiement.
- [ ] **Configurer le nom de domaine personnalisé.**

---

## Améliorations Suggérées

### 1. Architecture et Qualité du Code

- [ ] **Centraliser les données (Haute priorité) :** Supprimer `src/data/beats.ts` et faire en sorte que toutes les données des beats (y compris pour la page d'accueil) proviennent de l'API backend pour avoir une source de vérité unique.
- [ ] **Partager les types :** Créer un dossier `shared/types` pour y définir les interfaces communes (`Beat`, `Artist`, etc.) et les importer dans le frontend et le backend pour éviter la duplication et les erreurs.
- [ ] **Variables d'environnement :** Utiliser des fichiers `.env` pour gérer les configurations (URL de l'API, port, etc.) au lieu de les coder en dur.

### 2. Fonctionnalités et Expérience Utilisateur (UX)

- [ ] **Filtrage et recherche :** Sur la page "Beats", ajouter des filtres (par genre, tags) et une barre de recherche.
- [ ] **Pagination :** Ajouter une pagination sur la page "Beats" pour gérer un grand nombre de prods.
- [ ] **Système de "Like" par utilisateur :** Si un système de comptes est prévu, lier les "likes" aux utilisateurs en base de données.

### 3. Déploiement

- [ ] **Base de données de production :** Remplacer SQLite par une base de données plus robuste comme PostgreSQL pour la mise en production.