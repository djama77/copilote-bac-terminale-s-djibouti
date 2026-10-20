# OpenAI dans Copilote BAC (V1)

L'application utilise déjà `POST /api/tutor`. La branche conserve ce point d'entrée et ajoute **facultativement** OpenAI, sans interrompre le fournisseur existant.

## Activer OpenAI sur Vercel
Dans les variables d'environnement **serveur** :
- `TUTOR_PROVIDER=openai`
- `OPENAI_API_KEY` : clé secrète, jamais dans GitHub ni dans le navigateur
- `OPENAI_MODEL=gpt-4.1-mini` (facultatif ; choisir un modèle disponible, compatible avec les images)

Redéployer. Sans `TUTOR_PROVIDER=openai`, les variables existantes `TUTOR_API_URL`, `TUTOR_API_KEY`, `TUTOR_MODEL` continuent d'être utilisées.

Le navigateur envoie déjà les questions, matières et photos à `/api/tutor`. La nouvelle route indépendante `/api/chat` est expérimentale et ne remplace pas ce fonctionnement.

## Précautions de mise en production
La version présente n'a pas encore de limitation des requêtes, d'authentification, ni de contrôle de budget. Ne pas activer publiquement une clé payante avant ces protections. Prévoir en priorité un quota côté serveur et une protection contre les appels automatisés.

Les conversations historiques ne sont pas automatiquement disponibles dans l'API OpenAI. Exporter, sélectionner, anonymiser et indexer uniquement les documents pédagogiques autorisés. Ne jamais mettre des conversations personnelles ou des données d'élèves dans un dépôt public.

## Vérifications
- Vérifier que `/api/tutor` fonctionne toujours avec les variables TUTOR_* existantes.
- Vérifier le mode OpenAI avec texte puis photo.
- Vérifier le refus des images non valides et les erreurs sans clé.
- Vérifier le déploiement Vercel et l'interface Android/PWA.
