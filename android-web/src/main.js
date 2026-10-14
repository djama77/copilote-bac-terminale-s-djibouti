import './style.css';

const subjects=['Mathématiques','Physique','Chimie','SVT','Philosophie'];
const modes=['Expliquer le cours','Indice progressif','Corriger pas à pas','Quiz','Exercice similaire','Bac blanc'];
const root=document.getElementById('app');

const enc=new TextEncoder();
async function sha256(value){
  const digest=await crypto.subtle.digest('SHA-256',enc.encode(value));
  return Array.from(new Uint8Array(digest)).map(b=>b.toString(16).padStart(2,'0')).join('');
}
const PIN_KEY='copilote_bac_pin_hash_v1';
const SESSION_KEY='copilote_bac_unlocked_v1';

async function unlockApp(){
  const saved=localStorage.getItem(PIN_KEY);
  root.innerHTML=`<main class="lock-screen"><section class="lock-card">
    <div class="lock-icon">🔐</div>
    <h1>Copilote Bac personnel</h1>
    <p class="muted">${saved?'Entrez votre code PIN pour ouvrir l’application.':'Première ouverture : créez votre code PIN personnel.'}</p>
    <label for="pin">Code PIN</label>
    <input id="pin" type="password" inputmode="numeric" autocomplete="off" maxlength="8" placeholder="4 à 8 chiffres"/>
    ${saved?'':'<label for="pin2">Confirmer le code PIN</label><input id="pin2" type="password" inputmode="numeric" autocomplete="off" maxlength="8" placeholder="Répétez le code"/>'}
    <button id="unlock">${saved?'Déverrouiller':'Créer mon code PIN'}</button>
    <p id="lockStatus" role="status" aria-live="polite"></p>
    <p class="tiny">Le PIN reste uniquement sur ce téléphone. En cas d’oubli, effacez les données de l’application puis recréez-le.</p>
  </section></main>`;

  document.getElementById('unlock').onclick=async()=>{
    const pin=document.getElementById('pin').value.trim();
    const status=document.getElementById('lockStatus');
    if(!/^\d{4,8}$/.test(pin)){status.textContent='Utilisez un code de 4 à 8 chiffres.';status.className='error';return;}
    const hash=await sha256(pin);
    if(!saved){
      const pin2=document.getElementById('pin2').value.trim();
      if(pin!==pin2){status.textContent='Les deux codes ne correspondent pas.';status.className='error';return;}
      localStorage.setItem(PIN_KEY,hash);
      sessionStorage.setItem(SESSION_KEY,'1');
      renderApp();
      return;
    }
    if(hash!==saved){status.textContent='Code PIN incorrect.';status.className='error';return;}
    sessionStorage.setItem(SESSION_KEY,'1');
    renderApp();
  };
}

function renderApp(){
  root.innerHTML=`<header>
    <div class="header-row"><div><h1>🎓 Copilote Bac S — Djibouti</h1><p>Mon assistant personnel de révision</p></div><button id="lockNow" class="small-button">🔒 Verrouiller</button></div>
  </header>
  <main>
    <section>
      <h2>Choisir une matière</h2>
      <div class="chips" id="subjects"></div>
      <label for="mode">Activité</label>
      <select id="mode"></select>
    </section>
    <section>
      <h2>Assistant pédagogique</h2>
      <p class="muted">Connexion Internet requise pour l’IA. Vérifiez les réponses avec vos cours et documents officiels.</p>
      <label for="question">Votre question ou exercice</label>
      <textarea id="question" placeholder="Exemple : explique les équations du second degré…"></textarea>
      <label for="photo">Photo d'exercice (facultatif)</label>
      <input id="photo" type="file" accept="image/jpeg,image/png" capture="environment"/>
      <button id="ask">Demander une explication</button>
      <p id="status" role="status" aria-live="polite"></p>
      <div id="answer" class="answer"></div>
    </section>
    <section>
      <h2>Documents officiels</h2>
      <p><a target="_blank" rel="noopener noreferrer" href="https://cripen.dj/index.php/serie-s/">Annales Bac série S — CRIPEN</a></p>
      <p><a target="_blank" rel="noopener noreferrer" href="https://cripen.dj/wp-content/uploads/2025/05/Programme-compile-Terminale.pdf">Programme de Terminale (PDF)</a></p>
    </section>
  </main>
  <footer>Version personnelle Android · PIN local · IA en ligne via API sécurisée</footer>`;

  let subject=subjects[0];
  const subjectBox=document.getElementById('subjects');
  subjects.forEach(s=>{
    const b=document.createElement('button');
    b.textContent=s;
    b.className=s===subject?'active':'';
    b.onclick=()=>{subject=s;[...subjectBox.children].forEach(x=>x.classList.toggle('active',x===b));};
    subjectBox.appendChild(b);
  });

  const mode=document.getElementById('mode');
  modes.forEach(m=>{const opt=document.createElement('option');opt.value=m;opt.textContent=m;mode.appendChild(opt);});

  document.getElementById('lockNow').onclick=()=>{
    sessionStorage.removeItem(SESSION_KEY);
    unlockApp();
  };

  const ask=document.getElementById('ask');
  const status=document.getElementById('status');
  const answer=document.getElementById('answer');

  ask.onclick=async()=>{
    const question=document.getElementById('question').value.trim();
    const photo=document.getElementById('photo').files[0];

    if(!question){status.textContent='Écrivez une question avant de continuer.';return;}
    if(photo&&(!['image/jpeg','image/png'].includes(photo.type)||photo.size>5*1024*1024)){status.textContent='Photo JPG/PNG de 5 Mo maximum.';return;}

    ask.disabled=true;
    answer.textContent='';
    status.className='';
    status.textContent='Connexion au serveur…';

    try{
      if(photo)throw Error('Analyse des photos pas encore activée. Saisissez le texte de l’exercice.');

      const body=JSON.stringify({subject,mode:mode.value,question});
      const apiUrl=import.meta.env.VITE_TUTOR_API_URL||'/api/tutor';
      const personalToken=import.meta.env.VITE_PERSONAL_APP_TOKEN||'';
      const headers={'Content-Type':'application/json'};
      if(personalToken)headers['X-App-Token']=personalToken;

      const controller=new AbortController();
      const timer=setTimeout(()=>controller.abort(),120000);
      let res;
      try{
        res=await fetch(apiUrl,{method:'POST',headers,body,signal:controller.signal});
      }finally{
        clearTimeout(timer);
      }

      const data=await res.json().catch(()=>({error:'Réponse du serveur illisible'}));
      if(!res.ok)throw Error(data.error||'Erreur serveur');
      answer.textContent=data.answer||'Aucune réponse';
      status.textContent='Réponse reçue.';
    }catch(e){
      status.textContent='Assistant indisponible : '+e.message;
      status.className='error';
    }finally{
      ask.disabled=false;
    }
  };
}

if(sessionStorage.getItem(SESSION_KEY)==='1')renderApp();else unlockApp();

if('serviceWorker' in navigator){
  window.addEventListener('load',()=>navigator.serviceWorker.register('/sw.js').catch(()=>{}));
}
