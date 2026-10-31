import './styles.css';

const actionCards=document.querySelectorAll("[data-command]");
const subjectButtons=document.querySelectorAll("[data-subject]");
const promptInput=document.getElementById("promptInput");
const sendBtn=document.getElementById("sendBtn");
const photoInput=document.getElementById("photoInput");
const cameraInput=document.getElementById("cameraInput");
const pdfInput=document.getElementById("pdfInput");
const preview=document.getElementById("previewImage");
const pdfPreviewName=document.getElementById("pdfPreviewName");
const attachmentPreview=document.getElementById("attachmentPreview");
const removeImage=document.getElementById("removeImage");
const demoResponse=document.getElementById("demoResponse");
const demoText=document.getElementById("demoText");
const responseTitle=document.getElementById("responseTitle");
const responseNote=document.getElementById("responseNote");
const statusText=document.getElementById("statusText");
const chatHistory=document.getElementById("chatHistory");
const newChatBtn=document.getElementById("newChatBtn");

let selectedSubject="";
let selectedFile=null;
let selectedPdf=null;
let conversationId=localStorage.getItem("copiloteConversationId") || null;
let localMessages=JSON.parse(localStorage.getItem("copiloteMessages") || "[]");

function saveMessages(){
  localStorage.setItem("copiloteMessages", JSON.stringify(localMessages.slice(-40)));
}

function renderMessages(){
  if(!chatHistory)return;
  chatHistory.innerHTML="";
  localMessages.forEach(msg=>{
    const bubble=document.createElement("div");
    bubble.className=`chat-bubble ${msg.role}`;
    const label=document.createElement("strong");
    label.textContent=msg.role==="user" ? "Deksan" : "Copilote";
    const text=document.createElement("p");
    text.textContent=msg.text;
    bubble.append(label,text);
    chatHistory.appendChild(bubble);
  });
  if(localMessages.length) chatHistory.scrollTop=chatHistory.scrollHeight;
}
renderMessages();

newChatBtn?.addEventListener("click",()=>{
  conversationId=null;
  localMessages=[];
  localStorage.removeItem("copiloteConversationId");
  localStorage.removeItem("copiloteMessages");
  renderMessages();
  demoResponse.hidden=true;
  statusText.textContent="Nouvelle conversation";
  promptInput.value="";
  promptInput.focus();
});

actionCards.forEach(card=>{
  card.addEventListener("click",()=>{
    const command=card.dataset.command;
    const title=card.querySelector(".title")?.textContent?.trim()||"";
    promptInput.value=`${command} ${selectedSubject ? "— "+selectedSubject+" — " : "— "}`;
    promptInput.focus();
    statusText.textContent=title;
    document.getElementById("assistantPanel").scrollIntoView({behavior:"smooth",block:"center"});
  });
});

subjectButtons.forEach(btn=>{
  btn.addEventListener("click",()=>{
    subjectButtons.forEach(b=>b.classList.remove("selected"));
    btn.classList.add("selected");
    selectedSubject=btn.dataset.subject;
    promptInput.value=`/cours — ${selectedSubject} — `;
    statusText.textContent=`Matière : ${selectedSubject}`;
    promptInput.focus();
  });
});

pdfInput?.addEventListener("change",e=>{
  selectedPdf=e.target.files?.[0]||null;
  if(!selectedPdf)return;
  if(selectedPdf.type!=="application/pdf" || selectedPdf.size>2_700_000){
    selectedPdf=null;
    pdfInput.value="";
    statusText.textContent="Choisir un PDF de moins de 2,7 Mo";
    return;
  }
  selectedFile=null;
  photoInput.value="";
  preview.removeAttribute("src");
  attachmentPreview.hidden=false;
  preview.style.display="none";
  attachmentPreview.dataset.pdfName=selectedPdf.name;
  if(pdfPreviewName)pdfPreviewName.textContent=`PDF sélectionné : ${selectedPdf.name}`;
  statusText.textContent=`PDF prêt : ${selectedPdf.name}`;
  if(!promptInput.value.trim()) promptInput.value="/corrige-annale — Corrige toutes les questions du sujet, étape par étape.";
});

function handlePhotoSelection(e){
  const file=e.target.files?.[0]||null;
  if(!file)return;
  if(!file.type.startsWith("image/") || file.size > 4_000_000){
    statusText.textContent="Choisir une image de moins de 4 Mo";
    photoInput.value="";
    if(cameraInput)cameraInput.value="";
    selectedFile=null;
    return;
  }
  selectedFile=file;
  selectedPdf=null;
  if(pdfInput)pdfInput.value="";
  if(pdfPreviewName)pdfPreviewName.textContent="";
  attachmentPreview.dataset.pdfName="";
  preview.style.display="";
  const url=URL.createObjectURL(selectedFile);
  preview.src=url;
  attachmentPreview.hidden=false;
  if(!promptInput.value.trim()) promptInput.value="/photo-corrige — ";
  statusText.textContent="Photo prête";
}
photoInput.addEventListener("change",handlePhotoSelection);
cameraInput?.addEventListener("change",handlePhotoSelection);

