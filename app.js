const actionCards=document.querySelectorAll("[data-command]");
const subjectButtons=document.querySelectorAll("[data-subject]");
const promptInput=document.getElementById("promptInput");
const sendBtn=document.getElementById("sendBtn");
const photoInput=document.getElementById("photoInput");
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

photoInput.addEventListener("change",e=>{
  selectedFile=e.target.files?.[0]||null;
  if(!selectedFile)return;
  if(!selectedFile.type.startsWith("image/") || selectedFile.size > 4_000_000){
    selectedFile=null;
    photoInput.value="";
    statusText.textContent="Choisir une image de moins de 4 Mo";
    return;
  }
  const url=URL.createObjectURL(selectedFile);
  preview.src=url;
  attachmentPreview.hidden=false;
  if(!promptInput.value.trim()) promptInput.value="/photo-corrige — ";
  statusText.textContent="Photo prête";
});

removeImage.addEventListener("click",()=>{
  selectedFile=null;
  selectedPdf=null;
  photoInput.value="";
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
