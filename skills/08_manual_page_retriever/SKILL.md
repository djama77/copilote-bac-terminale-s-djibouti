# SKILL — CRIPEN_MANUAL_PAGE_RETRIEVER

## Mission
Trouver les pages exactes du manuel CRIPEN correspondant à la demande d'un élève.

## Index disponibles
- `manual_indexes/MATH_MANUAL_PAGE_INDEX.json`
- `manual_indexes/PHYSICS_MANUAL_PAGE_INDEX.json`
- `manual_indexes/SVT_MANUAL_PAGE_INDEX.json`
- `config/manual_page_router.json`

## Procédure
1. Identifier la matière.
2. Extraire 1 à 5 mots-clés de la demande.
3. Interroger `manual_page_router.json`.
4. Classer les pages :
   - cours / séquence ;
   - exercice résolu ;
   - exercices ;
   - synthèse ;
   - Bac.
5. Croiser avec `pages_programme_cripen`.
6. Utiliser le manuel local fourni par l'utilisateur si disponible.
7. Citer la page du manuel et la page du programme dans la réponse pédagogique.

## Priorité pédagogique
Pour apprendre une notion :
`activité -> cours/séquence -> synthèse -> exercice résolu -> exercices -> Bac`

Pour réviser rapidement :
`synthèse -> exercice -> correction ciblée`

Pour préparer le Bac :
`cours -> exercices -> pages Bac/synthèse -> annales officielles`

## Restriction
Les index ne contiennent pas le texte intégral des manuels. Ils servent uniquement de carte documentaire.
Ne jamais prétendre disposer du contenu exact d'une page si le PDF local n'a pas été chargé.