removeImage.addEventListener("click",()=>{
  selectedFile=null;
  selectedPdf=null;
  photoInput.value="";
  if(cameraInput)cameraInput.value="";
  if(pdfInput)pdfInput.value="";
  preview.src="";
  preview.style.display="";
  attachmentPreview.dataset.pdfName="";
  if(pdfPreviewName)pdfPreviewName.textContent="";
  attachmentPreview.hidden=true;
});

function fileToDataUrl(file){
  return new Promise((resolve,reject)=>{
    const reader=new FileReader();
    reader.onload=()=>resolve(reader.result);
    reader.onerror=reject;
    reader.readAsDataURL(file);
  });
}

function setResponse(title,text,note=""){
  responseTitle.textContent=title;
  demoText.textContent=text;
  responseNote.textContent=note;
  demoResponse.hidden=false;
}

sendBtn.addEventListener("click",async()=>{
  const text=promptInput.value.trim();
  if(!text && !selectedFile && !selectedPdf){
    promptInput.focus();
    return;
  }

  const userText=text || "/photo-corrige — Corrige cet exercice étape par étape.";
  localMessages.push({role:"user",text:userText});
  saveMessages();
  renderMessages();

  sendBtn.disabled=true;
  sendBtn.textContent="Envoi…";
  statusText.textContent="ChatGPT réfléchit…";
  setResponse("Copilote Bac","Analyse en cours…","");

  try{
    const imageDataUrl=selectedFile ? await fileToDataUrl(selectedFile) : null;
    const pdfDataUrl=selectedPdf ? await fileToDataUrl(selectedPdf) : null;
    const response=await fetch("/api/tutor",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({
        message:userText,
        imageDataUrl,
        pdfDataUrl,
        subject:selectedSubject || null,
        conversationId
      })
    });

    const data=await response.json().catch(()=>({}));
    if(!response.ok){
      throw new Error(data.error || "Impossible de joindre l'API OpenAI.");
    }

    conversationId=data.conversationId || conversationId;
    if(conversationId) localStorage.setItem("copiloteConversationId",conversationId);

    const answer=data.answer || "Aucune réponse.";
    localMessages.push({role:"assistant",text:answer});
    saveMessages();
    renderMessages();

    setResponse("Réponse du Copilote",answer,`Modèle : ${data.model || "OpenAI"}`);
    statusText.textContent="Réponse reçue";
    promptInput.value="";
    selectedFile=null;
    selectedPdf=null;
    photoInput.value="";
    if(cameraInput)cameraInput.value="";
    if(pdfInput)pdfInput.value="";
    preview.src="";
    preview.style.display="";
    attachmentPreview.dataset.pdfName="";
    if(pdfPreviewName)pdfPreviewName.textContent="";
    attachmentPreview.hidden=true;
  }catch(error){
    const msg=error?.message || "Une erreur est survenue.";
    localMessages.push({role:"assistant",text:`Erreur : ${msg}`});
    saveMessages();
    renderMessages();
    setResponse("Connexion ChatGPT",msg,"Vérifiez OPENAI_API_KEY et OPENAI_MODEL sur le serveur.");
    statusText.textContent="Erreur";
  }finally{
    sendBtn.disabled=false;
    sendBtn.textContent="Envoyer";
  }
});

promptInput.addEventListener("keydown",e=>{
  if((e.ctrlKey || e.metaKey) && e.key==="Enter") sendBtn.click();
});

document.querySelectorAll("[data-scroll]").forEach(btn=>{
  btn.addEventListener("click",()=>{
    const id=btn.dataset.scroll;
    const target=id==="subjects"?document.querySelector(".subjects"):document.getElementById(id);
    target?.scrollIntoView({behavior:"smooth",block:"start"});
  });
});

let deferredPrompt;
const installBtn=document.getElementById("installBtn");
window.addEventListener("beforeinstallprompt",e=>{
  e.preventDefault();
  deferredPrompt=e;
  installBtn.hidden=false;
});
installBtn.addEventListener("click",async()=>{
  if(!deferredPrompt)return;
  deferredPrompt.prompt();
  await deferredPrompt.userChoice;
  deferredPrompt=null;
  installBtn.hidden=true;
});

if("serviceWorker" in navigator){
  window.addEventListener("load",()=>navigator.serviceWorker.register(new URL("./sw.js", document.baseURI).href).catch(()=>{}));
}


