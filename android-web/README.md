# Copilote Bac S Djibouti — Groq + Android

## Modèle commercial retenu
Achat unique envisagé de **500 FDJ** sur Google Play, sans abonnement. Le prix effectif et la disponibilité en FDJ doivent être confirmés dans Google Play Console. **Le prix n'est pas encodé dans l'APK** : il est défini dans Play Console.

## API d'IA
Backend : `api/tutor.js`, Groq API compatible OpenAI, modèle par défaut `openai/gpt-oss-20b`. Déployer Vercel avec root directory `android-web`. Définir la variable serveur **GROQ_API_KEY** (secret) et, si nécessaire, **GROQ_MODEL**. Ne jamais intégrer la clé dans l'APK ou le dépôt.

Configurer la variable GitHub Actions **TUTOR_API_URL** vers `https://votre-domaine.vercel.app/api/tutor`, puis reconstruire l'APK. Sans cette configuration, l'assistant de l'APK n'est pas connecté. La sélection photo existe mais l'OCR n'est pas activé.

## Sécurité et viabilité indispensables avant lancement public
**Attention : l'achat Play Store n'authentifie pas les requêtes envoyées à une API publique.** Le backend actuel est un prototype sans contrôle d'accès ni quotas persistants. Ne pas déployer l'API Groq publiquement tant qu'une authentification serveur, une vérification du droit d'accès et un quota mensuel par utilisateur n'ont pas été implémentés. Le quota cible proposé est 100 questions par mois, mais **il n'est pas encore appliqué**. Prévoir suivi des dépenses et alertes de budget.

## Publication Google Play
La compilation GitHub actuelle produit un **APK debug pour tests**, non publiable comme application payante. Pour Play Store, il faudra générer un **AAB release signé**, protéger le keystore dans les secrets GitHub, configurer Play Console (compte développeur, prix, fiche, politique de confidentialité, classification, conformité), puis tester sur des appareils réels. Ne pas publier automatiquement.

## Inspirations
- https://github.com/henryhale/android-capacitor
- https://github.com/Narottam04/action-capacitor-android
- https://github.com/towardsai/ai-tutor-app

Aucun code de ces dépôts n'a été copié directement.
