const SYSTEM_PROMPT = `
Tu es Copilote Bac Terminale S Djibouti, un professeur particulier numérique.
Tu aides en Mathématiques, Physique, Chimie, SVT et Philosophie, au niveau Terminale S.
Priorité : documents fournis par l'élève, programme et ressources CRIPEN/MENFOP, puis connaissances générales.
Pour /photo-corrige : transcris fidèlement, marque [illisible] si nécessaire, identifie matière/chapitre/notion, extrais les données, explique la méthode, résous étape par étape, donne la réponse finale et vérifie.
Pour /analyse-cours : identifie matière, chapitre, notions, définitions, formules et éléments à comparer au programme.
Pour /fiche-revision, /flashcards, /carte-mentale, /quiz-cours, /exo-type-bac et /compare-programme : reste fidèle au contenu fourni et au niveau Terminale S.
Style : français simple, naturel, clair, pédagogique. Ne jamais inventer une donnée illisible.
`;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Méthode non autorisée." });
  }

  const apiUrl = process.env.TUTOR_API_URL || "https://api.groq.com/openai/v1/chat/completions";
  const apiKey = process.env.TUTOR_API_KEY;
  const model = process.env.TUTOR_MODEL;

  if (!apiKey || !model) {
    return res.status(500).json({
      error: "Configuration IA incomplète sur Vercel.",
      detail: "Ajoutez TUTOR_API_KEY et TUTOR_MODEL dans les variables d’environnement."
    });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
    const message = String(body.message || "").trim();
    const imageDataUrl = body.imageDataUrl ? String(body.imageDataUrl) : null;

    if (!message && !imageDataUrl) {
      return res.status(400).json({ error: "Ajoutez une question ou une photo." });
    }
    if (message.length > 12000) {
      return res.status(400).json({ error: "Le texte est trop long." });
    }
    if (imageDataUrl && imageDataUrl.length > 6_000_000) {
      return res.status(400).json({ error: "La photo est trop volumineuse. Utilisez une image plus légère." });
    }

    const userContent = imageDataUrl
      ? [
          { type: "text", text: message || "/photo-corrige — Corrige cet exercice." },
          { type: "image_url", image_url: { url: imageDataUrl } }
        ]
      : message;

    const upstream = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userContent }
        ],
        temperature: 0.2,
        max_tokens: 2200
      })
    });

    const data = await upstream.json().catch(() => ({}));

    if (!upstream.ok) {
      const providerMessage =
        data?.error?.message ||
        data?.message ||
        `Erreur du fournisseur IA (${upstream.status}).`;
      return res.status(upstream.status >= 500 ? 502 : upstream.status).json({
        error: providerMessage
      });
    }

    const answer =
      data?.choices?.[0]?.message?.content ||
      data?.output_text ||
      data?.response ||
      "";

    if (!answer) {
      return res.status(502).json({ error: "Le fournisseur IA n'a renvoyé aucune réponse exploitable." });
    }

    return res.status(200).json({ answer });
  } catch (error) {
    return res.status(500).json({
      error: "Erreur interne du Copilote.",
      detail: error instanceof Error ? error.message : String(error)
    });
  }
}
