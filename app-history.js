function bindHistory(){ $("filter-type").addEventListener("change",renderHistory); $("filter-day").addEventListener("change",renderHistory); }

function renderHistory(){
  const tf=$("filter-type").value, df=$("filter-day").value;

  // Group workouts by sessionId into sessions
  const sessionMap={};
  workouts.forEach(w=>{
    if(tf==="run") return;
    if(df!=="all"&&w.day!==df) return;
    const key=w.sessionId?String(w.sessionId):`${w.date}_${w.day}`;
    if(!sessionMap[key]) sessionMap[key]={key,type:"workout",date:w.date,day:w.day,duration:w.duration||null,exercises:[],_id:w.sessionId||0};
    sessionMap[key].exercises.push(w);
  });

  // Build per-date map — each date has an array of activities (workout sessions + runs)
  const byDate={};

  Object.values(sessionMap).forEach(s=>{
    if(!byDate[s.date]) byDate[s.date]=[];
    byDate[s.date].push({...s,_id:s._id||0});
  });

  if(tf!=="workout"){
    runs.forEach(r=>{
      if(!byDate[r.date]) byDate[r.date]=[];
      const rn={...r,shoeId:r.shoe_id||r.shoeId,shoeName:r.shoe_name||r.shoeName,type:"run",_id:r.id};
      byDate[r.date].push(rn);
    });
  }

  // Sort activities within each day by session/run ID ascending (order logged)
  Object.values(byDate).forEach(arr=>arr.sort((a,b)=>Number(a._id)-Number(b._id)));

  const list=$("history-list");
  const sortedDates=Object.keys(byDate).sort((a,b)=>b.localeCompare(a));

  if(!sortedDates.length){ list.innerHTML=`<div class="empty-state"><div class="empty-icon">📭</div><p>No entries yet. Start logging!</p></div>`; return; }

  list.innerHTML=sortedDates.map(date=>{
    const dateItems=byDate[date];
    // Use date as the expand key so one click expands the whole day
    const dayKey="day_"+date;
    const isOpen=expandedSessions.has(dayKey);

    // Collapsed preview: show pills for all activities
    const previewPills=dateItems.map(item=>{
      if(item.type==="run") return `<span class="preview-pill">🏃 Run${item.distance?" · "+item.distance+"km":""}</span>`;
      return `<span class="preview-pill">${item.day}</span>`;
    }).join("");

    // Expanded: show each activity in order
    const bodyItems=dateItems.map(item=>{
      if(item.type==="run") return renderRunDayItem(item);
      return renderWorkoutDayItem(item);
    }).join("");

    // Summary badges
    const workoutCount=dateItems.filter(i=>i.type==="workout").length;
    const runCount=dateItems.filter(i=>i.type==="run").length;
    const badges=[];
    if(workoutCount) badges.push(`<span class="badge accent">${workoutCount} workout${workoutCount!==1?"s":""}</span>`);
    if(runCount) badges.push(`<span class="badge blue">${runCount} run${runCount!==1?"s":""}</span>`);

    return `<div class="date-group">
      <div class="session-card" style="border-left:none">
        <div class="session-card-header" data-key="${dayKey}">
          <div class="session-card-left">
            <div class="session-card-title">${formatDate(date)}</div>
            <div class="session-card-meta">${badges.join("")}</div>
          </div>
          <div class="session-card-right"><span class="session-chevron ${isOpen?"open":""}">▾</span></div>
        </div>
        ${isOpen
          ? `<div class="session-card-body">${bodyItems}</div>`
          : `<div class="session-card-preview">${previewPills}</div>`
        }
      </div>
    </div>`;
  }).join("");

  list.querySelectorAll(".session-card-header").forEach(h=>{ h.addEventListener("click",()=>{ const k=h.dataset.key; if(expandedSessions.has(k)) expandedSessions.delete(k); else expandedSessions.add(k); renderHistory(); }); });
  list.querySelectorAll(".history-delete").forEach(btn=>{ btn.addEventListener("click",e=>{ e.stopPropagation(); deleteEntry(btn.dataset.id,btn.dataset.type,btn.dataset.sessionId); }); });
}

