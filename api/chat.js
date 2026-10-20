// Vercel serverless endpoint. Set OPENAI_API_KEY in deployment settings.
const SYSTEM = "Tu es le Copilote BAC Terminale S Djibouti. Explique en français clair, étape par étape, les exercices de mathématiques, physique-chimie, SVT et philosophie. Vérifie les calculs. Ne prétends pas connaître des documents non fournis. Encourage l'apprentissage plutôt que la copie.";
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Méthode non autorisée" });
  if (!process.env.OPENAI_API_KEY) return res.status(503).json({ error: "Service IA non configuré" });
  const { message, history = [] } = req.body || {};
  if (typeof message !== "string" || !message.trim() || message.length > 4000)
    return res.status(400).json({ error: "Question invalide (max 4000 caractères)" });
  const safeHistory = Array.isArray(history) ? history.slice(-8).filter(x =>
    x && ["user","assistant"].includes(x.role) && typeof x.content === "string"
  ).map(x => ({ role: x.role, content: x.content.slice(0, 4000) })) : [];
  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
        instructions: SYSTEM,
        input: [...safeHistory, { role: "user", content: message.trim() }],
        max_output_tokens: 1200,
        store: false
      })
    });
    const data = await response.json();
    if (!response.ok) return res.status(502).json({ error: "Service IA temporairement indisponible" });
    const answer = (data.output || []).flatMap(item => item.content || [])
      .filter(part => part.type === "output_text").map(part => part.text).join("\n");
    return res.status(200).json({ answer: answer || "Aucune réponse reçue." });
  } catch {
    return res.status(502).json({ error: "Impossible de contacter le service IA" });
  }
}
