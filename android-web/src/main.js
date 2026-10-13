import './style.css';
const subjects=['Mathématiques','Physique','Chimie','SVT','Philosophie'];
const modes=['Expliquer le cours','Indice progressif','Corriger pas à pas','Quiz','Exercice similaire','Bac blanc'];
const root=document.getElementById('app');
root.innerHTML=`<header><h1>🎓 Copilote Bac S — Djibouti</h1><p>Révisions et exercices de Terminale S</p></header><main><section><h2>Choisir une matière</h2><div class="chips" id="subjects"></div><label for="mode">Activité</label><select id="mode"></select></section><section><h2>Assistant pédagogique</h2><p class="muted">L'IA nécessite Internet et un serveur configuré. Vérifiez les corrections avec vos cours.</p><label for="question">Votre question ou exercice</label><textarea id="question" placeholder="Exemple : explique les équations du second degré…"></textarea><label for="photo">Photo d'exercice (facultatif)</label><input id="photo" type="file" accept="image/jpeg,image/png" capture="environment"/><button id="ask">Demander une explication</button><p id="status" role="status" aria-live="polite"></p><div id="answer" class="answer"></div></section><section><h2>Documents officiels</h2><p><a target="_blank" rel="noopener noreferrer" href="https://cripen.dj/index.php/serie-s/">Annales Bac série S — CRIPEN</a></p><p><a target="_blank" rel="noopener noreferrer" href="https://cripen.dj/wp-content/uploads/2025/05/Programme-compile-Terminale.pdf">Programme de Terminale (PDF)</a></p></section></main><footer>Prototype Android PWA · Gemini via API sécurisée · Aucun sujet officiel n'est reproduit</footer>`;
let subject=subjects[0];
const subjectBox=document.getElementById('subjects');
subjects.forEach(s=>{const b=document.createElement('button');b.textContent=s;b.className=s===subject?'active':'';b.onclick=()=>{subject=s;[...subjectBox.children].forEach(x=>x.classList.toggle('active',x===b))};subjectBox.appendChild(b)});
const mode=document.getElementById('mode');modes.forEach(m=>{const opt=document.createElement('option');opt.value=m;opt.textContent=m;mode.appendChild(opt)});
const ask=document.getElementById('ask'),status=document.getElementById('status'),answer=document.getElementById('answer');
ask.onclick=async()=>{
 const question=document.getElementById('question').value.trim(),photo=document.getElementById('photo').files[0];
 if(!question){status.textContent='Écrivez une question avant de continuer.';return}
 if(photo&&(!['image/jpeg','image/png'].includes(photo.type)||photo.size>5*1024*1024)){status.textContent='Photo JPG/PNG de 5 Mo maximum.';return}
 ask.disabled=true;answer.textContent='';status.textContent='Connexion au serveur…';
 try{
  if(photo)throw Error('Analyse des photos pas encore activée. Saisissez le texte de l’exercice.');
  const body=JSON.stringify({subject,mode:mode.value,question});
  const apiUrl=import.meta.env.VITE_TUTOR_API_URL||'/api/tutor';
  const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),120000);
  let res;try{res=await fetch(apiUrl,{method:'POST',headers:{'Content-Type':'application/json'},body,signal:controller.signal})}finally{clearTimeout(timer)}
  const data=await res.json().catch(()=>({error:'Réponse du serveur illisible'}));
  if(!res.ok)throw Error(data.error||'Erreur serveur');
  answer.textContent=data.answer||'Aucune réponse';status.textContent='Réponse reçue.';
 }catch(e){status.textContent='Assistant indisponible : '+e.message;status.className='error'}finally{ask.disabled=false}
};
if('serviceWorker' in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('/sw.js').catch(()=>{}));
