import './style.css';

const subjects=[
  {name:'Mathématiques',icon:'🧮',className:'math',subtitle:'Cours • Exercices'},
  {name:'Physique',icon:'⚛️',className:'physics',subtitle:'Cours • Exercices'},
  {name:'Chimie',icon:'🧪',className:'chemistry',subtitle:'Cours • Exercices'},
  {name:'SVT',icon:'🌿',className:'svt',subtitle:'Cours • Exercices'},
  {name:'Philosophie',icon:'🧠',className:'philo',subtitle:'Cours • Sujets • Méthodes'}
];

const modes=[
  {name:'Expliquer le cours',icon:'📖',className:'blue',desc:'Obtenir une explication simple et claire'},
  {name:'Indice progressif',icon:'🧩',className:'orange',desc:'Recevoir des indices étape par étape'},
  {name:'Corriger pas à pas',icon:'⚙️',className:'green',desc:'Solution détaillée et expliquée'},
  {name:'Quiz',icon:'❓',className:'purple',desc:'Tester mes connaissances'},
  {name:'Exercice similaire',icon:'📝',className:'pink',desc:'Générer un nouvel exercice du même type'},
  {name:'Bac blanc',icon:'📊',className:'gold',desc:'Sujets complets en conditions d’examen'}
];

const root=document.getElementById('app');
let currentSubject='Mathématiques';
let currentMode='Expliquer le cours';

function navItem(icon,label,active=false){
  return `<button class="nav-item ${active?'active':''}" data-nav="${label}">
    <span>${icon}</span><small>${label}</small>
  </button>`;
}

function renderHome(){
  root.innerHTML=`
  <div class="app-shell">
    <header class="hero">
      <div class="hero-copy">
        <div class="brand-line"><span class="cap">🎓</span><h1>Copilote <strong>Bac S</strong> — Djibouti</h1></div>
        <p>Révisions, exercices et assistant pédagogique</p>
        <div class="hero-tag">Ton allié vers la réussite au Bac S !</div>
      </div>
      <img src="/books-hero.svg" alt="Livres de révision Bac S" class="hero-art"/>
    </header>

    <main class="home-content">
      <section class="panel">
        <div class="section-head"><div><span class="section-icon">▦</span><h2>Mes matières</h2></div><span class="linkish">Voir tout →</span></div>
        <div class="subject-grid">
          ${subjects.map((s,i)=>`<button class="subject-card ${s.className} ${i===4?'wide':''}" data-subject="${s.name}">
            <span class="subject-icon">${s.icon}</span>
            <div class="subject-text"><strong>${s.name}</strong><small>${s.subtitle}</small></div>
            <span class="subject-arrow">›</span>
          </button>`).join('')}
        </div>
      </section>

      <section class="panel">
        <div class="section-head"><div><span class="section-icon">📄</span><h2>Documents officiels</h2></div><span class="linkish">Voir tout →</span></div>
        <a class="resource-row" href="https://cripen.dj/index.php/serie-s/" target="_blank" rel="noopener noreferrer">
          <span class="resource-icon">📘</span>
          <div><strong>Annales et programme officiel</strong><small>Sujets des années précédentes, corrigés et programme du Bac S</small></div>
          <span>›</span>
        </a>
        <a class="resource-row" href="https://cripen.dj/wp-content/uploads/2025/05/Programme-compile-Terminale.pdf" target="_blank" rel="noopener noreferrer">
          <span class="resource-icon">📚</span>
          <div><strong>Programme de Terminale</strong><small>Référentiel officiel à consulter en PDF</small></div>
          <span>›</span>
        </a>
      </section>

      <section class="panel quick-ai">
        <div class="ai-badge">🤖</div>
        <div><h2>Assistant pédagogique</h2><p>Pose une question, demande un corrigé ou prépare un Bac blanc.</p></div>
        <button id="openAssistant" class="primary-cta">Ouvrir l’assistant</button>
      </section>
    </main>

    <nav class="bottom-nav">
      ${navItem('🏠','Accueil',true)}
      ${navItem('📈','Progression')}
      ${navItem('📄','Documents')}
      ${navItem('👤','Profil')}
    </nav>
  </div>`;

  document.querySelectorAll('[data-subject]').forEach(btn=>{
    btn.addEventListener('click',()=>{
      currentSubject=btn.dataset.subject;
      renderSubject();
    });
  });
  document.getElementById('openAssistant').onclick=()=>renderAssistant();
}

