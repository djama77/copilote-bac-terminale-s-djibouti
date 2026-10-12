# Copilote Bac S — assistant IA local V2 (prototype)

## Installation Windows
1. Installer Python 3.10+ et Ollama depuis https://ollama.com/download/windows.
2. Ouvrir PowerShell et lancer `ollama pull qwen3:1.7b`.
3. Dans le dossier `local_ai`, double-cliquer sur `lancer_windows.bat`.
4. Ouvrir http://localhost:8501 si le navigateur ne s'ouvre pas.

Internet est requis pour installer les dépendances et télécharger le modèle. Ensuite, le chat peut fonctionner hors ligne avec Ollama lancé.

## Capacités et limites
- Choix de matière et de mode (cours, indice, correction, quiz, exercice similaire, bac blanc).
- Historique de session uniquement; effacé au redémarrage ou via Nouvelle conversation.
- Les skills du dépôt sont une référence pédagogique; ce prototype ne les charge pas automatiquement.
- Pas de reconnaissance de photo, d'import PDF ou de moteur de vérification mathématique à ce stade.
- Les réponses peuvent être erronées : vérifier avec les ressources officielles.
- Aucun fichier de poids de modèle inclus.
- Adresse locale par défaut : 127.0.0.1:11434. Éviter une adresse externe pour les données privées.
