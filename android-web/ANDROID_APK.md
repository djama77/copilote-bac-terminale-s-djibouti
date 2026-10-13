# Android APK — Copilote Bac S Djibouti

Branche de préparation : `feature/android-capacitor-apk-v1`. La branche `main` n'est pas modifiée.

## Construction automatique (sans PC)
1. Ouvrir GitHub → dépôt → Actions → **Android APK (Capacitor)**.
2. Ouvrir la dernière exécution réussie, ou cliquer **Run workflow** en choisissant `feature/android-capacitor-apk-v1`.
3. Dans **Artifacts**, télécharger `copilote-bac-s-djibouti-debug-apk`.
4. Extraire le ZIP sur Android puis installer `app-debug.apk` (autoriser temporairement l'installation depuis cette source si demandé).

## Construction locale
Prérequis : Node.js 20, JDK 17, Android SDK, connexion Internet pour les dépendances.

```bash
cd android-web
npm install
npm run android:add
cd android
./gradlew assembleDebug
```

Le fichier sera dans `android-web/android/app/build/outputs/apk/debug/app-debug.apk`.
Pour synchroniser après une modification web : `npm run android:sync`.

## Limites et sécurité
- APK **debug** uniquement, non destiné au Play Store.
- L'application affiche l'interface web embarquée ; le point d'accès `/api/tutor` est encore un placeholder HTTP 501. Sans backend HTTPS réel, le tutorat Qwen3, l'OCR et les réponses IA ne fonctionnent pas.
- Les chemins `/api/...` relatifs ne pointent pas vers Vercel dans un APK : prévoir une URL HTTPS absolue et un backend protégé avant la production.
- Ne pas placer de clé API dans l'APK ni dans les sources publiques.
- Le projet Android natif est généré à chaque exécution CI ; une personnalisation native future nécessitera de versionner le dossier `android/`.
