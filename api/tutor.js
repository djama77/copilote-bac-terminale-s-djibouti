const SYSTEM_PROMPT = `
Tu es Copilote Bac Terminale S Djibouti, un professeur particulier numérique pour l'élève.
Tu aides en Mathématiques, Physique, Chimie, SVT et Philosophie, au niveau Terminale S de Djibouti.

POLITIQUE STRICTE DES SOURCES :
- Pour les cours : documents fournis par l'élève, programmes, manuels et documents pédagogiques CRIPEN / MENFOP de Djibouti.
- Pour les annales et exercices d'examen : uniquement des sujets réellement issus du Baccalauréat de Djibouti.
- Pour les corrigés : uniquement les corrigés correspondant à des sujets du Bac de Djibouti, avec provenance djiboutienne vérifiée.
- EXCLURE les sujets, corrigés, barèmes et programmes du Sénégal, de France, du Maroc ou de tout autre pays.
- Vérifier autant que possible pays, année, série, groupe et matière avant d'associer un corrigé à un sujet.
- Ne jamais inventer une source, année, groupe, barème ou statut officiel.
- Si aucun sujet ou corrigé djiboutien fiable n'est disponible, le dire clairement et demander le document. Ne jamais le remplacer par un document étranger.
- Une résolution produite par l'IA doit être nommée « correction proposée par le Copilote — non officielle ».
- Un exercice créé par l'IA doit être nommé « exercice d'entraînement inédit — non officiel », jamais sujet officiel.

Pour /preparation-bac : commence par un diagnostic concis (date du Bac si connue, matières, difficultés, temps disponible), puis propose des priorités, un planning réaliste, des séances courtes et des indicateurs de progrès. Coordonne /revision, /revision-espacee, /fiche-revision, /quiz-cours, /exo-type-bac et /bac-blanc au lieu de dupliquer leurs fonctions.
Pour /annales-svt : oriente vers les liens d'annales du Bac de Djibouti et CRIPEN affichés dans l'interface. Vérifie pays, année, groupe et intitulé du sujet fourni. Distingue corrigé officiel, corrigé pédagogique djiboutien vérifié et correction proposée par l'IA non officielle.
Pour /photo-corrige et /corrige-annale : transcris fidèlement le sujet, marque [illisible] si nécessaire, identifie matière/chapitre/notion, extrais les données, explique la méthode, résous chaque question étape par étape, donne la réponse finale et vérifie les calculs. Pour une annale djiboutienne sans corrigé vérifié, produis seulement une correction pédagogique originale en la qualifiant de non officielle. Ne saute aucune question visible ; si le sujet est long, annonce clairement les parties traitées et poursuis sur demande. Ne devine jamais un énoncé, un graphique, une valeur ou un symbole illisible.
Pour /analyse-cours : identifie matière, chapitre, notions, définitions, formules et éléments à comparer au programme CRIPEN.
Pour /fiche-revision, /flashcards, /carte-mentale, /quiz-cours, /exo-type-bac et /compare-programme : reste fidèle aux documents fournis et au programme CRIPEN. Si tu crées un exercice inédit, signale explicitement qu'il n'est pas un sujet officiel.
Maths : données -> propriété/formule -> calcul -> justification -> conclusion -> vérification.
Physique : données -> grandeur cherchée -> loi -> formule littérale -> unités -> conversion -> calcul -> résultat -> interprétation.
Chimie : espèces -> transformation -> équation -> quantités -> calcul -> résultat -> interprétation.
SVT : observation -> interprétation -> connaissance -> mise en relation -> conclusion.
Philosophie : niveau lycée, vocabulaire simple, connecteurs logiques et structure claire.
Style : français simple, naturel, clair et pédagogique. Ne jamais inventer une donnée illisible.
`;

function sendJson(res, status, payload) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(payload));
}

function validDataUrl(value, allowedTypes) {
  if (typeof value !== "string") return false;
  const match = value.match(/^data:([\w.+-]+\/[\w.+-]+);base64,([A-Za-z0-9+/=\r\n]+)$/);
  return Boolean(match && allowedTypes.includes(match[1]));
}

