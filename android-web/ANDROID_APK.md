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


## Inspirations open source et améliorations

- [henryhale/android-capacitor](https://github.com/henryhale/android-capacitor) : génération APK via GitHub Actions et distribution de versions. Nous conservons les **Artifacts** pour le moment ; aucune publication automatique de Release.
- [henryhale/android-capacitor-demo](https://github.com/henryhale/android-capacitor-demo) : modèle Vanilla JS + Vite et Capacitor, proche de cette application.
- [Narottam04/action-capacitor-android](https://github.com/Narottam04/action-capacitor-android) : modèle pour futurs builds signés. **Non activé** car la signature de production requiert un keystore secret.

### Vérification d'intégrité
Le workflow vérifie que `app-debug.apk` est non vide et inclut `SHA256SUMS.txt` dans le ZIP de téléchargement. Ce contrôle confirme l'intégrité des octets téléchargés, pas la sécurité ni le fonctionnement de toutes les fonctions de l'application.

### Prochaines étapes
1. Installer et ouvrir l'APK debug sur un téléphone Android.
2. Tester les matières, navigation, formulaires et sélection de photos.
3. Ajouter une API HTTPS réelle pour Qwen3 et l'OCR ; l'API relative `/api/tutor` ne fonctionne pas automatiquement dans l'APK.
4. Préparer une icône 1024×1024 et des captures d'écran originales.
5. Plus tard, configurer une signature de production et éventuellement les GitHub Releases ; ne jamais publier un keystore ou des clés API.