// Tableau de bord connecté : les données ne sont envoyées à Supabase
// qu'après authentification de l'élève.
let learningClient=null;
let learningUser=null;
let curriculumIndex=null;
const dashboardStatus=document.getElementById("dashboardStatus");
const subjectSelect=document.getElementById("progressSubject");
const chapterSelect=document.getElementById("progressChapter");
const stateSelect=document.getElementById("progressState");
const masteryRange=document.getElementById("masteryRange");
const masteryOutput=document.getElementById("masteryOutput");
const saveProgressButton=document.getElementById("saveProgress");

function dashboardMessage(message){ if(dashboardStatus) dashboardStatus.textContent=message; }

function populateChapterChoices(){
  if(!chapterSelect || !curriculumIndex)return;
  const subject=subjectSelect.value;
  const chapters=curriculumIndex.subjects?.[subject]||[];
  chapterSelect.replaceChildren(new Option("Choisir un chapitre",""));
  chapters.forEach(item=>{
    const pageLabel=item.pages ? " — p. "+item.pages : "";
    chapterSelect.add(new Option(item.chapter+pageLabel,item.chapter));
  });
}

function renderProgressRows(rows){
  const list=document.getElementById("progressList");
  const summary=document.getElementById("dashboardSummary");
  if(!list || !summary)return;
  const mastered=rows.filter(row=>row.status==="mastered").length;
  const fragile=rows.filter(row=>row.status==="fragile").length;
  summary.replaceChildren();
  [rows.length+" chapitre(s) enregistré(s)",mastered+" maîtrisé(s)",fragile+" à renforcer"].forEach(label=>{
    const item=document.createElement("span"); item.textContent=label; summary.append(item);
  });
  list.replaceChildren();
  rows.forEach(row=>{
    const item=document.createElement("article"); item.className="progress-item";
    const heading=document.createElement("strong"); heading.textContent=row.subject+" — "+row.chapter;
    const detail=document.createElement("span"); detail.textContent=row.status.replace("_"," ")+" · "+row.mastery_percent+" %";
    const bar=document.createElement("progress"); bar.max=100; bar.value=row.mastery_percent;
    item.append(heading,detail,bar);
    if(row.next_review_at){const review=document.createElement("small");review.textContent="Prochaine révision : "+new Date(row.next_review_at).toLocaleDateString("fr-FR");item.append(review);}
    list.append(item);
  });
}

async function refreshLearningDashboard(){
  if(!learningClient || !learningUser)return;
  const {data,error}=await learningClient.from("chapter_progress").select("subject,chapter,status,mastery_percent,next_review_at,updated_at").eq("user_id",learningUser.id).order("updated_at",{ascending:false});
  if(error){dashboardMessage("Lecture du suivi impossible : "+error.message);return;}
  renderProgressRows(data||[]);
  const attempts=await learningClient.from("quiz_attempts").select("subject,chapter,quiz_type,score,total_questions,correct_answers,completed_at").eq("user_id",learningUser.id).order("completed_at",{ascending:false}).limit(8);
  const history=document.getElementById("quizHistory");
  if(history){history.replaceChildren();(attempts.data||[]).forEach(attempt=>{const row=document.createElement("p");row.textContent=attempt.subject+(attempt.chapter?" — "+attempt.chapter:"")+" · "+attempt.score+" % · "+attempt.correct_answers+"/"+attempt.total_questions+" · "+new Date(attempt.completed_at).toLocaleDateString("fr-FR");history.append(row);});}
  saveProgressButton.disabled=false;
  document.getElementById("saveQuizResult").disabled=false;
  dashboardMessage("Connecté : "+(learningUser.email||"compte élève")+". Progression synchronisée.");
}

async function initializeLearningDashboard(){
  if(!dashboardStatus)return;
  try{
    const response=await fetch("/api/config",{headers:{"Accept":"application/json"}});
    const config=await response.json();
    if(!config.configured){
      dashboardMessage("Suivi Supabase préparé, mais non activé : le projet Supabase du Copilote et ses clés publiques doivent encore être configurés côté serveur.");
      return;
    }
    const {createClient}=await import("https://esm.sh/@supabase/supabase-js@2.95.0");
    learningClient=createClient(config.url,config.publishableKey);
    const {data,error}=await learningClient.auth.getSession();
    if(error)throw error;
    learningUser=data.session?.user||null;
    if(learningUser){
      document.getElementById("studentSignOut").hidden=false;
      document.getElementById("studentSignIn").hidden=true;
      document.getElementById("studentSignUp").hidden=true;
      await refreshLearningDashboard();
    }else{
      dashboardMessage("Supabase est configuré. Connecte-toi ou crée ton compte pour enregistrer tes progrès.");
    }
  }catch(error){
    dashboardMessage("Initialisation du suivi impossible. Vérifie la configuration Supabase et la connexion Internet.");
  }
}

