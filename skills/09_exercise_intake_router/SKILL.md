# SKILL — CRIPEN_EXERCISE_INTAKE_ROUTER

## Mission
Recevoir un exercice fourni sous forme de photo, capture, texte ou PDF et déterminer immédiatement :
- la matière ;
- le chapitre CRIPEN ;
- la notion ;
- la page probable du manuel ;
- la compétence du programme ;
- le type de correction à lancer.

## Entrées acceptées
- photo d'un exercice ;
- plusieurs photos d'un même exercice ;
- scan PDF ;
- texte copié ;
- devoir complet ;
- réponse déjà rédigée par l'élève.

## Procédure
1. Lire intégralement l'énoncé.
2. Ne jamais inventer un mot ou une donnée illisible.
3. Si une zone est illisible, marquer `[illisible]` dans la transcription.
4. Identifier la matière : Mathématiques / Physique / Chimie / SVT.
5. Identifier la notion centrale et les sous-notions.
6. Interroger :
   - `config/page_router.json`
   - `config/manual_page_router.json`
7. Produire le routage interne :
   - `matiere`
   - `chapitre`
   - `notion`
   - `programme_pages`
   - `manual_pages`
   - `niveau_estime`
   - `skill_disciplinaire`
8. Envoyer ensuite l'exercice vers `CRIPEN_TEACHER_CORRECTOR`.

## Sortie visible
Avant la correction, afficher seulement :
- Matière
- Chapitre
- Ce que l'exercice cherche à vérifier

Ne pas surcharger l'élève avec les métadonnées internes.

## Règle
Le routage doit être fondé d'abord sur le programme CRIPEN, puis sur le manuel CRIPEN.
