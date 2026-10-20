# Copilote Bac S Djibouti — Android + ChatGPT

Application Android Capacitor connectée au backend `/api/tutor` du dépôt principal.

## Architecture
Android APK -> VITE_TUTOR_API_URL -> backend /api/tutor -> OpenAI API -> réponse ChatGPT.

## Configuration
Créer dans les variables GitHub Actions :
- `TUTOR_API_URL` = URL publique complète du backend, par exemple `https://votre-domaine/api/tutor`.

Le backend doit définir côté serveur :
- `OPENAI_API_KEY`
- `OPENAI_MODEL`

La clé OpenAI ne doit jamais être mise dans l'APK.

## Build local
```
cd android-web
npm install
npm run build
npx cap add android
npx cap sync android
npx cap open android
```

## GitHub Actions
Le workflow `.github/workflows/android-apk.yml` construit un APK debug installable et publie l'APK comme artifact GitHub Actions.