function renderSubject(){
  const s=subjects.find(x=>x.name===currentSubject) || subjects[0];
  root.innerHTML=`
  <div class="app-shell">
    <header class="subject-header">
      <div class="top-row"><button class="icon-button" id="backHome">←</button><div><h1>${s.icon} ${s.name}</h1><p>Cours, exercices et outils intelligents</p></div></div>
      <div class="subject-visual">
        <div class="formula-cloud">${s.name==='Mathématiques'?'x² + 5x + 6 = 0 · f(x) · sin α':s.name==='Physique'?'F = ma · E = mc² · U = RI':s.name==='Chimie'?'pH · H₂O · n = m/M':s.name==='SVT'?'ADN · cellule · génétique':'thèse · argument · problématique'}</div>
        <img src="/books-hero.svg" alt="Livres de révision" />
      </div>
    </header>

    <main class="subject-content">
      <section class="panel">
        <div class="section-head"><div><span class="section-icon">💡</span><h2>Choisir un mode d’étude</h2></div></div>
        <div class="mode-grid">
          ${modes.map(m=>`<button class="mode-card ${m.className}" data-mode="${m.name}">
            <span class="mode-icon">${m.icon}</span>
            <div><strong>${m.name}</strong><small>${m.desc}</small></div>
          </button>`).join('')}
        </div>
      </section>

      <section class="panel">
        <div class="section-head"><div><span class="section-icon">📁</span><h2>Ressources ${s.name}</h2></div><span class="linkish">Voir tout →</span></div>
        <div class="resource-row static"><span class="resource-icon blue-bg">📘</span><div><strong>Fiches de cours</strong><small>Synthèses claires et illustrées</small></div><span>›</span></div>
        <div class="resource-row static"><span class="resource-icon green-bg">🧾</span><div><strong>Exercices corrigés</strong><small>Entraînement progressif avec solutions</small></div><span>›</span></div>
        <a class="resource-row" href="https://cripen.dj/index.php/serie-s/" target="_blank" rel="noopener noreferrer"><span class="resource-icon orange-bg">📙</span><div><strong>Annales du Bac S</strong><small>Sujets officiels de Djibouti</small></div><span>›</span></a>
      </section>
    </main>

    <nav class="bottom-nav">
      ${navItem('🏠','Accueil',true)}
      ${navItem('📈','Progression')}
      ${navItem('📄','Documents')}
      ${navItem('👤','Profil')}
    </nav>
  </div>`;

  document.getElementById('backHome').onclick=renderHome;
  document.querySelectorAll('[data-mode]').forEach(btn=>{
    btn.addEventListener('click',()=>{
      currentMode=btn.dataset.mode;
      renderAssistant();
    });
  });
}

function renderAssistant(){
  const s=subjects.find(x=>x.name===currentSubject) || subjects[0];
  root.innerHTML=`
  <div class="app-shell assistant-shell">
    <header class="assistant-topbar">
      <button class="icon-button dark" id="backSubject">←</button>
      <div class="assistant-bot">🤖</div>
      <div class="assistant-heading"><h1>Assistant pédagogique</h1><p>${currentSubject} • ${currentMode}</p></div>
      <span class="online-pill">● IA en ligne</span>
    </header>

    <main class="assistant-content">
      <section class="assistant-card">
        <label for="question">Votre question ou exercice</label>
        <textarea id="question" maxlength="4000" placeholder="Ex. : Peux-tu m’expliquer cette fonction ?\nou résoudre cet exercice étape par étape…"></textarea>
        <div class="counter"><span id="counter">0</span>/4000</div>

        <label class="photo-box" for="photo">
          <span class="photo-icon">🖼️</span>
          <strong>Ajouter une photo (facultatif)</strong>
          <small>Photo d’un exercice, d’un texte ou d’un schéma</small>
        </label>
        <input id="photo" class="hidden-input" type="file" accept="image/jpeg,image/png" capture="environment"/>

        <button id="ask" class="ask-button">➤ Demander une explication</button>
        <p id="status" role="status" aria-live="polite"></p>
      </section>

      <section class="answer-card">
        <div class="answer-head"><span class="assistant-bot small">🤖</span><div><strong>Réponse de l’assistant</strong><small>Copilote Bac S</small></div></div>
        <div id="answer" class="answer empty-answer">
          <p>Pose ta question pour obtenir une explication structurée et progressive.</p>
          <div class="hint-box">💡 Tu peux aussi demander un indice, un quiz ou un exercice similaire.</div>
        </div>
      </section>
    </main>
  </div>`;

  document.getElementById('backSubject').onclick=renderSubject;
  const questionEl=document.getElementById('question');
  const counter=document.getElementById('counter');
  questionEl.addEventListener('input',()=>counter.textContent=questionEl.value.length);

  const ask=document.getElementById('ask');
  const status=document.getElementById('status');
  const answer=document.getElementById('answer');

  ask.onclick=async()=>{
    const question=questionEl.value.trim();
    const photo=document.getElementById('photo').files[0];

    if(!question){
      status.textContent='Écrivez une question avant de continuer.';
      status.className='error';
      return;
    }

    if(photo&&(!['image/jpeg','image/png'].includes(photo.type)||photo.size>5*1024*1024)){
      status.textContent='Photo JPG/PNG de 5 Mo maximum.';
      status.className='error';
      return;
    }

    ask.disabled=true;
    status.className='';
    status.textContent='Connexion à l’assistant IA…';
    answer.classList.remove('empty-answer');
    answer.innerHTML='<div class="loading-answer">Analyse de la question en cours…</div>';

    try{
      if(photo)throw Error('Analyse des photos pas encore activée. Saisissez le texte de l’exercice pour cette version.');

      const apiUrl=import.meta.env.VITE_TUTOR_API_URL;
      if(!apiUrl)throw Error('TUTOR_API_URL n’est pas encore configurée dans la compilation Android.');

      const controller=new AbortController();
      const timer=setTimeout(()=>controller.abort(),120000);

      let res;
      try{
        res=await fetch(apiUrl,{
          method:'POST',
          headers:{'Content-Type':'application/json'},
          body:JSON.stringify({subject:currentSubject,mode:currentMode,question}),
          signal:controller.signal
        });
      }finally{
        clearTimeout(timer);
      }

      const data=await res.json().catch(()=>({error:'Réponse du serveur illisible'}));
      if(!res.ok)throw Error(data.error||'Erreur serveur');

      answer.textContent=data.answer||'Aucune réponse';
      status.textContent='Réponse reçue.';
    }catch(e){
      answer.innerHTML=`<div class="error-panel"><strong>Assistant indisponible</strong><p>${e.message}</p></div>`;
      status.textContent='';
    }finally{
      ask.disabled=false;
    }
  };
}

renderHome();

if('serviceWorker' in navigator){
  window.addEventListener('load',()=>navigator.serviceWorker.register('/sw.js').catch(()=>{}));
}
