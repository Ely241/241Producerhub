# Fichier de Réversion - Nettoyage du Projet

Ce fichier contient les commandes pour annuler la suppression des fichiers et dossiers qui seront nettoyés.

**IMPORTANT :** Exécutez ces commandes *avant* de commiter la suppression. Si vous avez déjà commité la suppression, vous devrez utiliser une commande plus complexe comme `git checkout <commit_hash> -- <file_path>`.

## Commandes de Réversion

Pour restaurer un fichier ou un dossier spécifique, utilisez la commande `git restore` correspondante depuis la racine du projet.

---

### 1. Dossier Dupliqué
```sh
git restore "jyls-241-beats-blast-main/"
```

### 2. Assets Inutilisés
```sh
git restore "ONE YEARS AGO/"
git restore "src/assets/images/"
git restore "src/assets/hero-bg.jpg"
```

### 3. Fichiers de Données Inutilisés
```sh
git restore "src/data/artists.ts"
git restore "src/data/beats.ts"
```

### 4. Fichiers de Documentation et Notes
```sh
git restore "analysis_report.md"
git restore "background.txt"
git restore "better_way.md"
git restore "bonnes_pratiques.md"
git restore "comparaison.md"
git restore "prompt_master.md"
git restore "rapport.md"
git restore "taches.md"
```
