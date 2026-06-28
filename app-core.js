let workouts=[],runs=[],shoes=[],customExercises=[],allExercises=[];
let session={active:false,day:"",date:"",startTime:null,timerInterval:null,exercises:[]};
const restTimers={};  // global map of idx -> intervalId
let expandedSessions=new Set();
let editingShoeId=null,editingExId=null;
let exEditDays=[],exEditMuscles=[],exEditEquip=[];
let kmRows=[];

const $=id=>document.getElementById(id);

/* ══════════════════════════════════════════
   SESSION CRASH RECOVERY (localStorage buffer)
   ══════════════════════════════════════════ */
const SESSION_KEY="gt_active_session";
function saveSessionToLocal(){
  if(!session.active) return;
  localStorage.setItem(SESSION_KEY,JSON.stringify({...session,timerInterval:null}));
}
function loadSessionFromLocal(){
  try{
    const raw=localStorage.getItem(SESSION_KEY);
    if(!raw) return false;
    const s=JSON.parse(raw);
    if(!s.active) return false;
    session={...s,timerInterval:null};
    return true;
  } catch(e){ return false; }
}
function clearSessionLocal(){ localStorage.removeItem(SESSION_KEY); }

/* ══════════════════════════════════════════
   SUPABASE DATA LAYER
   ══════════════════════════════════════════ */
async function loadAll(){
  showOverlay(true);
  try{
    const [wR,rR,sR,eR]=await Promise.all([
      db.from("workouts").select("*").order("created_at",{ascending:false}),
      db.from("runs").select("*").order("created_at",{ascending:false}),
      db.from("shoes").select("*").order("created_at",{ascending:true}),
      db.from("custom_exercises").select("*").order("created_at",{ascending:true}),
    ]);
    workouts=(wR.data||[]).map(normalizeWorkout);
    runs=rR.data||[];
    shoes=sR.data||[];
    customExercises=(eR.data||[]).map(e=>({...e,muscles:e.muscles||[],equipment:e.equipment||[],days:e.days||[]}));
  } catch(e){ console.error(e); showToast("Failed to load data — check connection"); }
  mergeExercises();
  showOverlay(false);
}
function normalizeWorkout(w){ return {...w,sessionId:w.session_id,sets_detail:w.sets_detail||[]}; }
function mergeExercises(){
  const custom=customExercises.map(e=>({...e,isCustom:true}));
  const customNames=new Set(custom.map(e=>e.name.toLowerCase()));
  const builtin=BUILTIN_EXERCISES.filter(e=>!customNames.has(e.name.toLowerCase())).map(e=>({...e,isCustom:false,id:"builtin_"+e.name}));
  allExercises=[...builtin,...custom].sort((a,b)=>a.name.localeCompare(b.name));
}

async function insertWorkout(e){
  const {error}=await db.from("workouts").upsert({id:Math.floor(e.id),session_id:e.sessionId,date:e.date,day:e.day,exercise:e.exercise,muscles:e.muscles,equipment:e.equipment,sets_detail:e.sets_detail,sets:e.sets,reps:e.reps,weight:e.weight,duration:e.duration,machine_used:e.machineUsed||null});
  if(error) throw error;
}
async function deleteWorkoutsBySession(key){
  const isNum=/^\d+$/.test(key);
  const q=isNum?db.from("workouts").delete().eq("session_id",parseInt(key)):db.from("workouts").delete().eq("date",key.split("_")[0]).eq("day",key.split("_").slice(1).join("_")).is("session_id",null);
  const {error}=await q; if(error) throw error;
}
async function insertRun(e){
  const {error}=await db.from("runs").insert({id:e.id,date:e.date,distance:e.distance,time:e.time,location:e.location,shoe_id:e.shoeId?parseInt(e.shoeId):null,shoe_name:e.shoeName,notes:e.notes,km_splits:e.kmSplits||null});
  if(error) throw error;
}
async function deleteRun(id){ const {error}=await db.from("runs").delete().eq("id",id); if(error) throw error; }
async function insertShoe(s){ const {error}=await db.from("shoes").insert({id:s.id,brand:s.brand,model:s.model,km:s.km||0,max_km:s.maxKm||null,notes:s.notes||null}); if(error) throw error; }
async function updateShoe(id,f){ const m={}; if(f.brand!==undefined)m.brand=f.brand; if(f.model!==undefined)m.model=f.model; if(f.km!==undefined)m.km=f.km; if(f.maxKm!==undefined)m.max_km=f.maxKm; if(f.notes!==undefined)m.notes=f.notes; const {error}=await db.from("shoes").update(m).eq("id",id); if(error) throw error; }
async function deleteShoe(id){ const {error}=await db.from("shoes").delete().eq("id",id); if(error) throw error; }
async function upsertCustomExercise(e){ const {error}=await db.from("custom_exercises").upsert({id:e.id,name:e.name,days:e.days,muscles:e.muscles,equipment:e.equipment}); if(error) throw error; }
async function deleteCustomExercise(id){ const {error}=await db.from("custom_exercises").delete().eq("id",id); if(error) throw error; }

function showOverlay(show){
  let el=document.getElementById("loading-overlay");
  if(show&&!el){ el=document.createElement("div"); el.id="loading-overlay"; el.style.cssText="position:fixed;inset:0;background:rgba(15,15,15,0.85);display:flex;align-items:center;justify-content:center;z-index:9999;font-size:1rem;color:#888;flex-direction:column;gap:12px;"; el.innerHTML=`<div style="font-size:2rem">⏳</div><div>Loading…</div>`; document.body.appendChild(el); }
  else if(!show&&el) el.remove();
}

/* ══════════════════════════════════════════
   INIT
   ══════════════════════════════════════════ */
