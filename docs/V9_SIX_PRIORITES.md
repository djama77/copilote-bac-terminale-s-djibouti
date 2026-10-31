# V9 — Plan des six améliorations prioritaires

## Périmètre validé

- Public : élèves de Terminale S de Djibouti.
- Langue de l'application, navigation et consignes générales : français.
- Matières : Mathématiques, Physique, Chimie, SVT, Philosophie, Français, Anglais et Arabe. L'arabe reste une matière ; il ne devient pas la langue générale de l'interface.
- Utilisation connectée à Internet. Aucun chantier de fonctionnement hors ligne dans cette version.
- Réutiliser les composants, compétences, commandes et ressources existants. Pas de réécriture globale.
- Pour les cours : priorité CRIPEN/MENFOP et documents fournis par l'élève. Pour les annales : Bac de Djibouti seulement. Toute correction générée par l'IA reste explicitement non officielle.

## Les six priorités

### 1. Fiabilité du tuteur IA et de son API
- Rendre le point d'entrée HTTP explicite, valider les entrées et traiter proprement les erreurs.
- Garder la clé OpenAI exclusivement côté serveur.
- Gérer les conversations avec l'API Responses et les identifiants de conversation.
- Vérifier l'envoi des photos et PDF, les limites de taille, les erreurs 429 et les délais.
- Ajouter ensuite limitation de débit, protection anti-abus et tests automatisés avant mise en production.

### 2. Tuteur pédagogique ancré sur les ressources CRIPEN
- Exploiter le registre de sources déjà présent et les documents réellement disponibles.
- Préparer une recherche documentaire (RAG) par matière/chapitre, avec extraits, nom du document et page.
- Ne jamais présenter un lien externe comme un document indexé.
- Ne pas intégrer ou republier un PDF sans vérifier sa provenance et ses droits.

### 3. Parcours d'apprentissage personnalisé
- Diagnostic initial par matière et chapitre.
- Identifier les notions maîtrisées, fragiles et à revoir.
- Proposer des étapes courtes : rappel de cours, exercice guidé, exercice autonome, puis exercice type Bac.
- Réutiliser les compétences existantes de diagnostic, remédiation et révision espacée.

### 4. Tableau de bord et suivi des progrès
- Historique durable des séances, résultats de quiz, chapitres travaillés et révisions à venir.
- Indicateurs simples : progression par matière, maîtrise par chapitre, régularité et prochaines actions.
- L'historique actuellement conservé dans localStorage est local au navigateur ; il ne constitue pas un suivi multi-appareil.
- Intégrer Supabase uniquement après identification du projet Supabase réellement destiné à ce Copilote, inspection du schéma et validation des règles RLS. Ne pas réutiliser un projet d'une autre application.

### 5. Exercices, corrections et simulations Bac
- Quiz liés au cours étudié et correction expliquant les erreurs.
- Exercices inédits clairement étiquetés « non officiels ».
- Bac blanc avec consignes, temps, barème indicatif et bilan.
- Annales reliées au pays, à l'année, à la série, au groupe et à la matière ; aucun sujet étranger en remplacement.

### 6. Apprentissage visuel et expérience mobile
- Schémas, graphiques, tableaux, formules et cartes mentales adaptés à la matière.
- Présentation lisible sur téléphone, retours d'état clairs et gestion des pièces jointes.
- Conserver une interface générale en français ; l'arabe apparaît uniquement dans la rubrique de matière Arabe.

## Ordre de livraison recommandé

1. Stabiliser et tester l'API (priorité bloquante).
2. Connecter la recherche documentaire CRIPEN avec références vérifiables.
3. Construire le parcours diagnostic et les objectifs par chapitre.
4. Concevoir le modèle de données et le suivi Supabase après audit du bon projet et des politiques RLS.
5. Améliorer les évaluations Bac et les supports visuels.
6. Vérifier l'expérience mobile, l'accessibilité et les performances.

## Limites de cette première PR

Cette PR prépare le socle et le périmètre V9. Elle ne prétend pas activer une base Supabase, un RAG, des comptes élèves, un tableau de bord multi-appareil ni un déploiement Vercel. Ces étapes nécessitent l'identification du projet Supabase correct, les tests sur vraie base, les secrets d'environnement et une fenêtre de déploiement autorisée.