function renderWorkoutDayItem(s){
  const dur=s.duration?fmtDuration(s.duration):null;
  const setsHTML=s.exercises.map(ex=>{
    const sets=ex.sets_detail||[];
    return `<div class="day-item-exercise">
      <div class="day-item-ex-header">
        <span class="day-item-ex-name">${ex.exercise}</span>
        <span class="day-item-ex-meta">${sets.length} set${sets.length!==1?"s":""}</span>
      </div>
      <div class="day-item-ex-sets">${sets.map(s=>`<span class="day-set-pill">${s.reps||"—"}r · ${s.weight||"—"}kg</span>`).join("")}</div>
    </div>`;
  }).join("");
  return `<div class="day-item workout-item">
    <div class="day-item-header">
      <div class="day-item-title">${s.day}${dur?` <span class="day-item-duration">${dur}</span>`:""}</div>
      <button class="history-delete" style="opacity:1;position:static;font-size:0.72rem;color:var(--muted)" data-id="${s.exercises[0]?.id}" data-type="workout-session" data-session-id="${s.key}">Delete</button>
    </div>
    ${setsHTML}
  </div>`;
}

function renderRunDayItem(r){
  const pace=r.distance&&r.time?calcPace(r.time,r.distance):null;
  const splits=r.km_splits||r.kmSplits||[];
  const hrs=splits.map(s=>s.hr).filter(Boolean);
  const avgHR=hrs.length?Math.round(hrs.reduce((a,b)=>a+b,0)/hrs.length):null;
  const sn=r.shoeName||r.shoe_name;
  return `<div class="day-item run-item">
    <div class="day-item-header">
      <div class="day-item-title">${r.title||"Run"}</div>
      <button class="history-delete" style="opacity:1;position:static;font-size:0.72rem;color:var(--muted)" data-id="${r.id}" data-type="run">Delete</button>
    </div>
    <div class="run-kv">
      <div class="run-kv-item"><div class="run-kv-val">${r.distance?r.distance+" km":"—"}</div><div class="run-kv-lbl">Distance</div></div>
      <div class="run-kv-item"><div class="run-kv-val">${r.time||"—"}</div><div class="run-kv-lbl">Time</div></div>
      <div class="run-kv-item"><div class="run-kv-val">${pace||"—"}</div><div class="run-kv-lbl">Avg pace</div></div>
      <div class="run-kv-item"><div class="run-kv-val">${avgHR?avgHR+" bpm":"—"}</div><div class="run-kv-lbl">Avg HR</div></div>
    </div>
    ${r.location||sn?`<div class="run-sub-pills" style="margin-top:6px">${r.location?`<span class="run-sub-pill">📍 ${r.location}</span>`:""} ${sn?`<span class="run-sub-pill">👟 ${sn}</span>`:""}</div>`:""}
    ${splits.length?`<div style="margin-top:6px;border:1px solid var(--border);border-radius:6px;overflow:hidden"><table style="width:100%;border-collapse:collapse;font-size:0.75rem"><thead><tr style="background:var(--bg3)"><th style="padding:4px 8px;text-align:center;color:var(--muted)">Km</th><th style="padding:4px 8px;text-align:center;color:var(--muted)">Pace</th><th style="padding:4px 8px;text-align:center;color:var(--muted)">HR</th></tr></thead><tbody>${splits.map(s=>`<tr style="border-top:1px solid var(--border)"><td style="padding:4px 8px;text-align:center;font-weight:700;color:var(--text)">${s.km}</td><td style="padding:4px 8px;text-align:center;color:var(--muted)">${s.pace||"—"}</td><td style="padding:4px 8px;text-align:center;color:var(--muted)">${s.hr||"—"}</td></tr>`).join("")}</tbody></table></div>`:""}
    ${r.notes?`<div style="font-size:0.78rem;color:var(--muted);font-style:italic;margin-top:6px">${r.notes}</div>`:""}
  </div>`;
}

