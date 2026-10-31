# Mise en œuvre V9 — CRIPEN, parcours, suivi, Bac et mobile

## Références CRIPEN avec pagination
Le fichier `sources/cripen_terminal_curriculum.json` contient les débuts de sections et les pages imprimées confirmées du programme compilé Terminale. Les chapitres détaillés ne sont renseignés que lorsqu'ils sont visibles dans l'extraction du PDF. Les pages « à partir de » ne doivent pas être présentées comme une pagination exacte de chapitre.

Source : https://cripen.dj/wp-content/uploads/2025/05/Programme-compile-Terminale.pdf
Index Bac S : https://cripen.dj/index.php/serie-s/

Le portail CRIPEN affiche les matières et années d'annales consultables, mais la liste des années n'est pas continue. Vérifier le fichier source individuel avant de l'indexer ou de le qualifier d'officiel.

## Parcours personnalisé
L'élève choisit une matière et un chapitre, puis démarre un parcours : diagnostic, rappel, exercice guidé, exercice autonome, quiz, bilan et révision espacée J+1/J+3/J+7/J+14. Les états sont « non commencé », « en cours », « fragile » et « maîtrisé ». Les seuils de maîtrise restent paramétrables ; ne pas inférer la maîtrise sur la seule présence dans un chapitre.

## Supabase
Le schéma proposé est dans `supabase/schema/learning_progress.sql`. Il comprend profils, progression par chapitre, tentatives de quiz, séances et calendrier de révision avec RLS propriétaire sur chaque table.

**Important :** les projets Supabase accessibles sont `instad-data-hub` et `palabre-numerique-archives`. Aucun ne s'identifie au Copilote Bac. Le SQL est donc un brouillon versionné et n'a pas été appliqué. Il faut confirmer le bon projet Supabase avant de créer des tables, d'activer Auth ou de configurer les secrets Vercel.

Variables attendues côté serveur :
- `SUPABASE_URL`
- `SUPABASE_PUBLISHABLE_KEY`

Ne jamais exposer une clé `service_role` ou une clé secrète dans le navigateur.

## Quiz et simulation Bac
Réutiliser les commandes /quiz-cours, /exo-type-bac et /bac-blanc. Toute simulation doit indiquer matière, durée, barème indicatif, tentative avant correction, correction par question, points, forces, lacunes et exercice de remédiation. Les annales restent celles du Bac de Djibouti. Les créations IA sont signalées comme non officielles.

## Visuels et mobile
Prioriser schémas légendés, tableaux de données, courbes avec axes/unités, formules et cartes mentales. Vérifier affichage petit écran, commandes tactiles, pièces jointes et retours d'erreur. Le produit suppose une connexion Internet ; aucune promesse de fonctionnement hors ligne.