document.addEventListener("DOMContentLoaded",async()=>{
  initTheme();
  setDefaultDates();
  populateDayDropdowns();
  bindNav();
  bindThemeToggle();
  bindWorkoutSetup();
  bindExerciseManager();
  bindSessionControls();
  bindRunForm();
  bindHistory();
  bindCalendar();
  bindRecords();
  bindShoes();
  await loadAll();
  // Restore crashed session
  if(loadSessionFromLocal()){
    $("workout-setup").classList.add("hidden");
    $("workout-session").classList.remove("hidden");
    $("session-day-label").textContent=session.day;
    $("session-date-label").textContent=formatDate(session.date);
    startTimer();
    renderExerciseList();
    showToast("Session restored 💪");
    // Switch to workout tab
    document.querySelectorAll(".nav-btn").forEach(b=>b.classList.remove("active"));
    document.querySelectorAll(".tab").forEach(t=>t.classList.remove("active"));
    document.querySelector('[data-tab="workout"]').classList.add("active");
    $("tab-workout").classList.add("active");
  }
  renderCalendar();
  renderHistory();
  renderRecords();
  renderShoes();
  renderRunPRs();
  populateShoeDropdown();
  renderExerciseManagerList();
  initExport();
});

function setDefaultDates(){
  const t=new Date().toISOString().split("T")[0];
  $("w-date").value=t; $("r-date").value=t;
  updateDateDisplay("w-date","w-date-display");
  updateDateDisplay("r-date","r-date-display");
}
function updateDateDisplay(inputId,displayId){
  const v=$(inputId).value;
  $(displayId).textContent=v?new Date(v+"T00:00:00").toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"}):"Select date";
}
function populateDayDropdowns(){
  const s=$("w-day"); DAY_OPTIONS.forEach(d=>{ const o=document.createElement("option"); o.value=o.textContent=d; s.appendChild(o); });
  const f=$("filter-day"); DAY_OPTIONS.forEach(d=>{ const o=document.createElement("option"); o.value=o.textContent=d; f.appendChild(o); });
  const da=$("ex-days-add"); DAY_OPTIONS.forEach(d=>{ const o=document.createElement("option"); o.value=o.textContent=d; da.appendChild(o); });
  const ma=$("ex-muscles-add"); ALL_MUSCLES.forEach(m=>{ const o=document.createElement("option"); o.value=o.textContent=m; ma.appendChild(o); });
}
function populateShoeDropdown(){
  const s=$("r-shoe"); const cur=s.value;
  s.innerHTML='<option value="">No shoe selected</option>';
  shoes.forEach(sh=>{ const o=document.createElement("option"); o.value=sh.id; o.textContent=`${sh.brand} ${sh.model}`; s.appendChild(o); });
  if(cur) s.value=cur;
}

/* THEME */
function initTheme(){ const saved=localStorage.getItem("gt_theme")||"dark"; document.documentElement.setAttribute("data-theme",saved); updateThemeBtn(saved); }
function bindThemeToggle(){ $("theme-toggle").addEventListener("click",()=>{ const cur=document.documentElement.getAttribute("data-theme"); const next=cur==="dark"?"light":"dark"; document.documentElement.setAttribute("data-theme",next); localStorage.setItem("gt_theme",next); updateThemeBtn(next); renderExerciseList(); }); }
function updateThemeBtn(t){ $("theme-toggle").textContent=t==="dark"?"☀️":"🌙"; }

/* NAV */
function bindNav(){
  document.querySelectorAll(".nav-btn").forEach(btn=>{
    btn.addEventListener("click",()=>{
      document.querySelectorAll(".nav-btn").forEach(b=>b.classList.remove("active"));
      document.querySelectorAll(".tab").forEach(t=>t.classList.remove("active"));
      btn.classList.add("active");
      $("tab-"+btn.dataset.tab).classList.add("active");
      if(btn.dataset.tab==="records") renderRecords();
      if(btn.dataset.tab==="history") renderHistory();
      if(btn.dataset.tab==="shoes") renderShoes();
      if(btn.dataset.tab==="run") renderRunPRs();
    });
  });
}

/* WORKOUT SETUP */
function bindWorkoutSetup(){
  $("w-date").addEventListener("change",()=>updateDateDisplay("w-date","w-date-display"));
  $("w-day").addEventListener("change",()=>{ $("start-session-btn").disabled=!$("w-day").value; });
  $("start-session-btn").addEventListener("click",startSession);
}
function startSession(){
  const day=$("w-day").value,date=$("w-date").value;
  if(!day||!date) return;
  session={active:true,day,date,startTime:Date.now(),timerInterval:null,exercises:[]};
  $("workout-setup").classList.add("hidden");
  $("exercise-manager").classList.add("hidden");
  $("workout-session").classList.remove("hidden");
  $("session-day-label").textContent=day;
  $("session-date-label").textContent=formatDate(date);
  startTimer();
  renderExerciseList();
  saveSessionToLocal();
}
function startTimer(){
  if(session.timerInterval) clearInterval(session.timerInterval);
  session.timerInterval=setInterval(()=>{
    const e=Math.floor((Date.now()-session.startTime)/1000);
    $("session-timer").textContent=`${String(Math.floor(e/3600)).padStart(2,"0")}:${String(Math.floor((e%3600)/60)).padStart(2,"0")}:${String(e%60).padStart(2,"0")}`;
  },1000);
}

