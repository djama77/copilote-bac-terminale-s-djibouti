# Copilote Bac S Djibouti — Gemini (Android / PWA)

Application expérimentale Vite + Capacitor : Mathématiques, Physique, Chimie, SVT et Philosophie.

## Nouvelle IA : Gemini, sans Qwen3 ni Ollama
Le client envoie un JSON `{subject, mode, question}` à une API HTTPS. Le serveur Vercel `api/tutor.js` appelle Gemini avec `GEMINI_API_KEY` côté serveur uniquement. La clé ne doit jamais être stockée dans GitHub ni dans l'APK.

### Configuration serveur Vercel
- Root Directory : `android-web`.
- Variable d'environnement **secrète** : `GEMINI_API_KEY` (clé personnelle fournie par Google AI Studio).
- Facultatif : `GEMINI_MODEL` (par défaut `gemini-2.5-flash`).
- Facultatif : `ALLOWED_ORIGIN` pour autoriser explicitement une origine web. Une origine CORS ne remplace pas une authentification.
- Déployer le projet Vercel depuis cette branche ou une branche qui contient ces fichiers.
- Vérifier l'API HTTPS : POST `https://votre-domaine.vercel.app/api/tutor` avec `Content-Type: application/json`.

### Configuration APK GitHub Actions
Dans **GitHub → Settings → Secrets and variables → Actions → Variables**, créer `TUTOR_API_URL` avec la valeur publique **HTTPS** de l'API, par exemple `https://votre-domaine.vercel.app/api/tutor`. Ce n'est pas une clé secrète. Le workflow l'intègre dans l'APK au build. Sans cette variable, l'APK ne peut pas appeler l'API distante et l'assistant reste indisponible.

### Limitations actuelles
- La sélection de photos existe, mais l'OCR et l'analyse d'images sont désactivés : saisir l'énoncé en texte.
- Les références CRIPEN sont des liens ; les PDF ne sont pas encore indexés pour fournir des réponses sourcées.
- Prévoir authentification, limitation des requêtes et plafonds de consommation avant diffusion publique : l'endpoint peut générer des coûts.
- Une clé Gemini et son quota sont nécessaires ; aucun appel IA n'est actif sans configuration.
- APK debug destiné aux tests, pas au Play Store.

## Inspirations
- https://github.com/towardsai/ai-tutor-app (tutorat et architecture de backend)
- https://github.com/AdityaRathore70677/edurag-ai-learning-platform (tuteur multi-fournisseurs, quiz)
- https://github.com/saiffOP/RAG-AI-Tutor (références aux pages PDF, pour une étape future)

Les fonctionnalités sont adaptées et réécrites ; aucune copie de code tiers n'est nécessaire dans cette version.