function renderWorkoutSessionCard(s,sessionNum){
  const key=s.key,isOpen=expandedSessions.has(key),dur=s.duration?fmtDuration(s.duration):null;
  const title=sessionNum?`${s.day} — Session ${sessionNum}`:s.day;
  const previewHTML=`<div class="session-card-preview">${s.exercises.map(e=>`<span class="preview-pill">${e.exercise}</span>`).join("")}</div>`;
  const bodyHTML=`<div class="session-card-body">${s.exercises.map(ex=>{ const sets=ex.sets_detail||[]; return `<div class="session-exercise-row"><div><div class="session-ex-name">${ex.exercise}</div><div class="session-ex-muscles">${(ex.muscles||[]).slice(0,3).join(" · ")}</div></div><div class="session-ex-sets"><div class="session-ex-set-label">${sets.length} set${sets.length!==1?"s":""}</div>${sets.map(s=>`<div class="session-ex-set-row">${s.reps||"—"} × ${s.weight||"—"}kg</div>`).join("")}</div></div>`; }).join("")}<div style="padding:8px 16px;text-align:right"><button class="history-delete" style="opacity:1;position:static;font-size:0.75rem;color:var(--muted)" data-id="${s.exercises[0]?.id}" data-type="workout-session" data-session-id="${key}">Delete session</button></div></div>`;
  return `<div class="session-card workout-session"><div class="session-card-header" data-key="${key}"><div class="session-card-left"><div class="session-card-title">${title}</div><div class="session-card-meta"><span class="badge accent">${s.exercises.length} exercise${s.exercises.length!==1?"s":""}</span>${dur?`<span class="badge">${dur}</span>`:""}</div></div><div class="session-card-right"><span class="session-chevron ${isOpen?"open":""}">▾</span></div></div>${isOpen?bodyHTML:previewHTML}</div>`;
}

function renderRunSessionCard(r){
  const key=String(r.id),isOpen=expandedSessions.has(key),pace=r.distance&&r.time?calcPace(r.time,r.distance):null,sn=r.shoeName||r.shoe_name;
  const splits=r.km_splits||r.kmSplits||[];
  const previewHTML=`<div class="session-card-preview">${r.location?`<span class="preview-pill">📍 ${r.location}</span>`:""} ${pace?`<span class="preview-pill">${pace} /km</span>`:""} ${sn?`<span class="preview-pill">👟 ${sn}</span>`:""}</div>`;
  const splitsHTML=splits.length?`<div style="padding:0 16px 10px"><table class="km-table" style="font-size:0.78rem"><thead><tr><th>Km</th><th>Pace</th><th>HR</th></tr></thead><tbody>${splits.map(s=>`<tr><td class="km-cell-num ${s.km!==Math.floor(s.km)?"partial":""}">${s.km}</td><td style="padding:4px 8px;text-align:center">${s.pace||"—"}</td><td style="padding:4px 8px;text-align:center">${s.hr||"—"}</td></tr>`).join("")}</tbody></table></div>`:"";
  // Compute avg HR from splits
  const splits2=r.km_splits||r.kmSplits||[];
  const hrs2=splits2.map(s=>s.hr).filter(Boolean);
  const avgHR2=hrs2.length?Math.round(hrs2.reduce((a,b)=>a+b,0)/hrs2.length):null;
  const bodyHTML=`<div class="session-card-body">
    <div class="run-stats-grid">
      <div class="run-stat-cell">
        <div class="run-stat-val">${r.distance?r.distance+" km":"—"}</div>
        <div class="run-stat-lbl">Distance</div>
      </div>
      <div class="run-stat-cell">
        <div class="run-stat-val">${r.time||"—"}</div>
        <div class="run-stat-lbl">Time</div>
      </div>
      <div class="run-stat-cell">
        <div class="run-stat-val">${pace||"—"}</div>
        <div class="run-stat-lbl">Avg pace /km</div>
      </div>
      <div class="run-stat-cell">
        <div class="run-stat-val">${avgHR2?avgHR2+" bpm":"—"}</div>
        <div class="run-stat-lbl">Avg HR</div>
      </div>
    </div>
    ${r.location?`<div style="padding:8px 16px;font-size:0.82rem;color:var(--muted);border-top:1px solid var(--border)">📍 ${r.location}</div>`:""}
    ${sn?`<div style="padding:4px 16px 8px;font-size:0.82rem;color:var(--muted)">👟 ${sn}</div>`:""}
    ${splitsHTML}
    ${r.notes?`<div style="padding:8px 16px 10px;font-size:0.82rem;color:var(--muted);font-style:italic;border-top:1px solid var(--border)">${r.notes}</div>`:""}
    <div style="padding:8px 16px;text-align:right;border-top:1px solid var(--border)">
      <button class="history-delete" style="opacity:1;position:static;font-size:0.75rem;color:var(--muted)" data-id="${r.id}" data-type="run">Delete</button>
    </div>
  </div>`;
  return `<div class="session-card run-session"><div class="session-card-header" data-key="${key}"><div class="session-card-left"><div class="session-card-title">🏃 Run</div><div class="session-card-meta">${r.distance?`<span class="badge blue">${r.distance} km</span>`:""} ${r.time?`<span class="badge">${r.time}</span>`:""}</div></div><div class="session-card-right"><span class="session-chevron ${isOpen?"open":""}">▾</span></div></div>${isOpen?bodyHTML:previewHTML}</div>`;
}