/* EXERCISE MANAGER */
function bindExerciseManager(){
  $("open-exercise-mgr").addEventListener("click",()=>{ $("exercise-manager").classList.remove("hidden"); renderExerciseManagerList(); });
  $("close-exercise-mgr").addEventListener("click",()=>{ $("exercise-manager").classList.add("hidden"); });
  $("add-new-exercise-btn").addEventListener("click",()=>openExForm(null));
  $("ex-mgr-search").addEventListener("input",renderExerciseManagerList);
  $("ex-form-cancel").addEventListener("click",()=>{ $("ex-edit-form").classList.add("hidden"); editingExId=null; });
  $("ex-form-save").addEventListener("click",saveExercise);
  $("ex-days-add").addEventListener("change",e=>{ const v=e.target.value; if(!v) return; if(!exEditDays.includes(v)){exEditDays.push(v);renderExTags("ex-days-tags",exEditDays,"day");} e.target.value=""; });
  $("ex-muscles-add").addEventListener("change",e=>{ const v=e.target.value; if(!v) return; if(!exEditMuscles.includes(v)){exEditMuscles.push(v);renderExTags("ex-muscles-tags",exEditMuscles,"muscle");} e.target.value=""; });
  $("ex-equip-input").addEventListener("keydown",e=>{ if(e.key==="Enter"){ e.preventDefault(); const v=e.target.value.trim(); if(v&&!exEditEquip.includes(v)){exEditEquip.push(v);renderExTags("ex-equip-tags",exEditEquip,"equip");} e.target.value=""; } });
}
function openExForm(ex){ editingExId=ex?ex.id:null; exEditDays=ex?[...ex.days]:[]; exEditMuscles=ex?[...ex.muscles]:[]; exEditEquip=ex?[...ex.equipment]:[]; $("ex-name-input").value=ex?ex.name:""; renderExTags("ex-days-tags",exEditDays,"day"); renderExTags("ex-muscles-tags",exEditMuscles,"muscle"); renderExTags("ex-equip-tags",exEditEquip,"equip"); $("ex-edit-form").classList.remove("hidden"); $("ex-name-input").focus(); }
function renderExTags(elId,arr,type){ const el=$(elId); el.innerHTML=arr.map((v,i)=>`<span class="tag-chip ${type} removable" data-idx="${i}">${v} ✕</span>`).join(""); el.querySelectorAll(".tag-chip").forEach(chip=>{ chip.addEventListener("click",()=>{ const idx=parseInt(chip.dataset.idx); if(type==="day") exEditDays.splice(idx,1); else if(type==="muscle") exEditMuscles.splice(idx,1); else exEditEquip.splice(idx,1); renderExTags(elId,type==="day"?exEditDays:type==="muscle"?exEditMuscles:exEditEquip,type); }); }); }
async function saveExercise(){ const name=$("ex-name-input").value.trim(); if(!name){ showToast("Exercise name required"); return; } const id=editingExId||Date.now(); const ex={id,name,days:exEditDays,muscles:exEditMuscles,equipment:exEditEquip}; try{ await upsertCustomExercise(ex); const existing=customExercises.findIndex(e=>e.id===id); if(existing>=0) customExercises[existing]={...ex,isCustom:true}; else customExercises.push({...ex,isCustom:true}); mergeExercises(); $("ex-edit-form").classList.add("hidden"); editingExId=null; renderExerciseManagerList(); showToast(editingExId?"Exercise updated":"Exercise added"); } catch(e){ console.error(e); showToast("Error saving exercise"); } }
function renderExerciseManagerList(){ const q=($("ex-mgr-search").value||"").toLowerCase(); const filtered=allExercises.filter(e=>!q||e.name.toLowerCase().includes(q)); const list=$("ex-mgr-list"); if(!filtered.length){ list.innerHTML=`<div style="padding:1rem;text-align:center;color:var(--muted);font-size:0.85rem">No exercises found</div>`; return; } list.innerHTML=filtered.map(ex=>`<div class="ex-card"><div class="ex-card-header"><span class="ex-card-name">${ex.name}</span><div class="ex-card-actions"><button class="ex-card-btn" data-id="${ex.id}">Edit</button>${ex.isCustom?`<button class="ex-card-btn danger" data-id="${ex.id}" data-delete="true">Delete</button>`:""}</div></div><div class="ex-card-body"><div class="tag-row">${(ex.days||[]).map(d=>`<span class="tag-chip day">${d}</span>`).join("")}</div><div class="tag-row">${(ex.muscles||[]).map(m=>`<span class="tag-chip muscle">${m}</span>`).join("")}</div><div class="tag-row">${(ex.equipment||[]).map(e=>`<span class="tag-chip equip">${e}</span>`).join("")}</div></div></div>`).join(""); list.querySelectorAll(".ex-card-btn:not([data-delete])").forEach(btn=>{ btn.addEventListener("click",()=>{ const ex=allExercises.find(e=>String(e.id)===String(btn.dataset.id)); if(ex) openExForm(ex); }); }); list.querySelectorAll(".ex-card-btn[data-delete]").forEach(btn=>{ btn.addEventListener("click",async()=>{ if(!confirm("Delete this exercise?")) return; try{ await deleteCustomExercise(btn.dataset.id); customExercises=customExercises.filter(e=>String(e.id)!==String(btn.dataset.id)); mergeExercises(); renderExerciseManagerList(); showToast("Exercise deleted"); } catch(e){ showToast("Error deleting"); } }); }); }

/* SESSION CONTROLS */
function bindSessionControls(){
  $("add-exercise-btn").addEventListener("click",toggleExercisePicker);
  $("exercise-search").addEventListener("input",renderExercisePickerList);
  $("discard-session-btn").addEventListener("click",discardSession);
  $("finish-session-btn").addEventListener("click",async()=>{
    const btn=$("finish-session-btn");
    if(btn.disabled) return;
    btn.disabled=true; btn.textContent="Saving…";
    await finishSession();
    btn.disabled=false; btn.textContent="Finish session";
  });
}
function toggleExercisePicker(){ const p=$("exercise-picker"); const hidden=p.classList.contains("hidden"); p.classList.toggle("hidden",!hidden); if(hidden){ $("exercise-search").value=""; renderExercisePickerList(); $("exercise-search").focus(); } }
function renderExercisePickerList(){ const q=$("exercise-search").value.toLowerCase(); const added=new Set(session.exercises.map(e=>e.exData.name)); const filtered=allExercises.filter(e=>e.days.includes(session.day)&&!added.has(e.name)&&(!q||e.name.toLowerCase().includes(q))); const list=$("exercise-picker-list"); if(!filtered.length){ list.innerHTML=`<div style="padding:12px;color:var(--muted);font-size:0.85rem;text-align:center">${added.size>0&&!q?"All exercises added":"No exercises found"}</div>`; return; } list.innerHTML=filtered.map(e=>`<div class="picker-item" data-name="${e.name}"><div class="picker-item-name">${e.name}</div><div class="picker-item-muscles">${(e.muscles||[]).slice(0,3).join(" · ")}</div></div>`).join(""); list.querySelectorAll(".picker-item").forEach(item=>{ item.addEventListener("click",()=>{ addExerciseToSession(item.dataset.name); $("exercise-picker").classList.add("hidden"); }); }); }