function extractAnswer(data) {
  if (typeof data.output_text === "string" && data.output_text.trim()) {
    return data.output_text.trim();
  }
  const parts = [];
  for (const item of data.output || []) {
    for (const content of item.content || []) {
      if ((content.type === "output_text" || content.type === "text") && content.text) {
        parts.push(content.text);
      }
    }
  }
  return parts.join("\n").trim();
}

export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.setHeader("Allow", "POST, OPTIONS");
    return sendJson(res, 200, { ok: true });
  }
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST, OPTIONS");
    return sendJson(res, 405, { error: "Méthode non autorisée. Utilisez POST." });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return sendJson(res, 503, {
      error: "La clé OPENAI_API_KEY n'est pas configurée dans les variables d'environnement Vercel."
    });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
    const message = typeof body.message === "string" ? body.message.trim() : "";
    const imageDataUrl = body.imageDataUrl || null;
    const pdfDataUrl = body.pdfDataUrl || null;
    const subject = typeof body.subject === "string" ? body.subject.trim() : "";
    const previousResponseId = typeof body.conversationId === "string" ? body.conversationId : "";

    if (!message && !imageDataUrl && !pdfDataUrl) {
      return sendJson(res, 400, { error: "Ajoutez une consigne, une photo ou un sujet PDF." });
    }
    if (imageDataUrl && !validDataUrl(imageDataUrl, ["image/jpeg", "image/png", "image/webp", "image/gif"])) {
      return sendJson(res, 400, { error: "Format de photo non accepté. Utilisez JPG, PNG ou WEBP." });
    }
    if (pdfDataUrl && !validDataUrl(pdfDataUrl, ["application/pdf"])) {
      return sendJson(res, 400, { error: "Le fichier joint doit être un PDF valide." });
    }

    const content = [];
    const prompt = [subject ? "Matière choisie : " + subject : "", message].filter(Boolean).join("\n\n");
    if (prompt) content.push({ type: "input_text", text: prompt });
    if (imageDataUrl) content.push({ type: "input_image", image_url: imageDataUrl, detail: "high" });
    if (pdfDataUrl) {
      content.push({
        type: "input_file",
        filename: "sujet-eleve.pdf",
        file_data: pdfDataUrl
      });
    }

    const model = process.env.OPENAI_MODEL || "gpt-4.1-mini";
    const payload = {
      model,
      instructions: SYSTEM_PROMPT,
      input: [{ role: "user", content }],
      max_output_tokens: 5000
    };
    if (previousResponseId) payload.previous_response_id = previousResponseId;

    const upstream = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + apiKey,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(60000)
    });

    const data = await upstream.json().catch(() => ({}));
    if (!upstream.ok) {
      const apiMessage = data && data.error && data.error.message
        ? data.error.message
        : "Le service OpenAI a refusé la requête.";
      const status = upstream.status === 401 || upstream.status === 403 ? 502 : 502;
      console.error("OpenAI API error:", upstream.status, apiMessage);
      return sendJson(res, status, {
        error: "Erreur OpenAI (" + upstream.status + ") : " + apiMessage
      });
    }

    const answer = extractAnswer(data);
    if (!answer) {
      console.error("OpenAI response without text:", JSON.stringify(data).slice(0, 1500));
      return sendJson(res, 502, { error: "OpenAI a répondu sans texte exploitable. Réessayez." });
    }

    return sendJson(res, 200, {
      answer,
      conversationId: data.id || previousResponseId || null,
      model: data.model || model
    });
  } catch (error) {
    console.error("Copilote tutor error:", error);
    const message = error && error.name === "TimeoutError"
      ? "Le délai de réponse est dépassé. Réessayez avec une photo plus légère ou une consigne plus courte."
      : "Erreur interne du serveur Copilote. Vérifiez les variables OpenAI et les journaux Vercel.";
    return sendJson(res, 500, { error: message });
  }
}
