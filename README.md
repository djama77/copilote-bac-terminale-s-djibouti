# Copilote Bac Terminale S — Djibouti

Projet pédagogique open source destiné à accompagner les élèves de Terminale série S à Djibouti.

## Objectif

Le projet regroupe des skills pédagogiques pour :
- comprendre et réviser le programme ;
- expliquer les cours simplement ;
- corriger des exercices pas à pas ;
- diagnostiquer les erreurs ;
- générer des indices, quiz et exercices similaires ;
- préparer des devoirs et des Bac blancs ;
- travailler les Mathématiques, la Physique, la Chimie, la SVT et la Philosophie.

## Skills

Le dossier `skills/` contient désormais 34 modules. La V2 ajoute : analyse d'une photo de cours, comparaison au programme CRIPEN, fiche de révision, flashcards, carte mentale, quiz basé sur le cours, exercice type Bac, révision espacée, correction centrale d'exercices photo et référence Mathématiques CRIPEN.

### Fonctions V2
- `/photo-corrige` : correction complète d'un exercice à partir d'une photo.
- `/analyse-cours` : analyse d'une page de cours photographiée.
- `/compare-programme` : comparaison avec le programme CRIPEN.
- `/fiche-revision` : génération d'une fiche synthétique.
- `/flashcards` : cartes Question/Réponse.
- `/carte-mentale` : carte mentale textuelle.
- `/quiz-cours` : quiz uniquement sur le cours étudié.
- `/exo-type-bac` : exercice original niveau Bac S Djibouti.
- `/revision-espacee` : réactivation progressive des notions déjà étudiées.

### Mathématiques CRIPEN
Le projet référence maintenant le programme officiel, le manuel élève « Mathématiques — Terminale Scientifique (S) » du CRIPEN (édition 2015), les annales Bac Série S et le soutien scolaire CRIPEN. Le manuel indique l'existence d'un guide pédagogique et/ou support numérique, mais aucun PDF public officiel du guide professeur de Mathématiques Terminale S n'a été retrouvé de façon fiable lors de la recherche du 14 octobre 2026. Le dépôt prévoit donc un emplacement local pour l'ajouter si l'utilisateur le possède légalement.

## Commandes utiles

`/photo-corrige` · `/transcription` · `/corrige` · `/explique-simple` · `/indice` · `/verifie` · `/exo-similaire` · `/erreurs` · `/mode-bac` · `/quiz` · `/mode-devoir` · `/bac-blanc` · `/philo` · `/revision`

## Sources

Priorité recommandée :
1. documents fournis par l'utilisateur ;
2. programme et ressources officielles CRIPEN/MENFOP ;
3. manuels ou corrigés que l'utilisateur a le droit d'utiliser ;
4. connaissances générales en complément.

Les PDF de manuels/corrigés ne sont pas redistribués dans ce dépôt public.

## Utilisation

Lire d'abord :
1. `PROMPT_MAITRE_COPILOTE_BAC.md`
2. `manifest.yaml`
3. le `SKILL.md` correspondant à la tâche.

## Statut

Version publique initiale du projet Copilote Bac Terminale S — Djibouti.


## Interface web V1

Une interface mobile-first est maintenant incluse à la racine du dépôt :

- `index.html` — tableau de bord principal ;
- `styles.css` — design responsive ;
- `app.js` — boutons, sélection de matière, photo et préparation des commandes ;
- `manifest.webmanifest` + `sw.js` — base PWA installable ;
- `vercel.json` — déploiement statique Vercel.

### Boutons principaux
`/photo-corrige` · `/analyse-cours` · `/fiche-revision` · `/flashcards` · `/quiz-cours` · `/carte-mentale` · `/exo-type-bac` · `/compare-programme` · `/revision-espacee`

> L'interface est fonctionnelle côté navigateur. La prochaine couche est la connexion du bouton **Envoyer** à une API IA réelle du Copilote.