function addExerciseToSession(name){
  const exData=allExercises.find(e=>e.name===name); if(!exData) return;
  const lastSets=getLastSessionSets(name);
  const sets=lastSets.length>0?lastSets.map(s=>({reps:s.reps,weight:s.weight,done:false})):[{reps:"",weight:"",done:false}];
  const savedTimer=JSON.parse(localStorage.getItem('gt_rest_timer')||'120');
  session.exercises.push({exData,sets,machineUsed:(exData.equipment||[])[0]||null,collapsed:false,restDuration:savedTimer,restRemaining:null,restInterval:null,restConfigMode:false});
  saveSessionToLocal();
  renderExerciseList();
  setTimeout(()=>{ const cards=document.querySelectorAll(".exercise-card,.exercise-card-collapsed"); if(cards.length) cards[cards.length-1].scrollIntoView({behavior:"smooth",block:"start"}); },50);
}

function getLastSessionSets(name){ const m=workouts.filter(w=>w.exercise===name&&w.sets_detail?.length); if(!m.length) return []; m.sort((a,b)=>b.date.localeCompare(a.date)); return m[0].sets_detail||[]; }

function getPRInfo(name){
  const entries=workouts.filter(w=>w.exercise===name); if(!entries.length) return null;
  let prW=0,prR=0;
  entries.forEach(e=>{ (e.sets_detail||(e.weight?[{weight:e.weight,reps:e.reps||0}]:[])).forEach(s=>{ if((s.weight||0)>prW){prW=s.weight;prR=s.reps||0;} if((s.reps||0)>prR&&(s.weight||0)>=prW) prR=s.reps||0; }); });
  const sorted=[...entries].sort((a,b)=>b.date.localeCompare(a.date));
  const last=sorted[0]; const ls=last.sets_detail||(last.weight?[{weight:last.weight,reps:last.reps||0}]:[]);
  const h=ls.reduce((a,b)=>(b.weight||0)>(a.weight||0)?b:a,ls[0]||{});
  return {prWeight:prW,prReps:prR,lastWeight:h.weight||0,lastReps:h.reps||0};
}

/* RENDER EXERCISE LIST */
function fmtTimer(secs){
  if(!secs&&secs!==0) return "2:00";
  const m=Math.floor(secs/60), s=secs%60;
  return m+":"+String(s).padStart(2,"0");
}
function parseTimerInput(val){
  const parts=val.split(":").map(Number);
  if(parts.length===2) return (parts[0]||0)*60+(parts[1]||0);
  if(parts.length===1) return parts[0]||0;
  return 0;
}
function startRestTimer(idx){
  const ex=session.exercises[idx];
  if(!ex) return;
  // Always clear any existing interval for this exercise first
  if(restTimers[idx]){ clearInterval(restTimers[idx]); delete restTimers[idx]; }
  // Use Date.now() as clock source so timer survives app switching on iOS/Chrome
  const endTime=Date.now()+(session.exercises[idx].restRemaining*1000);
  restTimers[idx]=setInterval(()=>{
    const rem=Math.max(0,Math.round((endTime-Date.now())/1000));
    if(!session.exercises[idx]||rem<=0){
      clearInterval(restTimers[idx]); delete restTimers[idx];
      if(session.exercises[idx]) session.exercises[idx].restRemaining=null;
      showToast("Rest done — next set! 💪");
      renderExerciseList();
      return;
    }
    session.exercises[idx].restRemaining=rem;
    const inp=document.getElementById("rest-input-"+idx);
    if(inp){
      inp.value=fmtTimer(rem);
      const color=rem<=10?"#ef4444":rem<=30?"#f59e0b":"#22c55e";
      inp.style.color=color;
      inp.style.borderColor=color+"40";
    }
  },500); // tick every 500ms for accuracy
}

function renderExerciseList(){
  const list=$("exercise-list");
  if(!session.exercises.length){ list.innerHTML=""; return; }
  list.innerHTML=session.exercises.map((item,idx)=>item.collapsed?buildCollapsedCard(item,idx):buildExerciseCard(item,idx)).join("");
  bindExerciseCardEvents();
  setTimeout(initAllMuscleDiagrams, 50);
}

