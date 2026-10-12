// Vercel serverless: requires OLLAMA_API_URL and optional OLLAMA_API_KEY.
// The remote server must expose an HTTPS Ollama-compatible /api/chat endpoint.
// Never use a local 127.0.0.1 Ollama URL from Vercel.
export const config={api:{bodyParser:false}};
export default async function handler(req,res){
 if(req.method!=='POST')return res.status(405).json({error:'Méthode non autorisée'});
 return res.status(501).json({error:"Le service IA n'est pas encore configuré. Déployer une API sécurisée compatible avant activation."});
}