async function deleteEntry(id,type,sessionKey){
  try{
    if(type==="workout-session"){ await deleteWorkoutsBySession(sessionKey); workouts=workouts.filter(w=>{ const k=w.sessionId?String(w.sessionId):`${w.date}_${w.day}`; return k!==sessionKey; }); }
    else if(type==="run"){ const run=runs.find(r=>String(r.id)===String(id)); const sid=run?.shoe_id||run?.shoeId; const dist=run?.distance; if(sid&&dist){ const shoe=shoes.find(s=>s.id==sid); if(shoe){ const nk=Math.max(0,(shoe.km||0)-dist); await updateShoe(shoe.id,{km:nk}); shoe.km=nk; renderShoes(); } } await deleteRun(id); runs=runs.filter(r=>String(r.id)!==String(id)); }
    expandedSessions.delete(sessionKey||id); renderHistory(); renderRecords(); renderCalendar(); renderRunPRs();
  } catch(e){ console.error(e); showToast("Error deleting — check connection"); }
}

/* CALENDAR */
let calYear,calMonth;
function bindCalendar(){ const n=new Date(); calYear=n.getFullYear(); calMonth=n.getMonth(); $("cal-prev").addEventListener("click",()=>{ calMonth--; if(calMonth<0){calMonth=11;calYear--;} renderCalendar(); }); $("cal-next").addEventListener("click",()=>{ calMonth++; if(calMonth>11){calMonth=0;calYear++;} renderCalendar(); }); }
function renderCalendar(){
  const months=["January","February","March","April","May","June","July","August","September","October","November","December"];
  $("cal-title").textContent=`${months[calMonth]} ${calYear}`;
  const am={}; workouts.forEach(w=>{am[w.date]=am[w.date]||{};am[w.date].workout=true;}); runs.forEach(r=>{am[r.date]=am[r.date]||{};am[r.date].run=true;});
  const fd=new Date(calYear,calMonth,1).getDay(),dim=new Date(calYear,calMonth+1,0).getDate(),today=new Date().toISOString().split("T")[0];
  let html=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d=>`<div class="cal-day-name">${d}</div>`).join("");
  for(let i=0;i<fd;i++) html+=`<div class="cal-cell empty"><span class="cal-num"></span></div>`;
  for(let d=1;d<=dim;d++){ const ds=`${calYear}-${String(calMonth+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`; const act=am[ds]||{}; let dots=""; if(act.workout&&act.run) dots=`<div class="cal-dot-row"><span class="dot dot-both"></span></div>`; else if(act.workout) dots=`<div class="cal-dot-row"><span class="dot dot-workout"></span></div>`; else if(act.run) dots=`<div class="cal-dot-row"><span class="dot dot-run"></span></div>`; html+=`<div class="cal-cell${ds===today?" today":""}" data-date="${ds}"><span class="cal-num">${d}</span>${dots}</div>`; }
  $("cal-grid").innerHTML=html;
  $("cal-grid").querySelectorAll(".cal-cell[data-date]").forEach(cell=>cell.addEventListener("click",()=>showDayDetail(cell.dataset.date)));
}
function showDayDetail(date){ const dw=workouts.filter(w=>w.date===date),dr=runs.filter(r=>r.date===date),detail=$("cal-detail"); if(!dw.length&&!dr.length){ detail.classList.add("hidden"); return; } let html=`<h3>${formatDate(date)}</h3>`; const seen=new Set(); dw.forEach(w=>{ if(seen.has(w.exercise))return; seen.add(w.exercise); const sets=w.sets_detail||[]; const stats=sets.map((s,i)=>`Set ${i+1}: ${s.reps||"—"}r · ${s.weight||"—"}kg`).join("  "); html+=`<div style="margin-bottom:8px"><span style="font-weight:700;font-size:.9rem">${w.exercise}</span><span style="color:var(--muted);font-size:.78rem;margin-left:8px">${w.day}</span>${stats?`<div style="font-size:.8rem;color:var(--accent2);margin-top:2px">${stats}</div>`:""}</div>`; }); dr.forEach(r=>{ html+=`<div style="margin-bottom:8px"><span style="font-weight:700;font-size:.9rem">🏃 Run</span>${r.distance?`<span style="color:var(--muted);font-size:.78rem;margin-left:8px">${r.distance}km</span>`:""} ${r.time?`<span style="color:var(--muted);font-size:.78rem;margin-left:4px">${r.time}</span>`:""}</div>`; }); detail.innerHTML=html; detail.classList.remove("hidden"); }

