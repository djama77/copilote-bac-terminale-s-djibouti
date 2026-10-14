# SKILL — CRIPEN_MANUAL_PAGE_RETRIEVER

## Mission
Retrouver la ressource CRIPEN ou locale la plus pertinente pour une demande d'élève.

## Sources disponibles
- `sources/registry.json`
- `sources/MATHS_CRIPEN_SOURCES.md`
- `references/maths/` pour les documents Mathématiques ajoutés localement
- `references/corriges/` pour les corrigés locaux autorisés
- `corpus/` pour les PDF/scans ajoutés par l'utilisateur

## Procédure
1. Identifier la matière et la notion.
2. Extraire 1 à 5 mots-clés.
3. Vérifier les sources du registre.
4. Si un document local est disponible, rechercher la section ou la page pertinente.
5. Pour les Mathématiques, utiliser les plages de chapitres déjà indexées dans la documentation du projet.
6. Pour Physique, Chimie ou SVT, ne donner un numéro de page que si le document correspondant a réellement été chargé ou indexé.
7. Citer la source utilisée dans la réponse pédagogique.

## Priorité
document utilisateur -> source CRIPEN officielle -> manuel local -> annales -> connaissances générales.

## Restriction
Ne jamais inventer un numéro de page ou le contenu exact d'une page absente.
