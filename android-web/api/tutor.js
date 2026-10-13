// Server-side Groq tutoring. Configure GROQ_API_KEY in Vercel, never in the app.
const SUBJECTS=['Mathématiques','Physique','Chimie','SVT','Philosophie'];
const MODES=['Expliquer le cours','Indice progressif','Corriger pas à pas','Quiz','Exercice similaire','Bac blanc'];
export default async function handler(req,res){
  res.setHeader('Cache-Control','no-store');
  const origin=process.env.ALLOWED_ORIGIN;
  if(origin){res.setHeader('Access-Control-Allow-Origin',origin);res.setHeader('Vary','Origin');res.setHeader('Access-Control-Allow-Methods','POST, OPTIONS');res.setHeader('Access-Control-Allow-Headers','Content-Type');}
  if(req.method==='OPTIONS')return res.status(204).end();
  if(req.method!=='POST')return res.status(405).json({error:'Méthode non autorisée'});
  if(origin && req.headers.origin && req.headers.origin!==origin)return res.status(403).json({error:'Origine non autorisée'});
  const key=process.env.GROQ_API_KEY;
  if(!key)return res.status(503).json({error:'Service non configuré : GROQ_API_KEY manquante sur le serveur.'});
  let body=req.body;
  if(typeof body==='string'){try{body=JSON.parse(body)}catch{return res.status(400).json({error:'JSON invalide'})}}
  const {subject,mode,question}=body||{};
  if(!SUBJECTS.includes(subject)||!MODES.includes(mode)||typeof question!=='string'||!question.trim()||question.length>4000)return res.status(400).json({error:'Question, matière ou activité invalide.'});
  const instruction='Tu es un professeur de Terminale S à Djibouti. Réponds uniquement en français, avec des explications progressives et rigoureuses. Pour les mathématiques, montre les étapes de calcul. Ne prétends pas citer un document CRIPEN que tu n’as pas consulté. Si tu ignores une réponse, dis-le. Aide à apprendre plutôt que donner directement la réponse.';
  const prompt=`Matière : ${subject}\nActivité : ${mode}\nQuestion de l'élève : ${question.trim()}`;
  try{
    const model=process.env.GROQ_MODEL||'openai/gpt-oss-20b';
    const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),25000);
    let upstream;
    try{upstream=await fetch('https://api.groq.com/openai/v1/chat/completions',{
      method:'POST',headers:{'Content-Type':'application/json','Authorization':`Bearer ${key}`},
      body:JSON.stringify({model,messages:[{role:'system',content:instruction},{role:'user',content:prompt}],temperature:0.35,max_completion_tokens:1600}),signal:controller.signal
    })}finally{clearTimeout(timeout)}
    if(!upstream.ok)return res.status(502).json({error:'Le fournisseur IA ne répond pas correctement. Vérifiez sa configuration et ses quotas.'});
    const data=await upstream.json();
    const answer=(data.choices?.[0]?.message?.content||'').trim();
    if(!answer)return res.status(502).json({error:'Aucune réponse produite par le modèle.'});
    return res.status(200).json({answer,provider:'groq'});
  }catch{return res.status(502).json({error:'Service IA momentanément indisponible.'})}
}
