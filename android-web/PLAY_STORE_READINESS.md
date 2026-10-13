# Contrôle avant publication Google Play — Copilote Bac S Djibouti

## État vérifié
- APK debug compilé sur GitHub Actions ; test sur appareil non encore réalisé.
- Groq GPT-OSS 20B branché dans le code du serveur, mais **non testé en production** sans clé API.
- L'APK a besoin de la variable publique GitHub Actions `TUTOR_API_URL` pour joindre le backend HTTPS.
- Le workflow produit également un **AAB release non signé** pour inspection ; il est **impropre à la publication**.
- Prix visé : **500 FDJ, achat unique** ; le prix réel se configure dans Google Play Console.

## Blocages obligatoires
1. Authentification par utilisateur avec validation serveur du droit d'accès à l'application (un APK copié n'est pas une preuve d'achat).
2. Vérification des achats via l'API Google Play Developer / Play Integrity, avec traitement approprié des achats et remboursements. Ne pas se fier à une simple valeur envoyée par le client.
3. Quota **persistant** par compte (objectif initial : 100 requêtes IA/mois), stockage transactionnel et limitation anti-abus. Le quota n'existe pas encore.
4. Budget et alertes sur la consommation Groq ; ne pas exposer l'API avant ces protections.
5. Signature release AAB avec keystore sécurisé et Play App Signing, sans jamais enregistrer les secrets dans GitHub.
6. Déclaration de confidentialité, fiches Play Store, classification du contenu, conformité aux règles Google Play, et vérification du prix local.

## Procédure sur Android pour télécharger l'APK de test
1. Ouvrir la dernière exécution réussie du workflow GitHub Actions.
2. Sous **Artifacts**, télécharger `copilote-bac-s-djibouti-debug-apk`.
3. Extraire le ZIP et installer `app-debug.apk` sur un appareil de test.
4. Tester navigation, matières et quiz ; les réponses IA nécessitent une API configurée.
5. Ne pas publier le fichier APK debug ni l'AAB non signé sur Google Play.

## Architecture cible
Android Capacitor → API HTTPS Vercel → authentification + vérification des droits → quota PostgreSQL → Groq.
