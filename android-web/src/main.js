import './style.css';

const API_URL=import.meta.env.VITE_TUTOR_API_URL||'';
const subjects=['Mathématiques','Physique','Chimie','SVT','Philosophie','Anglais','Arabe'];
const modes=[
  ['/cours','Expliquer le cours'],
  ['/indice','Indice progressif'],
  ['/photo-corrige','Corriger une photo'],
  ['/quiz-cours','Quiz'],
  ['/fiche-revision','Fiche de révision'],
  ['/exo-type-bac','Exercice type Bac']
];

let subject='Mathématiques';
let conversationId=localStorage.getItem('copiloteConversationId')||null;
let messages=JSON.parse(localStorage.getItem('copiloteMessages')||'[]');
const root=document.getElementById('app');

function save(){
  localStorage.setItem('copiloteMessages',JSON.stringify(messages.slice(-40)));
  if(conversationId)localStorage.setItem('copiloteConversationId',conversationId);
}
function fileToDataUrl(file){
  return new Promise((ok,no)=>{const r=new FileReader();r.onload=()=>ok(r.result);r.onerror=no;r.readAsDataURL(file)});
}
function render(){
  root.innerHTML=`
  <main class="app">
    <header class="hero"><div><small>TERMINALE S · DJIBOUTI</small><h1>Copilote Bac</h1><p>Assistant ChatGPT de Deksan</p></div><span>🎓</span></header>

    <section class="card">
      <h2>Matières</h2>
      <div class="chips">${subjects.map(s=>`<button class="${s===subject?'active':''}" data-subject="${s}">${s}</button>`).join('')}</div>
    </section>

    <section class="card">
      <h2>Outils</h2>
      <div class="grid">${modes.map(([cmd,label])=>`<button class="tool" data-command="${cmd}">${label}</button>`).join('')}</div>
    </section>

    <section class="card chat">
      <div class="chat-head"><h2>Chat</h2><button id="newChat" class="secondary">Nouvelle conversation</button></div>
      <div id="history" class="history">${messages.map(m=>`<div class="bubble ${m.role}"><strong>${m.role==='user'?'Deksan':'Copilote'}</strong><p></p></div>`).join('')}</div>
      <textarea id="prompt" placeholder="Pose ta question ou choisis un outil…"></textarea>
      <label class="photo">📷 Ajouter une photo<input id="photo" type="file" accept="image/*" capture="environment"></label>
      <div class="send-row"><span id="status">${API_URL?'Prêt':'URL API à configurer'}</span><button id="send">Envoyer</button></div>
    </section>
  </main>`;

  document.querySelectorAll('.bubble p').forEach((p,i)=>p.textContent=messages[i].text);
  const history=document.getElementById('history'); history.scrollTop=history.scrollHeight;

  document.querySelectorAll('[data-subject]').forEach(b=>b.onclick=()=>{subject=b.dataset.subject;render()});
  document.querySelectorAll('[data-command]').forEach(b=>b.onclick=()=>{document.getElementById('prompt').value=`${b.dataset.command} — ${subject} — `;document.getElementById('prompt').focus()});
  document.getElementById('newChat').onclick=()=>{conversationId=null;messages=[];localStorage.removeItem('copiloteConversationId');localStorage.removeItem('copiloteMessages');render()};

  document.getElementById('send').onclick=async()=>{
    const prompt=document.getElementById('prompt');
    const file=document.getElementById('photo').files?.[0];
    const text=prompt.value.trim()||(file?'/photo-corrige — Corrige cet exercice étape par étape.':'');
    if(!text)return;
    if(!API_URL){document.getElementById('status').textContent='Configurer VITE_TUTOR_API_URL';return}
    if(file&&file.size>4_000_000){document.getElementById('status').textContent='Photo trop volumineuse (max 4 Mo)';return}

    messages.push({role:'user',text});save();render();
    document.getElementById('status').textContent='ChatGPT réfléchit…';
    document.getElementById('send').disabled=true;

    try{
      const imageDataUrl=file?await fileToDataUrl(file):null;
      const res=await fetch(API_URL,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:text,imageDataUrl,subject,conversationId})});
      const data=await res.json().catch(()=>({}));
      if(!res.ok)throw new Error(data.error||'Erreur du serveur');
      conversationId=data.conversationId||conversationId;
      messages.push({role:'assistant',text:data.answer||'Aucune réponse.'});
      save();render();
    }catch(e){
      messages.push({role:'assistant',text:'Erreur : '+e.message});save();render();
    }
  };
}
render();