/* PERSONAL RECORDS */
function bindRecords(){ $("pr-search").addEventListener("input",renderRecords); }
function renderRecords(){ const q=$("pr-search").value.toLowerCase(),pm={}; workouts.forEach(w=>{ if(!w.exercise)return; if(!pm[w.exercise]) pm[w.exercise]={name:w.exercise,day:w.day,maxWeight:0,maxReps:0,lastWeight:0,lastReps:0,lastDate:""}; const pr=pm[w.exercise]; const sets=w.sets_detail||(w.weight?[{weight:w.weight,reps:w.reps||0}]:[]); sets.forEach(s=>{ if((s.weight||0)>pr.maxWeight){pr.maxWeight=s.weight;pr.maxReps=s.reps||0;} if((s.reps||0)>pr.maxReps&&(s.weight||0)>=pr.maxWeight) pr.maxReps=s.reps||0; }); if(w.date>=pr.lastDate){ pr.lastDate=w.date; const h=sets.reduce((a,b)=>(b.weight||0)>(a.weight||0)?b:a,sets[0]||{}); pr.lastWeight=h.weight||0; pr.lastReps=h.reps||0; } }); let items=Object.values(pm).sort((a,b)=>a.name.localeCompare(b.name)); if(q) items=items.filter(i=>i.name.toLowerCase().includes(q)); const list=$("records-list"); if(!items.length){ list.innerHTML=`<div class="empty-state"><div class="empty-icon">🏆</div><p>${q?"No matching exercises.":"Log workouts to see your PRs here."}</p></div>`; return; } list.innerHTML=items.map(pr=>`<div class="record-card"><div><div class="record-name">${pr.name}</div><div class="record-day">${pr.day||""}</div></div><div class="record-stats"><div><div class="record-stat-label">Last session</div><div class="record-stat-value">${pr.lastWeight?pr.lastWeight+"kg":"—"}</div><div class="record-stat-sub">${pr.lastReps?pr.lastReps+" reps":""} ${pr.lastDate?"· "+formatDate(pr.lastDate):""}</div></div><div><div class="record-stat-label">All-time PR</div><div class="record-stat-value">${pr.maxWeight?pr.maxWeight+"kg":"—"}</div><div class="record-stat-sub">${pr.maxReps?pr.maxReps+" reps max":""}</div></div></div></div>`).join(""); }

