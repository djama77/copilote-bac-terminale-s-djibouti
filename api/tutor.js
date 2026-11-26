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

function parseDataUrl(value, allowedTypes) {
  if (typeof value !== "string") return null;
  const match = value.match(/^data:([\w.+-]+\/[\w.+-]+);base64,([A-Za-z0-9+/=\r\n]+)$/);
  if (!match || !allowedTypes.includes(match[1])) return null;
  return { mimeType: match[1], data: match[2].replace(/\s/g, "") };
}

function normalizeHistory(history, message, subject) {
  const turns = Array.isArray(history) ? history.slice(-12) : [];
  const contents = [];
  for (const turn of turns) {
    if (!turn || !["user", "assistant"].includes(turn.role) || typeof turn.text !== "string") continue;
    const text = turn.text.trim().slice(0, 12000);
    if (!text) continue;
    contents.push({
      role: turn.role === "assistant" ? "model" : "user",
      parts: [{ text }]
    });
  }

  if (contents[0] && contents[0].role === "model") contents.shift();
  const latest = contents[contents.length - 1];
  if (!latest || latest.role !== "user" || !latest.parts[0].text.includes(message)) {
    const prompt = [subject ? "Matière choisie : " + subject : "", message].filter(Boolean).join("\n\n");
    contents.push({ role: "user", parts: [{ text: prompt }] });
  } else if (subject && !latest.parts[0].text.startsWith("Matière choisie :")) {
    latest.parts[0].text = "Matière choisie : " + subject + "\n\n" + latest.parts[0].text;
  }
  return contents;
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

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return sendJson(res, 503, {
      error: "La clé GEMINI_API_KEY n'est pas encore configurée dans Vercel. Ajoutez-la dans les variables d'environnement du projet."
    });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
    const message = typeof body.message === "string" ? body.message.trim() : "";
    const subject = typeof body.subject === "string" ? body.subject.trim() : "";
    const imageData = body.imageDataUrl
      ? parseDataUrl(body.imageDataUrl, ["image/jpeg", "image/png", "image/webp", "image/gif"])
      : null;
    const pdfData = body.pdfDataUrl
      ? parseDataUrl(body.pdfDataUrl, ["application/pdf"])
      : null;

    if (!message && !body.imageDataUrl && !body.pdfDataUrl) {
      return sendJson(res, 400, { error: "Ajoutez une consigne, une photo ou un sujet PDF." });
    }
    if (body.imageDataUrl && !imageData) {
      return sendJson(res, 400, { error: "Format de photo non accepté. Utilisez JPG, PNG ou WEBP." });
    }
    if (body.pdfDataUrl && !pdfData) {
      return sendJson(res, 400, { error: "Le fichier joint doit être un PDF valide." });
    }

    const contents = normalizeHistory(body.history, message, subject);
    const current = contents[contents.length - 1];
    if (imageData) current.parts.push({ inlineData: imageData });
    if (pdfData) current.parts.push({ inlineData: pdfData });

    const model = process.env.GEMINI_MODEL || "gemini-3.1-flash-lite";
    const endpoint = "https://generativelanguage.googleapis.com/v1beta/models/" +
      encodeURIComponent(model) + ":generateContent";

    const upstream = await fetch(endpoint, {
      method: "POST",
      headers: {
        "x-goog-api-key": apiKey,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents,
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 5000
        }
      }),
      signal: AbortSignal.timeout(60000)
    });

    const data = await upstream.json().catch(() => ({}));
    if (!upstream.ok) {
      const apiMessage = data && data.error && data.error.message
        ? data.error.message
        : "Le service Gemini a refusé la requête.";
      console.error("Gemini API error:", upstream.status, apiMessage);
      const status = upstream.status === 429 ? 429 : (upstream.status === 400 ? 400 : 502);
      return sendJson(res, status, {
        error: "Erreur Gemini (" + upstream.status + ") : " + apiMessage
      });
    }

    const answer = (data.candidates || [])
      .flatMap(candidate => candidate.content && candidate.content.parts ? candidate.content.parts : [])
      .filter(part => typeof part.text === "string")
      .map(part => part.text)
      .join("\n")
      .trim();

    if (!answer) {
      const reason = data.promptFeedback && data.promptFeedback.blockReason
        ? "La demande a été bloquée : " + data.promptFeedback.blockReason
        : "Gemini a répondu sans texte exploitable. Réessayez.";
      console.error("Gemini response without text:", JSON.stringify(data).slice(0, 1200));
      return sendJson(res, 502, { error: reason });
    }

    return sendJson(res, 200, {
      answer,
      conversationId: null,
      model
    });
  } catch (error) {
    console.error("Copilote Gemini error:", error);
    const message = error && error.name === "TimeoutError"
      ? "Le délai de réponse est dépassé. Réessayez avec une photo plus légère ou une consigne plus courte."
      : "Erreur interne du serveur Copilote. Consultez les journaux Vercel pour le détail.";
    return sendJson(res, 500, { error: message });
  }
}
