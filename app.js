const actionCards=document.querySelectorAll("[data-command]");
const subjectButtons=document.querySelectorAll("[data-subject]");
const promptInput=document.getElementById("promptInput");
const sendBtn=document.getElementById("sendBtn");
const photoInput=document.getElementById("photoInput");
const preview=document.getElementById("previewImage");
const attachmentPreview=document.getElementById("attachmentPreview");
const removeImage=document.getElementById("removeImage");
const demoResponse=document.getElementById("demoResponse");
const demoText=document.getElementById("demoText");
const statusText=document.getElementById("statusText");
let selectedSubject="";
let selectedFile=null;

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

photoInput.addEventListener("change",e=>{
  selectedFile=e.target.files?.[0]||null;
  if(!selectedFile)return;
  const url=URL.createObjectURL(selectedFile);
  preview.src=url;
  attachmentPreview.hidden=false;
  if(!promptInput.value.trim()) promptInput.value="/photo-corrige — ";
  statusText.textContent="Photo prête";
});

removeImage.addEventListener("click",()=>{
  selectedFile=null;
  photoInput.value="";
  preview.src="";
  attachmentPreview.hidden=true;
});

sendBtn.addEventListener("click",()=>{
  const text=promptInput.value.trim();
  if(!text && !selectedFile){
    promptInput.focus();
    return;
  }
  demoText.textContent=selectedFile
    ? `${text || "/photo-corrige"} • Photo jointe prête pour analyse.`
    : text;
  demoResponse.hidden=false;
  statusText.textContent="Commande préparée";
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
  window.addEventListener("load",()=>navigator.serviceWorker.register("/sw.js").catch(()=>{}));
}