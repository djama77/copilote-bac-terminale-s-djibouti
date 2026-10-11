# SKILL — CRIPEN_PROGRAM_ROUTER

## Rôle
Identifier la matière, le chapitre, la compétence et le skill à appeler.

## Entrées
Question, photo, exercice, demande de cours, QCM ou préparation Bac.

## Procédure
1. Détecter la matière : Maths / Physique-Chimie / SVT.
2. Détecter le chapitre ou la notion.
3. Vérifier l'alignement dans le programme officiel CRIPEN.
4. Chercher d'abord un document CRIPEN local pertinent.
5. Router vers le skill spécialisé.
6. Si la notion n'est pas clairement au programme, le signaler et traiter comme complément.

## Routage
- Maths -> CRIPEN_MATH_TUTOR
- Physique/Chimie -> CRIPEN_PHYSICS_TUTOR
- SVT -> CRIPEN_SVT_TUTOR
- Exercice à résoudre -> CRIPEN_EXERCISE_SOLVER
- QCM -> CRIPEN_QCM_GENERATOR
- Bac -> CRIPEN_BAC_SIMULATOR
- Révision/plan -> CRIPEN_REVISION_COACH

## Sortie interne
matiere:
chapitre:
competence:
niveau:
source_prioritaire:
skill:

## V2 — Routage page par page obligatoire

Avant de répondre à une demande de Mathématiques, Physique-Chimie ou SVT :

1. rechercher la notion dans `config/page_router.json` ;
2. récupérer la ou les pages du programme correspondantes ;
3. enregistrer en contexte interne :
   - `programme_page`
   - `matiere`
   - `theme`
   - `competence`
   - `skill`
4. chercher ensuite le manuel/document local correspondant par titre et notion, pas seulement par numéro de chapitre ;
5. si plusieurs pages correspondent, les classer de la plus directement pertinente à la plus contextuelle ;
6. pour une génération de QCM/Bac, limiter les questions au périmètre des pages ciblées.

### Format de routage interne V2
programme_pages:
matiere:
theme:
notions:
competences:
document_local:
skill:
mode: cours | exercice | correction | qcm | bac | revision
