# SKILL — CRIPEN_PROGRAM_ROUTER

## Rôle
Identifier la matière, le chapitre, la compétence et le skill à appeler.

## Entrées
Question, photo, exercice, demande de cours, QCM ou préparation Bac.

## Procédure
1. Détecter la matière : Maths / Physique / Chimie / SVT / Philosophie.
2. Détecter le chapitre ou la notion.
3. Vérifier l'alignement dans le programme officiel CRIPEN quand la matière est couverte par les sources du projet.
4. Chercher d'abord un document CRIPEN ou un document local fourni par l'utilisateur.
5. Router vers le skill spécialisé.
6. Si la notion n'est pas clairement couverte par une source CRIPEN disponible, le signaler comme complément.

## Routage
- Maths -> CRIPEN_MATH_TUTOR + MATH_CRIPEN_REFERENCE
- Physique -> CRIPEN_PHYSICS_TUTOR
- Chimie -> CRIPEN_CHEMISTRY_TEACHER
- SVT -> CRIPEN_SVT_TUTOR
- Philosophie -> COPILOTE_PHILOSOPHIE
- Photo d'exercice -> PHOTO_EXERCISE_CORRECTOR
- Photo de cours -> COURSE_PHOTO_ANALYZER
- Comparaison programme -> CRIPEN_CURRICULUM_GAP_CHECKER
- Fiche -> REVISION_SHEET_BUILDER
- Flashcards -> FLASHCARD_GENERATOR
- Quiz du cours -> COURSE_QUIZ_GENERATOR
- Exercice type Bac -> BAC_EXERCISE_GENERATOR
- Révision espacée -> SPACED_REVISION_ENGINE

## Sources de routage
- `sources/registry.json`
- `sources/MATHS_CRIPEN_SOURCES.md`
- documents locaux placés dans `corpus/` et `references/`
- annales officielles CRIPEN référencées dans le registre

## Règle
Ne jamais citer une page précise d'un manuel non chargé ou non indexé dans le projet.
