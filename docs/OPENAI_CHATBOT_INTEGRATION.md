# Copilote BAC — intégration du chatbot OpenAI (V1)
## Statut
Cette branche ajoute un point d'entrée serveur `POST /api/chat` pour Vercel. Elle ne remplace pas les tuteurs existants et ne modifie pas l'interface actuelle.

## Configuration
Dans Vercel > Project > Settings > Environment Variables, ajouter `OPENAI_API_KEY` (secret). Optionnel : `OPENAI_MODEL=gpt-4.1-mini`. Ne jamais placer la clé dans le code client, le dépôt, ni dans une variable `VITE_*`.

## Exemple de requête
```js
const response = await fetch("/api/chat", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ message: "Explique 4^767 modulo 7", history: [] })
});
const { answer, error } = await response.json();
```

## Conditions avant activation publique
- Vérifier la compatibilité du routage Vercel et des règles de réécriture existantes.
- Ajouter authentification ou limitation de débit par utilisateur/IP, quotas et surveillance des coûts.
- Tester les réponses, les erreurs réseau et l'affichage mobile.
- Ajouter le composant de chat dans l'interface existante, après audit de ses fichiers.
- Prévoir consentement et protection des données des élèves.
- Pour les anciennes discussions : exporter, trier, anonymiser, puis indexer seulement les ressources pédagogiques autorisées (RAG). L'API n'accède pas automatiquement aux conversations ChatGPT.
- Conserver les fonctionnalités et le mode hors ligne actuels. L'API nécessite Internet.