function bindExerciseCardEvents(){
  const list=$("exercise-list");
  list.querySelectorAll(".set-input").forEach(inp=>{ inp.addEventListener("change",e=>{ const {exIdx,setIdx,field}=e.target.dataset; session.exercises[exIdx].sets[setIdx][field]=e.target.value?parseFloat(e.target.value):""; saveSessionToLocal(); }); });
  list.querySelectorAll(".set-check").forEach(btn=>{ btn.addEventListener("click",e=>{ const {exIdx,setIdx}=e.target.dataset; const ex=session.exercises[exIdx]; ex.sets[setIdx].done=!ex.sets[setIdx].done; saveSessionToLocal(); if(ex.sets[setIdx].done&&ex.restDuration){ clearInterval(ex.restInterval); ex.restInterval=null; ex.restRemaining=ex.restDuration; renderExerciseList(); startRestTimer(parseInt(exIdx)); } else { renderExerciseList(); } }); });
  list.querySelectorAll(".add-set-btn").forEach(btn=>{ btn.addEventListener("click",e=>{ const idx=parseInt(e.target.dataset.exIdx); const last=session.exercises[idx].sets.slice(-1)[0]; session.exercises[idx].sets.push({reps:last?.reps||"",weight:last?.weight||"",done:false}); saveSessionToLocal(); renderExerciseList(); }); });
  list.querySelectorAll(".set-del-btn").forEach(btn=>{ btn.addEventListener("click",e=>{ const {exIdx,setIdx}=e.target.dataset; session.exercises[exIdx].sets.splice(parseInt(setIdx),1); saveSessionToLocal(); renderExerciseList(); }); });
  list.querySelectorAll(".exercise-card-del,.collapsed-del-btn").forEach(btn=>{ btn.addEventListener("click",e=>{ session.exercises.splice(parseInt(e.target.dataset.exIdx),1); saveSessionToLocal(); renderExerciseList(); }); });
  list.querySelectorAll(".exercise-save-btn").forEach(btn=>{ btn.addEventListener("click",e=>{ const idx=parseInt(e.target.dataset.exIdx); session.exercises[idx].collapsed=true; saveSessionToLocal(); renderExerciseList(); }); });

  list.querySelectorAll(".collapsed-expand-btn").forEach(btn=>{ btn.addEventListener("click",e=>{ const idx=parseInt(e.target.dataset.exIdx); session.exercises[idx].collapsed=false; saveSessionToLocal(); renderExerciseList(); }); });
  list.querySelectorAll(".machine-radio").forEach(radio=>{ radio.addEventListener("change",e=>{ const {exIdx}=e.target.dataset; session.exercises[exIdx].machineUsed=e.target.value; saveSessionToLocal(); }); });

  // Rest timer action buttons
  list.querySelectorAll(".rest-side-action").forEach(btn=>{
    btn.addEventListener("click",e=>{
      const idx=parseInt(e.target.dataset.exIdx);
      const action=e.target.dataset.action;
      const ex=session.exercises[idx];
      if(action==="restore"){
        ex.restDuration=120; ex.restRemaining=null; ex.restConfigMode=false;
        localStorage.setItem("gt_rest_timer","120");
        renderExerciseList();
      } else if(action==="skip"){
        if(restTimers[idx]){ clearInterval(restTimers[idx]); delete restTimers[idx]; }
        ex.restRemaining=null;
        renderExerciseList();
      } else if(action==="remove"){
        ex.restDuration=null; localStorage.setItem("gt_rest_timer","null");
        renderExerciseList();
      } else if(action==="config"){
        ex.restConfigMode=true; renderExerciseList();
        setTimeout(()=>{ const inp=document.getElementById("rest-input-"+idx); if(inp){ inp.removeAttribute("readonly"); inp.focus(); inp.select(); } },50);
      } else if(action==="save"){
        const inp=document.getElementById("rest-input-"+idx);
        if(inp){
          const val=inp.value.trim();
          const secs=parseTimerInput(val);
          if(secs>0){
            ex.restDuration=secs;
            localStorage.setItem("gt_rest_timer",String(secs));
          }
        }
        ex.restConfigMode=false; renderExerciseList();
      }
    });
  });

  // Auto-format rest timer input
  list.querySelectorAll(".rest-timer-input").forEach(inp=>{
    inp.addEventListener("input",e=>{
      let v=e.target.value.replace(/\D/g,"");
      if(v.length>4) v=v.slice(0,4);
      if(v.length>=3) v=v.slice(0,2)+":"+v.slice(2);
      e.target.value=v;
    });
  });

  // Restart timers for active exercises after re-render
  // Timers continue running independently — no restart needed
}

function buildExerciseCard(item,idx){
  const {exData,sets,machineUsed}=item;
  const pr=getPRInfo(exData.name);
  const diagramHTML=buildMuscleDiagram(exData.muscles||[], "muscle-"+idx);
  const legendHTML=(exData.muscles||[]).map(m=>{ const c=MUSCLE_COLORS[m]||"#888"; return `<div class="muscle-legend-row"><span class="muscle-dot" style="background:${c}"></span>${m}</div>`; }).join("");
  const equipList=exData.equipment||[];
  let machineHTML="";
  if(equipList.length===1) machineHTML=`<div class="machine-section"><div class="machine-label">Equipment</div><div class="machine-single">${equipList[0]}</div></div>`;
  else if(equipList.length>1) machineHTML=`<div class="machine-section"><div class="machine-label">Equipment used</div><div class="machine-radios">${equipList.map(eq=>`<label class="machine-radio-item"><input type="radio" class="machine-radio" name="machine_${idx}" value="${eq}" data-ex-idx="${idx}" ${(machineUsed||equipList[0])===eq?"checked":""}>${eq}</label>`).join("")}</div></div>`;
  const prHTML=pr?`<div class="pr-strip"><div class="pr-item"><span class="pr-label">Last session</span><span class="pr-value">${pr.lastWeight?pr.lastWeight+"kg × "+pr.lastReps:"—"}</span></div><div class="pr-divider"></div><div class="pr-item"><span class="pr-label">All-time PR</span><span class="pr-value">${pr.prWeight?pr.prWeight+"kg × "+pr.prReps:"—"}</span></div></div>`:"";
  const setsHTML=sets.map((set,sIdx)=>`<div class="set-row ${set.done?"completed":""}"><span class="set-num">${sIdx+1}</span><input class="set-input" type="number" min="0" max="999" step="1" value="${set.reps||""}" placeholder="—" data-ex-idx="${idx}" data-set-idx="${sIdx}" data-field="reps"/><input class="set-input" type="number" min="0" max="9999" step="0.5" value="${set.weight||""}" placeholder="—" data-ex-idx="${idx}" data-set-idx="${sIdx}" data-field="weight"/><button class="set-check ${set.done?"done":""}" data-ex-idx="${idx}" data-set-idx="${sIdx}">✓</button><button class="set-del-btn" data-ex-idx="${idx}" data-set-idx="${sIdx}" title="Remove set">✕</button></div>`).join("");

  // Rest timer
  const isConfig=item.restConfigMode||false;
  const isActive=item.restRemaining!==null&&item.restRemaining>0;
  const restSecs=isActive?item.restRemaining:(item.restDuration||120);
  const restVal=fmtTimer(restSecs);
  const restColor=isActive?(item.restRemaining<=10?"#ef4444":item.restRemaining<=30?"#f59e0b":"#22c55e"):"";
  const leftLabel=isActive?"Skip":isConfig?"Remove":"Remove";
  const rightLabel=isActive?"Config":isConfig?"Save":"Configure";
  const leftAction=isActive?"skip":"remove";
  const rightAction=isActive?"config":isConfig?"save":"config";
  const restTimerHTML=item.restDuration===null?`<div class="rest-timer-row"><button class="rest-side-action muted" data-action="restore" data-ex-idx="${idx}">+ Add rest timer</button></div>`:
    `<div class="rest-timer-row">
      <button class="rest-side-action muted" data-action="${leftAction}" data-ex-idx="${idx}">${leftLabel}</button>
      <input class="rest-timer-input" id="rest-input-${idx}"
        value="${restVal}"
        ${isActive||!isConfig?"readonly":""}
        style="${restColor?`color:${restColor};border-color:${restColor}40`:""}"
        data-ex-idx="${idx}"
        inputmode="numeric"
        maxlength="5"
      />
      <button class="rest-side-action muted" data-action="${rightAction}" data-ex-idx="${idx}">${rightLabel}</button>
    </div>`;

  return `<div class="exercise-card"><div class="exercise-card-header"><span class="exercise-card-name">${exData.name}</span><div class="exercise-card-actions"><button class="exercise-card-del" data-ex-idx="${idx}">✕</button></div></div><div class="muscle-section"><div class="muscle-diagrams">${diagramHTML}</div><div class="muscle-legend"><div class="muscle-legend-title">Muscles</div>${legendHTML}<div class="equip-section">${(exData.equipment||[]).map(e=>`<div class="equip-row"><span class="equip-dot"></span>${e}</div>`).join("")}</div></div></div>${machineHTML}${prHTML}<div class="sets-header"><span>Set</span><span>Reps</span><span>kg</span><span></span><span></span></div>${setsHTML}<div class="add-set-row"><button class="add-set-btn" data-ex-idx="${idx}">+ Add set</button></div>${restTimerHTML}<div class="save-ex-row"><button class="exercise-save-btn" data-ex-idx="${idx}">✓ Save exercise</button></div></div>`;
}

