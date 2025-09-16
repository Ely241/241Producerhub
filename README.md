# Beats Blast - Plateforme de Vente de Prods Musicales

Beats Blast est une application web moderne conçue pour les producteurs de musique afin de présenter et vendre leurs créations (beats). Elle offre une interface utilisateur épurée, une navigation fluide et des fonctionnalités dédiées à l'écoute et à l'acquisition de prods.

## ✨ Fonctionnalités

*   **Catalogue de Prods** : Visualisez les prods disponibles avec des informations détaillées.
*   **Lecteur Audio Intégré** : Écoutez un aperçu de chaque prod directement sur le site.
*   **Navigation Facile** : Accédez rapidement aux différentes sections grâce à une barre de navigation intuitive.
*   **Design Adaptatif** : Une expérience utilisateur optimale sur ordinateur, tablette et mobile.

## 🚀 Stack Technique

Ce projet est construit avec un ensemble de technologies modernes et performantes :

*   **Framework Frontend** : [React](https://react.dev/)
*   **Build Tool** : [Vite](https://vitejs.dev/)
*   **Langage** : [TypeScript](https://www.typescriptlang.org/)
*   **Style** : [Tailwind CSS](https://tailwindcss.com/)
*   **Composants UI** : Bibliothèque [shadcn/ui](https://ui.shadcn.com/), basée sur Radix UI.
*   **Routing** : [React Router](https://reactrouter.com/)
*   **Animations** : [Framer Motion](https://www.framer.com/motion/) et [tsParticles](https://particles.js.org/) pour les arrière-plans animés.
*   **Qualité de Code** : [ESLint](https://eslint.org/)

## 📂 Structure du Projet

Le projet est organisé de manière modulaire pour faciliter la maintenance et le développement.

```
/
├── public/              # Fichiers statiques (icônes, images)
├── src/
│   ├── assets/          # Ressources (logo, images de fond)
│   ├── components/      # Composants React réutilisables
│   │   ├── layout/      # Composants de structure (Navbar, Background)
│   │   └── ui/          # Composants d'interface (boutons, cartes, etc. - shadcn/ui)
│   ├── hooks/           # Hooks React personnalisés
│   ├── lib/             # Fonctions utilitaires (ex: `cn` de shadcn)
│   ├── pages/           # Composants représentant les pages de l'application
│   └── main.tsx         # Point d'entrée de l'application React
├── package.json         # Dépendances et scripts du projet
└── tailwind.config.ts   # Configuration de Tailwind CSS
```

## 🛠️ Scripts Disponibles

Pour commencer à travailler sur le projet, suivez ces étapes. Assurez-vous d'avoir [Node.js](https://nodejs.org/) (v18+) installé.

1.  **Cloner le dépôt** (si ce n'est pas déjà fait) :
    ```bash
    git clone <URL_DU_DEPOT>
    cd jyls-241-beats-blast-main
    ```

2.  **Installer les dépendances** :
    Ce projet utilise `npm` comme gestionnaire de paquets.
    ```bash
    npm install
    ```

3.  **Lancer le serveur de développement** :
    Cette commande démarre un serveur local (généralement sur `http://localhost:5173`) avec rechargement à chaud.
    ```bash
    npm run dev
    ```

4.  **Construire pour la production** :
    Cette commande génère les fichiers statiques optimisés pour le déploiement dans le dossier `dist/`.
    ```bash
    npm run build
    ```

5.  **Linter le code** :
    Cette commande analyse le code pour trouver et corriger les problèmes de style et les erreurs potentielles.
    ```bash
    npm run lint
    ```