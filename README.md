# Copilote Bac Terminale S — Djibouti

Projet pédagogique open source pour accompagner les élèves de Terminale S à Djibouti en Mathématiques, Physique, Chimie, SVT et Philosophie.

## Préparation au Bac — V2.1

Le tableau de bord comprend désormais un parcours **Préparation au Bac** :
- /preparation-bac : diagnostic, priorités par matière, planning et suivi des progrès ;
- /bac-blanc : simulation d'épreuve avec tentative avant correction ;
- /revision et /revision-espacee : renforcement et mémorisation ;
- /exo-type-bac : entraînement sur des exercices originaux ;
- /fiche-revision, /flashcards et /quiz-cours : consolidation des connaissances.

Le nouveau skill skills/35_bac_preparation_coach/SKILL.md orchestre les modules existants sans les dupliquer.

## Annales et corrigés SVT — Djibouti

La rubrique « Sujets et corrigés de SVT » donne accès directement à la page d'annales SVT de Djibouti, au portail Annales Bac Série S du CRIPEN et aux documents de correction SVT 2025 et 2023 référencés.

**Important :** la page CRIPEN est une source institutionnelle. La page DJIBSVT est une ressource pédagogique SVT associée à l'Inspection/MENFOP. Les fichiers Google Drive sont hébergés par un tiers. Leur provenance doit être vérifiée sur chaque document ; ils ne sont pas automatiquement qualifiés de corrigés officiels CRIPEN. Les liens externes peuvent changer ou demander une connexion.

## Skills et commandes

Le dossier skills contient maintenant 35 modules déclarés dans manifest.yaml.

Commandes principales : /preparation-bac · /annales-svt · /bac-blanc · /revision · /revision-espacee · /exo-type-bac · /photo-corrige · /fiche-revision · /quiz-cours · /compare-programme

## Sources et règles

Priorité : documents fournis par l'utilisateur ; programme et ressources officielles CRIPEN/MENFOP ; annales CRIPEN et ressources pédagogiques SVT référencées avec provenance explicitée ; manuels et corrigés autorisés ; connaissances générales en complément.

Ne jamais prétendre qu'un contenu est CRIPEN officiel s'il ne vient pas d'une source CRIPEN/MENFOP vérifiable. Les PDF ne sont pas redistribués dans ce dépôt public.

## Interface web

- index.html : tableau de bord mobile-first, Préparation au Bac et Annales SVT ;
- styles.css : design responsive ;
- app.js : navigation, commandes, photo et ajout de sujet PDF ;
- manifest.webmanifest et sw.js : base PWA installable ;
- api/tutor.js : intégration OpenAI côté serveur.

La clé API reste exclusivement côté serveur. Ne jamais placer OPENAI_API_KEY dans le navigateur, GitHub Actions publiques ou l'APK.

Le chatbot utilise l'API OpenAI via /api/tutor, avec conversation multi-tours, historique local, envoi de photos et de sujets PDF. Le modèle est configuré avec OPENAI_MODEL (valeur par défaut du code : gpt-4.1-mini).

Après modification des variables d'environnement, redéployer le backend.
