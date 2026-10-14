# Mon Copilote Bac — version personnelle Android

Cette branche transforme Copilote Bac en application Android personnelle.

## Ce qui est privé dans cette version

- verrou PIN obligatoire au démarrage ;
- PIN choisi au premier lancement et conservé uniquement sur le téléphone ;
- bouton **Verrouiller** dans l'application ;
- compilation APK uniquement par lancement manuel GitHub Actions ;
- artefact APK conservé 3 jours ;
- clé Groq uniquement côté serveur ;
- jeton personnel optionnel entre l'APK et l'API.

## Important : rendre le dépôt GitHub privé

Le dépôt est actuellement public. Avant d'ajouter un secret personnel ou de générer l'APK final :

1. GitHub > dépôt > **Settings**
2. **General**
3. descendre jusqu'à **Danger Zone**
4. **Change repository visibility**
5. choisir **Make private**
6. confirmer le nom du dépôt

Ne jamais écrire une clé Groq ou un jeton privé dans un fichier du dépôt.

## Configuration Internet / IA

### Vercel

Déployer le dossier `android-web` puis ajouter dans les variables d'environnement :

- `GROQ_API_KEY` : clé Groq ;
- `GROQ_MODEL` : facultatif, défaut `openai/gpt-oss-20b` ;
- `PERSONAL_APP_TOKEN` : chaîne longue et aléatoire, recommandée.

### GitHub

Dans **Settings > Secrets and variables > Actions** :

Variables :
- `TUTOR_API_URL` = URL complète de l'API, par exemple `https://votre-projet.vercel.app/api/tutor`

Secret :
- `PERSONAL_APP_TOKEN` = exactement la même valeur que dans Vercel.

## Générer l'APK personnel

1. ouvrir **Actions** ;
2. choisir **Personal Android APK** ;
3. **Run workflow** ;
4. choisir la branche `feature/personal-private-apk-v1` ;
5. lancer ;
6. après succès, télécharger l'artefact `copilote-bac-personnel-apk` ;
7. extraire `app-debug.apk` et l'installer sur le téléphone.

## Première ouverture

L'application demande de créer un PIN de 4 à 8 chiffres. Ce PIN n'est pas envoyé sur Internet.

Si le PIN est oublié : Android > Paramètres > Applications > Mon Copilote Bac > Stockage > Effacer les données, puis recréer le PIN.

## Limites actuelles

- la photo d'un exercice peut être sélectionnée mais n'est pas encore envoyée au modèle ;
- un APK debug est destiné à l'usage personnel/test, pas au Play Store ;
- un jeton intégré à un APK peut être extrait par une personne ayant le fichier APK : ne partagez pas l'APK.
