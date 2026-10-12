# Copilote Bac S Djibouti — Android en ligne (PWA)

Application mobile expérimentale (Vite + JavaScript). Elle propose les matières, modes pédagogiques, saisie d'exercices, sélection de photo, liens CRIPEN, manifeste et service worker.

## Développement
Installer Node.js 20+, puis :
```bash
cd android-web
npm install
npm run dev
```
Pour construire : `npm run build`.

## Mise en ligne
Dans Vercel, importer le dépôt GitHub et sélectionner le répertoire racine `android-web`. Le site doit être servi en HTTPS pour l'installation PWA. Ouvrir le site dans Chrome Android puis menu ⋮ → Ajouter à l'écran d'accueil / Installer l'application (selon Chrome).

## IA : non activée par défaut
L'interface envoie `multipart/form-data` à `POST /api/tutor` avec subject, mode, question et photo facultative.
Le point d'accès fourni répond volontairement HTTP 501 : il reste à déployer un backend HTTPS avec authentification, limitation des requêtes, validation des photos, OCR/vision, règles de confidentialité, contrôle des coûts et connexion Qwen3. Ne jamais exposer Ollama local ni une clé secrète dans le navigateur.

## Limitations
- Aucun APK construit.
- PWA installable après déploiement HTTPS et vérification du navigateur.
- Les pages peuvent être mises en cache, mais l'assistant IA nécessite Internet.
- La photo est sélectionnable mais pas encore analysée par le serveur.
- Ne pas publier de manuels ou sujets protégés sans autorisation.
