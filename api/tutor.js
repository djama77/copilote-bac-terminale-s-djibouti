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

const MAX_IMAGE_LENGTH = 5_500_000;
const MAX_PDF_LENGTH = 3_800_000;

function sendJson(res, status, payload) {
  res.status(status).setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  return res.end(JSON.stringify(payload));
}

function validDataUrl(value, prefix, maxLength) {
  return typeof value === "string" &&
    value.length <= maxLength &&
    value.startsWith(prefix) &&
    /^data:[\w.+-]+\/[\w.+-]+;base64,[A-Za-z0-9+/=\r\n]+$/.test(value);
}

function extractOutputText(data) {
  if (typeof data.output_text === "string" && data.output_text.trim()) return data.output_text.trim();
  const parts = [];
  for (const item of data.output || []) {
    if (item.type !== "message" || !Array.isArray(item.content)) continue;
    for (const part of item.content) {
      if (part.type === "output_text" && part.text) parts.push(part.text);
    }
  }
  return parts.join("\n").trim();
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return sendJson(res, 405, { error: "Méthode non autorisée." });
  }

  if (!process.env.OPENAI_API_KEY) {
    return sendJson(res, 503, { error: "Le service IA n'est pas configuré. Contactez l'administrateur." });
  }

  const body = req.body && typeof req.body === "object" ? req.body : {};
  const message = typeof body.message === "string" ? body.message.trim() : "";
  if (!message || message.length > 12000) {
    return sendJson(res, 400, { error: "Le message est obligatoire (12 000 caractères maximum)." });
  }

  const inputContent = [{ type: "input_text", text: message }];
  if (body.imageDataUrl) {
    if (!validDataUrl(body.imageDataUrl, "data:image/", MAX_IMAGE_LENGTH)) {
      return sendJson(res, 400, { error: "Image invalide ou trop volumineuse (4 Mo maximum)." });
    }
    inputContent.push({ type: "input_image", image_url: body.imageDataUrl, detail: "auto" });
  }
  if (body.pdfDataUrl) {
    if (!validDataUrl(body.pdfDataUrl, "data:application/pdf;", MAX_PDF_LENGTH)) {
      return sendJson(res, 400, { error: "PDF invalide ou trop volumineux (2,7 Mo maximum)." });
    }
    inputContent.push({
      type: "input_file",
      filename: "sujet-bac-djibouti.pdf",
      file_data: body.pdfDataUrl
    });
  }

  const model = process.env.OPENAI_MODEL || "gpt-4.1-mini";
  const payload = {
    model,
    instructions: SYSTEM_PROMPT,
    input: [{ role: "user", content: inputContent }],
    max_output_tokens: 2500
  };
  if (typeof body.conversationId === "string" && /^resp_[A-Za-z0-9_-]+$/.test(body.conversationId)) {
    payload.previous_response_id = body.conversationId;
  }

  try {
    const upstream = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
    const data = await upstream.json().catch(() => ({}));
    if (!upstream.ok) {
      const status = upstream.status === 429 ? 429 : 502;
      return sendJson(res, status, {
        error: upstream.status === 429
          ? "Le service IA est momentanément très sollicité. Réessayez dans un instant."
          : "Le service IA n'a pas pu traiter la demande. Réessayez plus tard."
      });
    }
    const answer = extractOutputText(data);
    if (!answer) return sendJson(res, 502, { error: "Le service IA n'a retourné aucune réponse exploitable." });
    return sendJson(res, 200, {
      answer,
      conversationId: data.id || null,
      model: data.model || model
    });
  } catch (error) {
    return sendJson(res, 502, { error: "Impossible de joindre le service IA. Vérifiez votre connexion Internet." });
  }
};