function buildCollapsedCard(item,idx){
  const {exData,sets}=item;
  const pr=getPRInfo(exData.name);
  const completedSets=sets.filter(s=>s.done||s.reps||s.weight);
  const doneSets=sets.filter(s=>s.done).length;
  const sessionMaxW=completedSets.length?Math.max(...completedSets.map(s=>s.weight||0)):0;
  const sessionMaxR=sessionMaxW?completedSets.find(s=>(s.weight||0)===sessionMaxW)?.reps||0:0;
  const isNewPR=pr&&sessionMaxW>pr.prWeight;
  const miniDiagramHTML=buildMuscleDiagram(exData.muscles||[], "cmuscle-"+idx);
  const pillsHTML=completedSets.map((s,i)=>`<span class="collapsed-pill ${s.done?"done":""}">${i+1}. ${s.reps||"—"}r · ${s.weight||"—"}kg</span>`).join("");
  const prTrophy=pr?`<div class="collapsed-stat-trophy">🏆</div>`:"";
  const prBadge=isNewPR?`<span class="collapsed-stat-badge new">↑ New PR!</span>`:pr?`<span class="collapsed-stat-badge pr">PR</span>`:"";
  return `<div class="exercise-card-collapsed">
    <div class="collapsed-header">
      <span class="collapsed-name">${exData.name}</span>
      <div class="collapsed-actions">
        <button class="collapsed-expand-btn" data-ex-idx="${idx}">Expand</button>
        <button class="collapsed-del-btn" data-ex-idx="${idx}">✕</button>
      </div>
    </div>
    <div class="collapsed-body">
      <div class="collapsed-svg-col"><div class="collapsed-svgs">${miniDiagramHTML}</div></div>
      <div class="collapsed-stats">
        <div class="collapsed-stat">
          <div class="collapsed-stat-label">Session max</div>
          <div class="collapsed-stat-value">${sessionMaxW?sessionMaxW+"kg":"—"}</div>
          <div class="collapsed-stat-sub">${sessionMaxR?sessionMaxR+" reps":""}</div>
        </div>
        <div class="collapsed-stat-divider"></div>
        <div class="collapsed-stat">
          ${prTrophy}
          <div class="collapsed-stat-label">All-time PR</div>
          <div class="collapsed-stat-value">${pr?.prWeight?pr.prWeight+"kg":"—"}</div>
          <div class="collapsed-stat-sub">${pr?.prReps?pr.prReps+" reps":""}</div>
          ${prBadge}
        </div>
        <div class="collapsed-stat-divider"></div>
        <div class="collapsed-stat">
          <div class="collapsed-stat-label">Sets done</div>
          <div class="collapsed-stat-value green">${doneSets}/${sets.length}</div>
          <div class="collapsed-stat-sub">completed</div>
        </div>
      </div>
    </div>
    ${pillsHTML?`<div class="collapsed-pills">${pillsHTML}</div>`:""}
  </div>`;
}

/* FINISH / DISCARD */
let _finishing=false;
async function finishSession(){
  if(_finishing) return;
  _finishing=true;
  clearInterval(session.timerInterval);
  const duration=Math.floor((Date.now()-session.startTime)/1000);
  const sessionId=Date.now();
  const toInsert=[];
  session.exercises.forEach(item=>{
    const completed=item.sets.filter(s=>s.done||s.reps||s.weight);
    if(!completed.length) return;
    toInsert.push({id:sessionId*1000+toInsert.length+Math.floor(Math.random()*100),sessionId,type:"workout",date:session.date,day:session.day,exercise:item.exData.name,muscles:item.exData.muscles,equipment:item.exData.equipment,sets_detail:completed,sets:completed.length,reps:completed[0]?.reps||null,weight:completed[0]?.weight||null,duration,machineUsed:item.machineUsed||null});
  });
  // Save first, then update UI
  let saveSuccess=false;
  try{
    // Insert with upsert to handle any duplicates gracefully
    await Promise.all(toInsert.map(e=>insertWorkout(e)));
    workouts=[...toInsert.map(normalizeWorkout),...workouts];
    saveSuccess=true;
  } catch(e){ console.error(e); _finishing=false; showToast("Error saving — check connection"); }
  _finishing=false;
  if(saveSuccess){
    clearSessionLocal();
    showToast(`Session saved — ${toInsert.length} exercise${toInsert.length!==1?"s":""} logged 💪`);
    resetSession();
    renderCalendar();
    renderRecords();
    renderHistory();
  }
}
function discardSession(){ if(!confirm("Discard this session?")) return; clearInterval(session.timerInterval); clearSessionLocal(); showToast("Session discarded"); resetSession(); }
function resetSession(){ session={active:false,day:"",date:"",startTime:null,timerInterval:null,exercises:[]}; $("workout-session").classList.add("hidden"); $("workout-setup").classList.remove("hidden"); $("w-day").value=""; $("start-session-btn").disabled=true; setDefaultDates(); $("exercise-list").innerHTML=""; $("exercise-picker").classList.add("hidden"); }