/* SHOES */
function bindShoes(){ $("add-shoe-btn").addEventListener("click",()=>{ editingShoeId=null; $("shoe-form-title").textContent="Add shoe"; $("shoe-brand").value=""; $("shoe-model").value=""; $("shoe-start-km").value=""; $("shoe-max-km").value="800"; $("shoe-notes").value=""; $("shoe-form-wrap").classList.remove("hidden"); $("shoe-brand").focus(); }); $("shoe-form-cancel").addEventListener("click",()=>{ $("shoe-form-wrap").classList.add("hidden"); editingShoeId=null; }); $("shoe-form-save").addEventListener("click",saveShoe); }
async function saveShoe(){ const brand=$("shoe-brand").value.trim(),model=$("shoe-model").value.trim(); if(!brand||!model){ showToast("Please enter brand and model"); return; } try{ if(editingShoeId){ const f={brand,model,maxKm:parseFloat($("shoe-max-km").value)||null,notes:$("shoe-notes").value.trim()}; await updateShoe(editingShoeId,f); const s=shoes.find(s=>s.id===editingShoeId); if(s){ s.brand=brand;s.model=model;s.max_km=f.maxKm;s.notes=f.notes; } } else{ const ns={id:Date.now(),brand,model,km:parseFloat($("shoe-start-km").value)||0,maxKm:parseFloat($("shoe-max-km").value)||null,notes:$("shoe-notes").value.trim()}; await insertShoe(ns); shoes.push({...ns,max_km:ns.maxKm}); } $("shoe-form-wrap").classList.add("hidden"); editingShoeId=null; renderShoes(); populateShoeDropdown(); showToast("Shoe saved 👟"); } catch(e){ console.error(e); showToast("Error saving shoe"); } }
function renderShoes(){ const list=$("shoes-list"); if(!shoes.length){ list.innerHTML=`<div class="empty-state"><div class="empty-icon">👟</div><p>No shoes yet.</p></div>`; return; } list.innerHTML=shoes.map(shoe=>{ const km=shoe.km||0,maxKm=shoe.max_km||shoe.maxKm||800,pct=Math.min(100,Math.round((km/maxKm)*100)),cls=pct>=90?"danger":pct>=70?"warning":"ok"; return `<div class="shoe-card"><div class="shoe-card-top"><div><div class="shoe-card-name">${shoe.brand} ${shoe.model}</div>${shoe.notes?`<div class="shoe-card-notes">${shoe.notes}</div>`:""}</div><div style="display:flex;gap:6px;align-items:center"><button class="shoe-edit-btn" style="color:var(--muted);background:none;border:1px solid var(--border);border-radius:6px;padding:4px 10px;font-size:0.78rem;cursor:pointer" data-id="${shoe.id}">Edit</button><button class="shoe-del-btn shoe-card-del" data-id="${shoe.id}">Delete</button></div></div><div class="shoe-km-bar-wrap"><div class="shoe-km-labels"><span>Mileage</span><span><span class="shoe-km-value">${km.toFixed(1)} km</span> / ${maxKm} km</span></div><div class="shoe-km-bar-bg"><div class="shoe-km-bar-fill ${cls}" style="width:${pct}%"></div></div><div style="font-size:0.72rem;color:var(--muted);text-align:right">${pct}% used${pct>=90?" · Consider replacing":pct>=70?" · Getting worn":""}</div></div></div>`; }).join(""); list.querySelectorAll(".shoe-del-btn").forEach(btn=>{ btn.addEventListener("click",async()=>{ if(!confirm("Delete this shoe?")) return; try{ await deleteShoe(btn.dataset.id); shoes=shoes.filter(s=>s.id!=btn.dataset.id); renderShoes(); populateShoeDropdown(); } catch(e){ showToast("Error deleting shoe"); } }); }); list.querySelectorAll(".shoe-edit-btn").forEach(btn=>{ btn.addEventListener("click",()=>{ const shoe=shoes.find(s=>s.id==btn.dataset.id); if(!shoe)return; editingShoeId=shoe.id; $("shoe-form-title").textContent="Edit shoe"; $("shoe-brand").value=shoe.brand; $("shoe-model").value=shoe.model; $("shoe-start-km").value=shoe.km||0; $("shoe-max-km").value=shoe.max_km||shoe.maxKm||800; $("shoe-notes").value=shoe.notes||""; $("shoe-form-wrap").classList.remove("hidden"); $("shoe-brand").focus(); }); }); }

