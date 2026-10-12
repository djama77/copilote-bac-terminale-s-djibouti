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
- Import PDF contenant du texte et TXT (5 Mo maximum, 30 premières pages, 12 000 caractères). Pas d'OCR pour photos ou PDF scannés, ni de moteur de vérification mathématique à ce stade.
- Les documents sont traités en mémoire pour la session et envoyés à l'instance Ollama configurée.
- Les réponses peuvent être erronées : vérifier avec les ressources officielles.
- Aucun fichier de poids de modèle inclus.
- Adresse locale par défaut : 127.0.0.1:11434. Éviter une adresse externe pour les données privées.

## Recherche documentaire V2
- Importer plusieurs PDF texte ou TXT, jusqu'à 5 Mo par fichier.
- Extraction des 80 premières pages par PDF (plafond 200 000 caractères par document).
- Recherche locale simple par mots-clés, jusqu'à quatre extraits pertinents par question.
- Affichage du nom du fichier et du numéro de page dans l'interface et dans le contexte envoyé à Qwen3.
- Les références de page sont des aides de navigation : vérifier le document original. L'IA peut produire des citations erronées.
- Aucune OCR et aucun index persistant à ce stade. Les fichiers doivent être réimportés à chaque session.

## Correction des photos (OCR expérimentale)
1. Installer **Tesseract OCR pour Windows** (moteur natif séparé de Python) et sélectionner la langue française lors de l'installation. Site du projet : https://github.com/tesseract-ocr/tesseract
2. Vérifier dans PowerShell : `tesseract --version` puis `tesseract --list-langs` (doit afficher `fra` et `eng`).
3. Redémarrer le terminal après installation pour actualiser le PATH. Si nécessaire, définir la variable d'environnement `TESSDATA_PREFIX` vers le dossier tessdata approprié.
4. Lancer `lancer_windows.bat`, importer une photo JPG/PNG (8 Mo maximum), vérifier le texte reconnu, puis demander une correction.

**Attention :** la transcription de formules mathématiques et de manuscrits peut être erronée. Ne pas se fier à la correction sans vérifier l'énoncé et les calculs. Aucune photographie n'est conservée par le code applicatif après la session; les mécanismes de stockage de Streamlit et du système hôte restent à considérer.