/* RUN FORM */
function bindRunForm(){
  $("run-form").addEventListener("submit",saveRun);
  $("r-date").addEventListener("change",()=>updateDateDisplay("r-date","r-date-display"));
  $("r-time").addEventListener("input",autoFormatTime);
  $("add-km-btn").addEventListener("click",addKmRow);
  $("r-distance").addEventListener("input",updateKmBtnState);
  $("discard-run-btn").addEventListener("click",discardRun);
}
function discardRun(){
  if(!confirm("Discard this run?")) return;
  $("run-form").reset();
  kmRows=[]; $("km-tbody").innerHTML="";
  setDefaultDates(); updateKmBtnState();
  showToast("Run discarded");
}
function autoFormatPace(el){ let v=el.value.replace(/\D/g,""); if(v.length>4) v=v.slice(0,4); if(v.length>=3) v=v.slice(0,2)+":"+v.slice(2); el.value=v; }
function autoFormatTime(e){ let v=e.target.value.replace(/\D/g,""); if(v.length>=5) v=v.slice(0,2)+":"+v.slice(2,4)+":"+v.slice(4,6); else if(v.length>=3) v=v.slice(0,2)+":"+v.slice(2); e.target.value=v; }

function getMaxKmRows(){
  const dist=parseFloat($("r-distance").value)||0;
  if(!dist) return 0;
  const full=Math.floor(dist);
  const hasPartial=dist>full;
  return hasPartial?full+1:full;
}
function updateKmBtnState(){
  const dist=parseFloat($("r-distance").value)||0;
  const max=getMaxKmRows();
  const btn=$("add-km-btn");
  if(!btn) return;
  if(!dist||!max){ btn.disabled=true; btn.textContent="+ Add km (enter distance first)"; }
  else if(kmRows.length>=max){ btn.disabled=true; btn.textContent="All km added"; }
  else {
    btn.disabled=false;
    const nextNum=kmRows.length+1;
    const full=Math.floor(dist);
    const isPartial=nextNum>full;
    const label=isPartial?dist:nextNum;
    btn.textContent=`+ Add km ${label}`;
  }
}
function addKmRow(){
  const dist=parseFloat($("r-distance").value)||0;
  const max=getMaxKmRows();
  if(!dist){ showToast("Enter distance first"); return; }
  if(kmRows.length>=max){ showToast("Max km reached"); return; }
  const nextNum=kmRows.length+1;
  const full=Math.floor(dist);
  const isPartial=nextNum>full;
  const label=isPartial?dist:nextNum;
  kmRows.push({km:label,partial:isPartial,pace:"",hr:""});
  renderKmTable();
  updateKmBtnState();
}
function renderKmTable(){
  const tbody=$("km-tbody");
  tbody.innerHTML=kmRows.map((row,i)=>`
    <tr>
      <td class="km-cell-num ${row.partial?"partial":""}">${row.km}</td>
      <td><input class="km-input" type="text" placeholder="5:00" maxlength="5" value="${row.pace||""}" data-idx="${i}" data-field="pace" inputmode="numeric" oninput="autoFormatPace(this)" onchange="kmRows[${i}].pace=this.value" /></td>
      <td><input class="km-input" type="number" placeholder="150" min="0" max="250" value="${row.hr||""}" data-idx="${i}" data-field="hr" onchange="kmRows[${i}].hr=this.value" /></td>
      <td><button class="km-del-btn" onclick="deleteKmRow(${i})">✕</button></td>
    </tr>`).join("");
}
function deleteKmRow(idx){ kmRows.splice(idx,1); const dist=parseFloat($("r-distance").value)||0; const full=Math.floor(dist); kmRows.forEach((r,i)=>{ r.km=i+1>full?dist:i+1; r.partial=i+1>full; }); renderKmTable(); updateKmBtnState(); }

async function saveRun(e){
  e.preventDefault();
  const shoeId=$("r-shoe").value;
  const shoe=shoes.find(s=>s.id==shoeId);
  const dist=parseFloat($("r-distance").value)||0;
  const entry={id:Date.now(),type:"run",title:$("r-title").value.trim()||null,date:$("r-date").value,distance:dist||null,time:$("r-time").value.trim(),location:$("r-location").value.trim(),shoeId:shoeId||null,shoeName:shoe?`${shoe.brand} ${shoe.model}`:null,notes:$("r-notes").value.trim(),kmSplits:kmRows.length>0?kmRows.map(r=>({km:r.km,pace:r.pace,hr:r.hr?parseInt(r.hr):null})):null};
  try{
    await insertRun(entry); runs.unshift(entry);
    if(shoe&&dist){ const newKm=(shoe.km||0)+dist; await updateShoe(shoe.id,{km:newKm}); shoe.km=newKm; renderShoes(); }
    showToast("Run saved! 🏃"); $("run-form").reset(); $("r-title").value=""; kmRows=[]; $("km-tbody").innerHTML=""; setDefaultDates(); updateKmBtnState(); renderCalendar(); renderHistory(); renderRunPRs();
  } catch(err){ console.error(err); showToast("Error saving run — check connection"); }
}