async function signInStudent(createAccount=false){
  if(!learningClient){dashboardMessage("Le suivi Supabase n'est pas encore configuré.");return;}
  const email=document.getElementById("studentEmail").value.trim();
  const password=document.getElementById("studentPassword").value;
  if(!email || password.length<8){dashboardMessage("Saisis un e-mail valide et un mot de passe d'au moins 8 caractères.");return;}
  dashboardMessage("Connexion en cours…");
  const result=createAccount
    ? await learningClient.auth.signUp({email,password})
    : await learningClient.auth.signInWithPassword({email,password});
  if(result.error){dashboardMessage("Authentification impossible : "+result.error.message);return;}
  learningUser=result.data.session?.user||null;
  if(!learningUser){dashboardMessage("Compte créé. Vérifie ton e-mail pour confirmer l'inscription, puis connecte-toi.");return;}
  document.getElementById("studentSignOut").hidden=false;
  document.getElementById("studentSignIn").hidden=true;
  document.getElementById("studentSignUp").hidden=true;
  const profileResult=await learningClient.from("student_profiles").upsert({user_id:learningUser.id,grade:"Terminale S"},{onConflict:"user_id"});
  if(profileResult.error){dashboardMessage("Profil non initialisé : vérifie la migration Supabase et les règles RLS.");return;}
  await refreshLearningDashboard();
}

document.getElementById("studentSignIn")?.addEventListener("click",()=>signInStudent(false));
document.getElementById("studentSignUp")?.addEventListener("click",()=>signInStudent(true));
document.getElementById("studentSignOut")?.addEventListener("click",async()=>{
  await learningClient?.auth.signOut(); learningUser=null;
  document.getElementById("studentSignOut").hidden=true;
  document.getElementById("studentSignIn").hidden=false;
  document.getElementById("studentSignUp").hidden=false;
  saveProgressButton.disabled=true;
  renderProgressRows([]);
  dashboardMessage("Déconnecté.");
});
subjectSelect?.addEventListener("change",populateChapterChoices);
masteryRange?.addEventListener("input",()=>{masteryOutput.value=masteryRange.value+" %";});
stateSelect?.addEventListener("change",()=>{
  if(stateSelect.value==="mastered") {masteryRange.value=100;masteryOutput.value="100 %";}
  if(stateSelect.value==="fragile" && Number(masteryRange.value)>65) {masteryRange.value=60;masteryOutput.value="60 %";}
});
saveProgressButton?.addEventListener("click",async()=>{
  if(!learningClient || !learningUser){dashboardMessage("Connecte-toi avant d'enregistrer.");return;}
  const subject=subjectSelect.value, chapter=chapterSelect.value;
  if(!chapter){dashboardMessage("Choisis un chapitre avant d'enregistrer.");return;}
  const mastery=Number(masteryRange.value);
  const nextReview=new Date(); nextReview.setDate(nextReview.getDate()+1);
  const {error}=await learningClient.from("chapter_progress").upsert({
    user_id:learningUser.id,subject,chapter,status:stateSelect.value,
    mastery_percent:mastery,last_activity_at:new Date().toISOString(),
    next_review_at:nextReview.toISOString()
  },{onConflict:"user_id,subject,chapter"});
  if(error){dashboardMessage("Enregistrement impossible : "+error.message);return;}
  dashboardMessage("Progression enregistrée.");
  await refreshLearningDashboard();
});

fetch("/sources/cripen_terminal_curriculum.json").then(response=>response.ok?response.json():null).then(data=>{
  curriculumIndex=data;populateChapterChoices();
}).catch(()=>dashboardMessage("Index de pagination CRIPEN indisponible pour le moment."));
initializeLearningDashboard();

document.getElementById("saveQuizResult")?.addEventListener("click",async()=>{
  if(!learningClient || !learningUser){dashboardMessage("Connecte-toi avant d'enregistrer.");return;}
  const total=Number(document.getElementById("quizTotal").value);
  const correct=Number(document.getElementById("quizCorrect").value);
  if(!Number.isInteger(total)||total<1||total>100||!Number.isInteger(correct)||correct<0||correct>total){
    dashboardMessage("Vérifie le nombre de questions et les bonnes réponses.");return;
  }
  const {error}=await learningClient.from("quiz_attempts").insert({
    user_id:learningUser.id,subject:subjectSelect.value,chapter:chapterSelect.value||null,
    quiz_type:document.getElementById("quizType").value,
    score:Math.round(correct/total*10000)/100,total_questions:total,correct_answers:correct,
    source_label:"Résultat saisi par l'élève — à distinguer d'une annale officielle"
  });
  if(error){dashboardMessage("Résultat non enregistré : vérifie la migration Supabase.");return;}
  dashboardMessage("Résultat de l'évaluation enregistré.");
  await refreshLearningDashboard();
});