/* UTILS */
function formatDate(ds){ if(!ds)return""; return new Date(ds+"T00:00:00").toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"}); }
function fmtDuration(sec){ const h=Math.floor(sec/3600),m=Math.floor((sec%3600)/60),s=sec%60; return h>0?`${h}h ${m}m`:`${m}m ${s}s`; }
function calcPace(timeStr,km){ const p=timeStr.split(":").map(Number); if(p.length<2||!km)return""; const t=(p[0]||0)*3600+(p[1]||0)*60+(p[2]||0); const spk=t/km; return `${Math.floor(spk/60)}:${String(Math.round(spk%60)).padStart(2,"0")}`; }
function showToast(msg,type="success"){ const t=$("toast"); t.textContent=msg; t.style.background=type==="error"?"#ef4444":""; t.classList.remove("hidden"); setTimeout(()=>{ t.classList.add("hidden"); t.style.background=""; },3000); }

/* ══════════════════════════════════════════
   CSV EXPORT
   ══════════════════════════════════════════ */
function initExport(){
  if(!$("export-btn")) return;
  $("export-btn").addEventListener("click",showExportPanel);
  $("export-cancel-btn").addEventListener("click",()=>$("export-panel").classList.add("hidden"));
  $("export-download-btn").addEventListener("click",downloadCSV);
}

function showExportPanel(){
  // Set default date range to last 30 days
  const today=new Date().toISOString().split("T")[0];
  const ago=new Date(Date.now()-30*24*60*60*1000).toISOString().split("T")[0];
  $("export-from").value=ago;
  $("export-to").value=today;
  $("export-panel").classList.remove("hidden");
}

function downloadCSV(){
  const from=$("export-from").value;
  const to=$("export-to").value;
  const type=$("export-type").value;
  if(!from||!to){ showToast("Please select a date range"); return; }

  const rows=[];

  if(type==="all"||type==="workout"){
    // Group by session
    const sessionMap={};
    workouts.forEach(w=>{
      if(w.date<from||w.date>to) return;
      const key=w.sessionId?String(w.sessionId):`${w.date}_${w.day}`;
      if(!sessionMap[key]) sessionMap[key]={date:w.date,day:w.day,exercises:[]};
      sessionMap[key].exercises.push(w);
    });
    Object.values(sessionMap).forEach(s=>{
      s.exercises.forEach(ex=>{
        const sets=ex.sets_detail||[];
        sets.forEach((set,i)=>{
          rows.push([
            "Workout",
            s.date,
            s.day,
            ex.exercise,
            (ex.muscles||[]).join("|"),
            ex.machine_used||"",
            i+1,
            set.reps||"",
            set.weight||"",
            ex.duration||""
          ]);
        });
        if(!sets.length){
          rows.push(["Workout",s.date,s.day,ex.exercise,(ex.muscles||[]).join("|"),ex.machine_used||"","","","",ex.duration||""]);
        }
      });
    });
  }

  if(type==="all"||type==="run"){
    runs.forEach(r=>{
      if(r.date<from||r.date>to) return;
      const splits=(r.km_splits||r.kmSplits||[]);
      const hrs=splits.map(s=>s.hr).filter(Boolean);
      const avgHR=hrs.length?Math.round(hrs.reduce((a,b)=>a+b,0)/hrs.length):"";
      const pace=r.distance&&r.time?calcPace(r.time,r.distance):"";
      rows.push([
        "Run",
        r.date,
        r.title||"",
        r.distance||"",
        r.time||"",
        pace,
        avgHR,
        r.location||"",
        r.shoe_name||r.shoeName||"",
        r.notes||""
      ]);
    });
  }

  if(!rows.length){ showToast("No data found for selected range"); return; }

  // Build CSV
  const workoutHeader=["Type","Date","Day","Exercise","Muscles","Equipment","Set","Reps","Weight (kg)","Duration (s)"];
  const runHeader=["Type","Date","Title","Distance (km)","Time","Avg Pace","Avg HR","Location","Shoe","Notes"];

  let csv="";
  if(type==="workout"){
    csv=workoutHeader.join(",")+"
";
  } else if(type==="run"){
    csv=runHeader.join(",")+"
";
  } else {
    // Mixed — use a unified header that covers both
    csv=["Type","Date","Day/Title","Exercise/Distance","Muscles/Time","Equipment/Avg Pace","Set/Avg HR","Reps/Location","Weight/Shoe","Duration/Notes"].join(",")+"
";
  }

  rows.forEach(row=>{
    csv+=row.map(v=>{
      const s=String(v||"");
      return s.includes(",")||s.includes('"')||s.includes("
") ? `"${s.replace(/"/g,'""')}"` : s;
    }).join(",")+"
";
  });

  const blob=new Blob([csv],{type:"text/csv"});
  const url=URL.createObjectURL(blob);
  const a=document.createElement("a");
  a.href=url; a.download=`gymtracker-${type}-${from}-to-${to}.csv`;
  a.click(); URL.revokeObjectURL(url);
  showToast("CSV downloaded!");
  $("export-panel").classList.add("hidden");
}