/* RUNNING PRs */
function renderRunPRs(){
  const grid=$("run-pr-grid");
  // All-time max distance
  const maxRun=runs.length?runs.reduce((a,b)=>((b.distance||0)>(a.distance||0)?b:a),runs[0]):null;
  const cards=[...RUN_DISTANCES.map(d=>{
    const pr=getBestRunForDistance(d.km);
    return `<div class="run-pr-card ${pr?"has-data":""}">
      <div class="run-pr-dist ${pr?"active":""}">${d.label}</div>
      <div class="run-pr-divider ${pr?"active":""}"></div>
      ${pr?`<div class="run-pr-time">${pr.time}</div><div class="run-pr-sub">${pr.avgPace?pr.avgPace+" /km":""} ${pr.avgHR?"· "+pr.avgHR+" bpm":""}</div><div class="run-pr-sub">${formatDate(pr.date)}</div>`:`<div class="run-pr-time empty">—</div><div class="run-pr-sub">No entry</div>`}
    </div>`;
  }),
  // Max distance card
  `<div class="run-pr-card max-dist ${maxRun?"has-data":""}">
    <div class="run-pr-dist max">Max</div>
    <div class="run-pr-divider max"></div>
    ${maxRun&&maxRun.distance?`<div class="run-pr-time">${maxRun.distance}km</div><div class="run-pr-sub">${formatDate(maxRun.date)}</div>`:`<div class="run-pr-time empty">—</div><div class="run-pr-sub">No entry</div>`}
  </div>`];
  grid.innerHTML=cards.join("");
}
function getBestRunForDistance(targetKm){
  const tol=targetKm*0.05;
  const candidates=runs.filter(r=>r.distance&&Math.abs(r.distance-targetKm)<=tol);
  if(!candidates.length) return null;
  candidates.sort((a,b)=>timeToSecs(a.time)-timeToSecs(b.time));
  const best=candidates[0];
  const avgPace=best.time&&best.distance?calcPace(best.time,best.distance):null;
  const splits=(best.km_splits||best.kmSplits||[]);
  const hrs=splits.map(s=>s.hr).filter(Boolean);
  const avgHR=hrs.length?Math.round(hrs.reduce((a,b)=>a+b,0)/hrs.length):null;
  return {time:best.time,date:best.date,avgPace,avgHR};
}
function timeToSecs(t){ if(!t) return Infinity; const p=t.split(":").map(Number); return(p[0]||0)*3600+(p[1]||0)*60+(p[2]||0); }

/* HISTORY — date grouped *//* ── BODY HIGHLIGHTER ── */
let _bodyHighlighter = null;
function getBodyHighlighter() {
  if(typeof createBodyHighlighter !== "undefined") return createBodyHighlighter;
  // Try window scope
  if(window.bodyHighlighter) return window.bodyHighlighter.createBodyHighlighter;
  return null;
}

function buildMuscleDiagram(muscles, containerId) {
  // Returns HTML string with two divs for front/back
  // The actual highlighter is initialized after insertion via initMuscleDiagram()
  const frontId = containerId + "-front";
  const backId  = containerId + "-back";
  return `<div class="diagram-col">
    <div id="${frontId}" class="bh-container"></div>
    <span class="view-label">Front</span>
  </div>
  <div class="diagram-col">
    <div id="${backId}" class="bh-container"></div>
    <span class="view-label">Back</span>
  </div>`;
}

function initMuscleDiagram(muscles, containerId) {
  const create = getBodyHighlighter();
  if(!create) return;
  const theme = document.documentElement.getAttribute("data-theme") || "dark";
  const bodyColor = theme === "dark" ? "#3a3a3a" : "#d1d5db";

  // Build unique slug list with colors for front and back
  const frontSlugs = [], backSlugs = [];
  const FRONT_SLUGS = new Set(["chest","front-deltoids","biceps","forearm","abs","obliques","adductor","abductors","quadriceps","knees"]);
  const BACK_SLUGS  = new Set(["back-deltoids","triceps","upper-back","trapezius","lower-back","gluteal","hamstring","calves","left-soleus","right-soleus"]);

  const seen = {};
  muscles.forEach((m, i) => {
    const slug = MUSCLE_TO_SLUG[m];
    const color = MUSCLE_COLORS[m] || "#888";
    if(!slug) return;
    const key = slug;
    if(!seen[key]) {
      seen[key] = { slug, color, idx: Object.keys(seen).length };
      if(FRONT_SLUGS.has(slug)) frontSlugs.push({ slug, color });
      if(BACK_SLUGS.has(slug))  backSlugs.push({ slug, color });
      // side delts appear on both
      if(m === "Side delts") {
        if(!frontSlugs.find(s=>s.slug===slug)) frontSlugs.push({ slug, color });
        if(!backSlugs.find(s=>s.slug===slug))  backSlugs.push({ slug, color });
      }
    }
  });

  const style = { width: "52px", background: "transparent", padding: "0" };

  ["front","back"].forEach(side => {
    const id = containerId + "-" + side;
    const el = document.getElementById(id);
    if(!el) return;
    el.innerHTML = "";
    const slugs = side === "front" ? frontSlugs : backSlugs;
    const data = slugs.map((s, i) => ({ name: s.slug, muscles: [s.slug], frequency: i + 1 }));
    const hColors = slugs.map(s => s.color);
    try {
      create({ container: el, data, highlightedColors: hColors.length ? hColors : ["#888"], bodyColor, side, gender: "male", style });
      // Fix body color for dark mode
      el.querySelectorAll("polygon, path").forEach(p => {
        const fill = p.style.fill;
        if(fill && (fill.includes("182, 189") || fill.includes("b6bdc3"))) {
          p.style.fill = bodyColor;
        }
      });
    } catch(e) { console.warn("body-highlighter error:", e); }
  });
}

function initAllMuscleDiagrams() {
  session.exercises.forEach((item, idx) => {
    if(!item.collapsed) {
      initMuscleDiagram(item.exData.muscles || [], "muscle-" + idx);
    } else {
      initMuscleDiagram(item.exData.muscles || [], "cmuscle-" + idx);
    }
  });
}
