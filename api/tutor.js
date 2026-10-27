const SYSTEM_PROMPT = `
Tu es Copilote Bac Terminale S Djibouti, un professeur particulier numérique pour Deksan.
Tu aides en Mathématiques, Physique, Chimie, SVT, Philosophie et Anglais, au niveau lycée.
Priorité : documents fournis par l'élève, programme et ressources CRIPEN/MENFOP, puis connaissances générales.
Pour /photo-corrige et /corrige-annale : transcris fidèlement le sujet, marque [illisible] si nécessaire, identifie matière/chapitre/notion, extrais les données, explique la méthode, résous chaque question étape par étape, donne la réponse finale et vérifie les calculs. Pour une annale sans corrigé officiel, produis un corrigé pédagogique original, sans prétendre qu’il est officiel. Ne saute aucune question visible ; si le sujet est long, annonce clairement les parties traitées et poursuis sur demande. Ne devine jamais un énoncé, un graphique, une valeur ou un symbole illisible : signale précisément ce qui manque.
Pour /analyse-cours : identifie matière, chapitre, notions, définitions, formules et éléments à comparer au programme.
Pour /fiche-revision, /flashcards, /carte-mentale, /quiz-cours, /exo-type-bac et /compare-programme : reste fidèle au contenu fourni et au niveau Terminale S.
Maths : données -> propriété/formule -> calcul -> justification -> conclusion -> vérification.
Physique : données -> grandeur cherchée -> loi -> formule littérale -> unités -> conversion -> calcul -> résultat -> interprétation.
Chimie : espèces -> transformation -> équation -> quantités -> calcul -> résultat -> interprétation.
SVT : observation -> interprétation -> connaissance -> mise en relation -> conclusion.
Philosophie : niveau lycée, vocabulaire simple, connecteurs logiques et structure claire.
Style : français simple, naturel, clair et pédagogique. Ne jamais inventer une donnée illisible.
`;

function setCors(req, res) {
  const origin = req.headers.origin;
  const allowed = new Set([
    "https://localhost",
    "http://localhost",
    "capacitor://localhost"
  ]);
  if (origin && allowed.has(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  }
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
}

function validateImageDataUrl(value) {
  return typeof value === "string" && /^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(value);
}

async function openai(path, apiKey, body) {
  const response = await fetch(`https://api.openai.com/v1/${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify(body)
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = data?.error?.message || `Erreur OpenAI (${response.status}).`;
    const err = new Error(message);
    err.status = response.status;
    throw err;
  }
  return data;
}

function extractOpenAIText(data) {
  if (typeof data?.output_text === "string" && data.output_text.trim()) return data.output_text.trim();
  const chunks = [];
  for (const item of data?.output || []) {
    for (const part of item?.content || []) {
      if (part?.type === "output_text" && typeof part.text === "string") chunks.push(part.text);
    }
  }
  return chunks.join("\n").trim();
}

function resolveProvider() {
  if (!process.env.OPENAI_API_KEY) return null;
  return {
    apiKey: process.env.OPENAI_API_KEY,
    model: process.env.OPENAI_MODEL || "gpt-4.1-mini"
  };
}

export default async function handler(req, res) {
  setCors(req, res);

  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST, OPTIONS");
    return res.status(405).json({ error: "Méthode non autorisée." });
  }

  const providerConfig = resolveProvider();
  if (!providerConfig) {
    return res.status(500).json({
      error: "Configuration IA incomplète.",
      detail: "Ajoutez OPENAI_API_KEY dans les variables d'environnement du serveur Vercel."
    });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
    const message = String(body.message || "").trim();
    const imageDataUrl = body.imageDataUrl ? String(body.imageDataUrl) : null;
    let conversationId = body.conversationId ? String(body.conversationId) : null;

    if (!message && !imageDataUrl) {
      return res.status(400).json({ error: "Ajoutez une question ou une photo." });
    }
    if (message.length > 12000) {
      return res.status(400).json({ error: "Le texte est trop long." });
    }
    if (imageDataUrl && imageDataUrl.length > 6_000_000) {
      return res.status(400).json({ error: "La photo est trop volumineuse. Utilisez une image plus légère." });
    }
    if (imageDataUrl && !validateImageDataUrl(imageDataUrl)) {
      return res.status(400).json({ error: "Format de photo non accepté." });
    }

    if (!conversationId) {
      const conversation = await openai("conversations", providerConfig.apiKey, {});
      conversationId = conversation.id;
    }

    const content = [
      { type: "input_text", text: message || "/photo-corrige — Corrige cet exercice étape par étape." }
    ];
    if (imageDataUrl) {
      content.push({ type: "input_image", image_url: imageDataUrl, detail: "auto" });
    }

    const data = await openai("responses", providerConfig.apiKey, {
      model: providerConfig.model,
      conversation: conversationId,
      instructions: SYSTEM_PROMPT,
      input: [{ role: "user", content }]
    });

    const answer = extractOpenAIText(data);
    if (!answer) {
      return res.status(502).json({ error: "OpenAI n'a renvoyé aucune réponse exploitable." });
    }

    return res.status(200).json({
      answer,
      conversationId,
      responseId: data.id,
      provider: "openai",
      model: providerConfig.model
    });
  } catch (error) {
    const status = Number(error?.status) || 500;
    return res.status(status >= 500 ? 502 : status).json({
      error: error instanceof Error ? error.message : "Erreur interne du Copilote."
    });
  }
}
