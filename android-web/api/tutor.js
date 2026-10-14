// Server-side Groq tutoring for web + Capacitor Android.
// Configure GROQ_API_KEY in Vercel. Never expose it in the APK or repository.

const SUBJECTS=['Mathématiques','Physique','Chimie','SVT','Philosophie'];
const MODES=['Expliquer le cours','Indice progressif','Corriger pas à pas','Quiz','Exercice similaire','Bac blanc'];

function getAllowedOrigins(){
  const configured=(process.env.ALLOWED_ORIGINS||process.env.ALLOWED_ORIGIN||'')
    .split(',')
    .map(x=>x.trim())
    .filter(Boolean);
  return new Set(['https://localhost','capacitor://localhost',...configured]);
}

export default async function handler(req,res){
  res.setHeader('Cache-Control','no-store');

  const origin=req.headers.origin;
  const allowed=getAllowedOrigins();

  if(origin && allowed.has(origin)){
    res.setHeader('Access-Control-Allow-Origin',origin);
    res.setHeader('Vary','Origin');
  }
  res.setHeader('Access-Control-Allow-Methods','POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers','Content-Type');

  if(req.method==='OPTIONS'){
    if(origin && !allowed.has(origin))return res.status(403).end();
    return res.status(204).end();
  }

  if(req.method!=='POST')return res.status(405).json({error:'Méthode non autorisée'});
  if(origin && !allowed.has(origin))return res.status(403).json({error:'Origine non autorisée'});

  const key=process.env.GROQ_API_KEY;
  if(!key)return res.status(503).json({error:'Service non configuré : GROQ_API_KEY manquante sur le serveur.'});

  let body=req.body;
  if(typeof body==='string'){
    try{body=JSON.parse(body)}
    catch{return res.status(400).json({error:'JSON invalide'})}
  }

  const {subject,mode,question}=body||{};
  if(!SUBJECTS.includes(subject)||!MODES.includes(mode)||typeof question!=='string'||!question.trim()||question.length>4000){
    return res.status(400).json({error:'Question, matière ou activité invalide.'});
  }

  const instruction='Tu es un professeur de Terminale S à Djibouti. Réponds en français, avec des explications progressives, rigoureuses et adaptées au niveau Terminale S. Pour les mathématiques et sciences, montre les étapes utiles. Ne prétends pas citer un document CRIPEN que tu n’as pas consulté. Si une information est incertaine, indique-le. Aide à apprendre plutôt que donner une réponse sans explication.';
  const prompt=`Matière : ${subject}\nActivité : ${mode}\nQuestion : ${question.trim()}`;

  try{
    const model=process.env.GROQ_MODEL||'openai/gpt-oss-20b';
    const controller=new AbortController();
    const timeout=setTimeout(()=>controller.abort(),25000);

    let upstream;
    try{
      upstream=await fetch('https://api.groq.com/openai/v1/chat/completions',{
        method:'POST',
        headers:{
          'Content-Type':'application/json',
          'Authorization':`Bearer ${key}`
        },
        body:JSON.stringify({
          model,
          messages:[
            {role:'system',content:instruction},
            {role:'user',content:prompt}
          ],
          temperature:0.35,
          max_completion_tokens:1600
        }),
        signal:controller.signal
      });
    }finally{
      clearTimeout(timeout);
    }

    if(!upstream.ok){
      const detail=await upstream.text().catch(()=> '');
      console.error('Groq upstream error',upstream.status,detail.slice(0,500));
      return res.status(502).json({error:'Le fournisseur IA ne répond pas correctement. Vérifiez sa configuration et ses quotas.'});
    }

    const data=await upstream.json();
    const answer=(data.choices?.[0]?.message?.content||'').trim();
    if(!answer)return res.status(502).json({error:'Aucune réponse produite par le modèle.'});

    return res.status(200).json({answer,provider:'groq',model});
  }catch(err){
    console.error('Tutor API error',err);
    return res.status(502).json({error:'Service IA momentanément indisponible.'});
  }
}
