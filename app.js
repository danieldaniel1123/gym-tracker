/* ── DATA: Exercise database ── */
const EXERCISE_DB = [
  // PUSH
  { name: "Barbell bench press",    days: ["Push","Chest & Biceps","Upper body","Full body"], muscles: ["Chest","Front delts","Triceps"],            equipment: ["Barbell","Smith machine"] },
  { name: "Dumbbell bench press",   days: ["Push","Chest & Biceps","Upper body","Full body"], muscles: ["Chest","Front delts","Triceps"],            equipment: ["Dumbbell"] },
  { name: "Incline bench press",    days: ["Push","Chest & Biceps","Upper body","Full body"], muscles: ["Chest (upper)","Front delts","Triceps"],    equipment: ["Barbell","Dumbbell","Smith machine"] },
  { name: "Decline bench press",    days: ["Push","Chest & Biceps","Upper body","Full body"], muscles: ["Chest (lower)","Triceps"],                  equipment: ["Barbell","Dumbbell","Smith machine"] },
  { name: "Chest fly",              days: ["Push","Chest & Biceps","Upper body","Full body"], muscles: ["Chest"],                                   equipment: ["Dumbbell","Cable machine","Pec deck machine"] },
  { name: "Cable chest fly",        days: ["Push","Chest & Biceps","Upper body","Full body"], muscles: ["Chest"],                                   equipment: ["Cable machine"] },
  { name: "Push-up",                days: ["Push","Chest & Biceps","Upper body","Full body"], muscles: ["Chest","Front delts","Triceps"],            equipment: ["Bodyweight"] },
  { name: "Overhead press",         days: ["Push","Shoulder","Upper body","Full body"],       muscles: ["Front delts","Side delts","Triceps"],       equipment: ["Barbell","Dumbbell","Smith machine"] },
  { name: "Dumbbell shoulder press",days: ["Push","Shoulder","Upper body","Full body"],       muscles: ["Front delts","Side delts","Triceps"],       equipment: ["Dumbbell"] },
  { name: "Lateral raise",          days: ["Push","Shoulder","Upper body","Full body"],       muscles: ["Side delts"],                               equipment: ["Dumbbell","Cable machine"] },
  { name: "Front raise",            days: ["Push","Shoulder","Upper body","Full body"],       muscles: ["Front delts"],                              equipment: ["Dumbbell","Barbell","Cable machine"] },
  { name: "Arnold press",           days: ["Push","Shoulder","Upper body","Full body"],       muscles: ["Front delts","Side delts","Triceps"],       equipment: ["Dumbbell"] },
  { name: "Tricep pushdown",        days: ["Push","Arms","Back & Triceps","Upper body"],      muscles: ["Triceps"],                                  equipment: ["Cable machine"] },
  { name: "Overhead tricep ext.",   days: ["Push","Arms","Back & Triceps","Upper body"],      muscles: ["Triceps (long head)"],                      equipment: ["Dumbbell","Cable machine","EZ bar"] },
  { name: "Skull crusher",          days: ["Push","Arms","Back & Triceps","Upper body"],      muscles: ["Triceps"],                                  equipment: ["EZ bar","Barbell","Dumbbell"] },
  { name: "Tricep dip",             days: ["Push","Arms","Back & Triceps","Upper body"],      muscles: ["Triceps","Chest","Front delts"],            equipment: ["Bodyweight","Dip machine"] },
  { name: "Close-grip bench press", days: ["Push","Arms","Back & Triceps","Upper body"],      muscles: ["Triceps","Chest"],                          equipment: ["Barbell","Smith machine"] },

  // PULL
  { name: "Pull-up",                days: ["Pull","Back & Biceps","Upper body","Full body"],  muscles: ["Back (lats)","Biceps","Rear delts"],        equipment: ["Bodyweight","Pull-up bar"] },
  { name: "Chin-up",                days: ["Pull","Back & Biceps","Upper body","Full body"],  muscles: ["Back (lats)","Biceps"],                     equipment: ["Bodyweight","Pull-up bar"] },
  { name: "Lat pulldown",           days: ["Pull","Back & Biceps","Upper body","Full body"],  muscles: ["Back (lats)","Biceps"],                     equipment: ["Lat pulldown machine","Cable machine"] },
  { name: "Seated cable row",       days: ["Pull","Back & Biceps","Upper body","Full body"],  muscles: ["Back (mid)","Back (rhomboids)","Biceps"],   equipment: ["Seated row machine","Cable machine"] },
  { name: "Barbell row",            days: ["Pull","Back & Biceps","Upper body","Full body"],  muscles: ["Back (lats)","Back (mid)","Biceps"],        equipment: ["Barbell"] },
  { name: "Dumbbell row",           days: ["Pull","Back & Biceps","Upper body","Full body"],  muscles: ["Back (lats)","Back (mid)","Biceps"],        equipment: ["Dumbbell"] },
  { name: "T-bar row",              days: ["Pull","Back & Biceps","Upper body","Full body"],  muscles: ["Back (lats)","Back (mid)"],                 equipment: ["T-bar row machine","Barbell"] },
  { name: "Face pull",              days: ["Pull","Back & Biceps","Shoulder","Upper body"],   muscles: ["Rear delts","Back (traps)","Rotator cuff"],equipment: ["Cable machine"] },
  { name: "Straight-arm pulldown",  days: ["Pull","Back & Biceps","Upper body"],              muscles: ["Back (lats)"],                              equipment: ["Cable machine"] },
  { name: "Barbell curl",           days: ["Pull","Arms","Back & Biceps","Chest & Biceps"],   muscles: ["Biceps"],                                   equipment: ["Barbell","EZ bar"] },
  { name: "Dumbbell curl",          days: ["Pull","Arms","Back & Biceps","Chest & Biceps"],   muscles: ["Biceps"],                                   equipment: ["Dumbbell"] },
  { name: "Hammer curl",            days: ["Pull","Arms","Back & Biceps","Chest & Biceps"],   muscles: ["Biceps","Brachialis","Forearms"],           equipment: ["Dumbbell"] },
  { name: "Preacher curl",          days: ["Pull","Arms","Back & Biceps","Chest & Biceps"],   muscles: ["Biceps"],                                   equipment: ["EZ bar","Barbell","Dumbbell"] },
  { name: "Cable curl",             days: ["Pull","Arms","Back & Biceps","Chest & Biceps"],   muscles: ["Biceps"],                                   equipment: ["Cable machine"] },
  { name: "Concentration curl",     days: ["Pull","Arms","Back & Biceps","Chest & Biceps"],   muscles: ["Biceps"],                                   equipment: ["Dumbbell"] },
  { name: "Shrugs",                 days: ["Pull","Back & Biceps","Upper body"],              muscles: ["Back (traps)"],                             equipment: ["Barbell","Dumbbell"] },

  // LEGS
  { name: "Barbell squat",          days: ["Legs","Lower body","Full body"],                  muscles: ["Quads","Glutes","Hamstrings"],              equipment: ["Barbell","Smith machine"] },
  { name: "Goblet squat",           days: ["Legs","Lower body","Full body"],                  muscles: ["Quads","Glutes"],                           equipment: ["Dumbbell","Kettlebell"] },
  { name: "Leg press",              days: ["Legs","Lower body","Full body"],                  muscles: ["Quads","Glutes","Hamstrings"],              equipment: ["Leg press machine"] },
  { name: "Hack squat",             days: ["Legs","Lower body","Full body"],                  muscles: ["Quads","Glutes"],                           equipment: ["Hack squat machine","Barbell"] },
  { name: "Romanian deadlift",      days: ["Legs","Lower body","Full body"],                  muscles: ["Hamstrings","Glutes","Lower back"],         equipment: ["Barbell","Dumbbell"] },
  { name: "Conventional deadlift",  days: ["Legs","Lower body","Full body","Back & Biceps"],  muscles: ["Hamstrings","Glutes","Lower back","Traps"], equipment: ["Barbell"] },
  { name: "Sumo deadlift",          days: ["Legs","Lower body","Full body"],                  muscles: ["Glutes","Hamstrings","Adductors"],          equipment: ["Barbell"] },
  { name: "Leg curl",               days: ["Legs","Lower body","Full body"],                  muscles: ["Hamstrings"],                               equipment: ["Leg curl machine"] },
  { name: "Leg extension",          days: ["Legs","Lower body","Full body"],                  muscles: ["Quads"],                                    equipment: ["Leg extension machine"] },
  { name: "Hip thrust",             days: ["Legs","Lower body","Full body"],                  muscles: ["Glutes","Hamstrings"],                      equipment: ["Barbell","Hip thrust machine"] },
  { name: "Walking lunges",         days: ["Legs","Lower body","Full body"],                  muscles: ["Quads","Glutes","Hamstrings"],              equipment: ["Bodyweight","Dumbbell","Barbell"] },
  { name: "Bulgarian split squat",  days: ["Legs","Lower body","Full body"],                  muscles: ["Quads","Glutes"],                           equipment: ["Bodyweight","Dumbbell","Barbell"] },
  { name: "Calf raise",             days: ["Legs","Lower body","Full body"],                  muscles: ["Calves"],                                   equipment: ["Calf raise machine","Bodyweight","Barbell"] },
  { name: "Seated calf raise",      days: ["Legs","Lower body","Full body"],                  muscles: ["Calves (soleus)"],                          equipment: ["Seated calf raise machine"] },
  { name: "Adductor machine",       days: ["Legs","Lower body","Full body"],                  muscles: ["Adductors"],                                equipment: ["Adductor machine"] },
  { name: "Abductor machine",       days: ["Legs","Lower body","Full body"],                  muscles: ["Abductors","Glutes (medius)"],              equipment: ["Abductor machine"] },

  // SHOULDER
  { name: "Reverse fly",            days: ["Shoulder","Back & Biceps","Upper body"],          muscles: ["Rear delts","Back (rhomboids)"],            equipment: ["Dumbbell","Cable machine"] },
  { name: "Upright row",            days: ["Shoulder","Upper body"],                          muscles: ["Side delts","Back (traps)","Biceps"],       equipment: ["Barbell","EZ bar","Cable machine"] },

  // CORE
  { name: "Plank",                  days: ["Full body","Upper body"],                         muscles: ["Core"],                                     equipment: ["Bodyweight"] },
  { name: "Cable crunch",           days: ["Full body","Upper body"],                         muscles: ["Core (abs)"],                               equipment: ["Cable machine"] },
  { name: "Hanging leg raise",      days: ["Full body","Upper body"],                         muscles: ["Core (abs)","Hip flexors"],                 equipment: ["Pull-up bar"] },
  { name: "Ab wheel rollout",       days: ["Full body","Upper body"],                         muscles: ["Core (abs)","Lats"],                        equipment: ["Ab wheel"] },
];

const DAY_OPTIONS = [
  "Push","Pull","Legs","Back & Biceps","Back & Triceps",
  "Chest & Biceps","Arms","Shoulder","Full body","Upper body","Lower body"
];

/* ── STORAGE HELPERS ── */
const load = key => JSON.parse(localStorage.getItem(key) || "[]");
const save = (key, val) => localStorage.setItem(key, JSON.stringify(val));

let workouts = load("gt_workouts");
let runs     = load("gt_runs");

/* ── DOM REFS ── */
const $ = id => document.getElementById(id);

/* ── INIT ── */
document.addEventListener("DOMContentLoaded", () => {
  setDefaultDates();
  populateDayDropdowns();
  bindNav();
  bindToggle();
  bindWorkoutForm();
  bindRunForm();
  bindHistory();
  bindCalendar();
  bindRecords();
  renderHistory();
  renderRecords();
});

function setDefaultDates() {
  const today = new Date().toISOString().split("T")[0];
  $("w-date").value = today;
  $("r-date").value = today;
}

function populateDayDropdowns() {
  const sel = $("w-day");
  DAY_OPTIONS.forEach(d => {
    const o = document.createElement("option");
    o.value = o.textContent = d;
    sel.appendChild(o);
  });

  // Also populate filter-day in history
  const fd = $("filter-day");
  DAY_OPTIONS.forEach(d => {
    const o = document.createElement("option");
    o.value = o.textContent = d;
    fd.appendChild(o);
  });
}

/* ── NAV ── */
function bindNav() {
  document.querySelectorAll(".nav-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
      document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
      btn.classList.add("active");
      $("tab-" + btn.dataset.tab).classList.add("active");
      if (btn.dataset.tab === "calendar") renderCalendar();
      if (btn.dataset.tab === "records")  renderRecords();
      if (btn.dataset.tab === "history")  renderHistory();
    });
  });
}

/* ── WORKOUT / RUN TOGGLE ── */
function bindToggle() {
  $("btn-workout").addEventListener("click", () => {
    $("btn-workout").classList.add("active");
    $("btn-run").classList.remove("active");
    $("workout-form").classList.remove("hidden");
    $("run-form").classList.add("hidden");
  });
  $("btn-run").addEventListener("click", () => {
    $("btn-run").classList.add("active");
    $("btn-workout").classList.remove("active");
    $("run-form").classList.remove("hidden");
    $("workout-form").classList.add("hidden");
  });
}

/* ── WORKOUT FORM LOGIC ── */
function bindWorkoutForm() {
  $("w-day").addEventListener("change", onDayChange);
  $("w-exercise").addEventListener("change", onExerciseChange);
  $("workout-form").addEventListener("submit", saveWorkout);
}

function onDayChange() {
  const day = $("w-day").value;
  const exSel = $("w-exercise");
  exSel.innerHTML = '<option value="">Select exercise</option>';

  if (!day) {
    exSel.disabled = true;
    return;
  }

  const filtered = EXERCISE_DB.filter(e => e.days.includes(day));
  filtered.sort((a, b) => a.name.localeCompare(b.name));
  filtered.forEach(e => {
    const o = document.createElement("option");
    o.value = o.textContent = e.name;
    exSel.appendChild(o);
  });
  exSel.disabled = false;

  // Reset downstream
  setTags("w-muscles", []);
  setTags("w-equipment", []);
  $("pr-bar").classList.add("hidden");
}

function onExerciseChange() {
  const name = $("w-exercise").value;
  if (!name) return;

  const ex = EXERCISE_DB.find(e => e.name === name);
  if (!ex) return;

  setTags("w-muscles", ex.muscles);
  setTags("w-equipment", ex.equipment);
  updatePRBar(name);
}

function setTags(elId, items) {
  const el = $(elId);
  if (!items || items.length === 0) {
    el.innerHTML = '<span style="color:var(--muted)">—</span>';
    return;
  }
  el.innerHTML = items.map(i => `<span class="tag">${i}</span>`).join("");
}

function updatePRBar(exerciseName) {
  const entries = workouts.filter(w => w.exercise === exerciseName && w.weight);
  if (entries.length === 0) {
    $("pr-bar").classList.add("hidden");
    return;
  }

  // All-time PR
  const prWeight = Math.max(...entries.map(e => e.weight));
  const prReps   = Math.max(...entries.map(e => e.reps || 0));

  // Last session (most recent date)
  const sorted   = [...entries].sort((a, b) => b.date.localeCompare(a.date));
  const last     = sorted[0];

  $("pr-last").textContent = `${last.weight}kg × ${last.reps || "—"} reps`;
  $("pr-best").textContent = `${prWeight}kg × ${prReps} reps`;
  $("pr-bar").classList.remove("hidden");
}

function saveWorkout(e) {
  e.preventDefault();
  const entry = {
    id:       Date.now(),
    type:     "workout",
    date:     $("w-date").value,
    day:      $("w-day").value,
    exercise: $("w-exercise").value,
    muscles:  getTagValues("w-muscles"),
    equipment:getTagValues("w-equipment"),
    sets:     parseInt($("w-sets").value) || null,
    reps:     parseInt($("w-reps").value) || null,
    weight:   parseFloat($("w-weight").value) || null,
    comments: $("w-comments").value.trim(),
  };

  workouts.unshift(entry);
  save("gt_workouts", workouts);
  showToast("Workout saved! 💪");
  $("workout-form").reset();
  setDefaultDates();
  $("w-exercise").disabled = true;
  $("w-exercise").innerHTML = '<option value="">Select exercise day first</option>';
  setTags("w-muscles", []);
  setTags("w-equipment", []);
  $("pr-bar").classList.add("hidden");
}

function getTagValues(elId) {
  return [...$(elId).querySelectorAll(".tag")].map(t => t.textContent);
}

/* ── RUN FORM ── */
function bindRunForm() {
  $("run-form").addEventListener("submit", saveRun);
}

function saveRun(e) {
  e.preventDefault();
  const entry = {
    id:       Date.now(),
    type:     "run",
    date:     $("r-date").value,
    distance: parseFloat($("r-distance").value) || null,
    time:     $("r-time").value.trim(),
    location: $("r-location").value.trim(),
    notes:    $("r-notes").value.trim(),
  };
  runs.unshift(entry);
  save("gt_runs", runs);
  showToast("Run saved! 🏃");
  $("run-form").reset();
  setDefaultDates();
}

/* ── HISTORY ── */
function bindHistory() {
  $("filter-type").addEventListener("change", renderHistory);
  $("filter-day").addEventListener("change", renderHistory);
}

function renderHistory() {
  const typeFilter = $("filter-type").value;
  const dayFilter  = $("filter-day").value;

  let items = [];
  if (typeFilter !== "run")     items = items.concat(workouts.map(w => ({...w, _type:"workout"})));
  if (typeFilter !== "workout") items = items.concat(runs.map(r => ({...r, _type:"run"})));

  items.sort((a, b) => b.date.localeCompare(a.date));

  if (dayFilter !== "all") {
    items = items.filter(i => i._type === "workout" && i.day === dayFilter);
  }

  const list = $("history-list");
  if (items.length === 0) {
    list.innerHTML = `<div class="empty-state"><div class="empty-icon">📭</div><p>No entries yet. Start logging!</p></div>`;
    return;
  }

  list.innerHTML = items.map(item => {
    if (item._type === "run") return renderRunCard(item);
    return renderWorkoutCard(item);
  }).join("");

  list.querySelectorAll(".history-delete").forEach(btn => {
    btn.addEventListener("click", () => deleteEntry(btn.dataset.id, btn.dataset.type));
  });
}

function renderWorkoutCard(w) {
  const muscles = w.muscles?.join(", ") || "";
  const sets = w.sets ? `${w.sets} sets` : "";
  const reps = w.reps ? `${w.reps} reps` : "";
  const weight = w.weight ? `${w.weight}kg` : "";
  const stats = [sets, reps, weight].filter(Boolean).join(" · ");

  return `<div class="history-card workout-card">
    <div class="history-top">
      <div>
        <div class="history-title">${w.exercise || "—"}</div>
        <div class="history-date">${formatDate(w.date)}</div>
      </div>
      <button class="history-delete" data-id="${w.id}" data-type="workout">✕</button>
    </div>
    <div class="history-meta">
      <span class="badge accent">${w.day || ""}</span>
      ${stats ? `<span class="badge">${stats}</span>` : ""}
      ${muscles ? `<span class="badge">${muscles}</span>` : ""}
    </div>
    ${w.comments ? `<div class="history-comments">${w.comments}</div>` : ""}
  </div>`;
}

function renderRunCard(r) {
  const pace = r.distance && r.time ? calcPace(r.time, r.distance) : "";
  return `<div class="history-card run-card">
    <div class="history-top">
      <div>
        <div class="history-title">🏃 Run${r.location ? " — " + r.location : ""}</div>
        <div class="history-date">${formatDate(r.date)}</div>
      </div>
      <button class="history-delete" data-id="${r.id}" data-type="run">✕</button>
    </div>
    <div class="history-meta">
      ${r.distance ? `<span class="badge blue">${r.distance} km</span>` : ""}
      ${r.time     ? `<span class="badge blue">${r.time}</span>` : ""}
      ${pace       ? `<span class="badge">${pace} /km</span>` : ""}
    </div>
    ${r.notes ? `<div class="history-comments">${r.notes}</div>` : ""}
  </div>`;
}

function deleteEntry(id, type) {
  id = parseInt(id);
  if (type === "workout") {
    workouts = workouts.filter(w => w.id !== id);
    save("gt_workouts", workouts);
  } else {
    runs = runs.filter(r => r.id !== id);
    save("gt_runs", runs);
  }
  renderHistory();
  renderRecords();
}

/* ── CALENDAR ── */
let calYear, calMonth;

function bindCalendar() {
  const now = new Date();
  calYear  = now.getFullYear();
  calMonth = now.getMonth();
  $("cal-prev").addEventListener("click", () => { calMonth--; if (calMonth < 0) { calMonth = 11; calYear--; } renderCalendar(); });
  $("cal-next").addEventListener("click", () => { calMonth++; if (calMonth > 11) { calMonth = 0; calYear++; } renderCalendar(); });
}

function renderCalendar() {
  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  $("cal-title").textContent = `${months[calMonth]} ${calYear}`;

  // Build activity map  date -> {workout, run}
  const actMap = {};
  workouts.forEach(w => { actMap[w.date] = actMap[w.date] || {}; actMap[w.date].workout = true; });
  runs.forEach(r => { actMap[r.date] = actMap[r.date] || {}; actMap[r.date].run = true; });

  const firstDay = new Date(calYear, calMonth, 1).getDay();
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const today = new Date().toISOString().split("T")[0];

  let html = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d =>
    `<div class="cal-day-name">${d}</div>`).join("");

  // Empty cells before first day
  for (let i = 0; i < firstDay; i++) html += `<div class="cal-cell empty"><span class="cal-num"></span></div>`;

  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${calYear}-${String(calMonth+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
    const act = actMap[dateStr] || {};
    const isToday = dateStr === today;
    let dots = "";
    if (act.workout && act.run) dots = `<div class="cal-dot-row"><span class="dot dot-both"></span></div>`;
    else if (act.workout) dots = `<div class="cal-dot-row"><span class="dot dot-workout"></span></div>`;
    else if (act.run)     dots = `<div class="cal-dot-row"><span class="dot dot-run"></span></div>`;

    html += `<div class="cal-cell${isToday ? " today" : ""}" data-date="${dateStr}">
      <span class="cal-num">${d}</span>${dots}
    </div>`;
  }

  $("cal-grid").innerHTML = html;

  // Click to see detail
  $("cal-grid").querySelectorAll(".cal-cell[data-date]").forEach(cell => {
    cell.addEventListener("click", () => showDayDetail(cell.dataset.date));
  });
}

function showDayDetail(date) {
  const dayWorkouts = workouts.filter(w => w.date === date);
  const dayRuns     = runs.filter(r => r.date === date);
  const detail      = $("cal-detail");

  if (dayWorkouts.length === 0 && dayRuns.length === 0) {
    detail.classList.add("hidden");
    return;
  }

  let html = `<h3>${formatDate(date)}</h3>`;
  dayWorkouts.forEach(w => {
    const stats = [w.sets && `${w.sets}s`, w.reps && `${w.reps}r`, w.weight && `${w.weight}kg`].filter(Boolean).join(" · ");
    html += `<div style="margin-bottom:8px"><span style="font-weight:600;font-size:.9rem">${w.exercise}</span>
      <span style="color:var(--muted);font-size:.8rem;margin-left:8px">${w.day}</span>
      ${stats ? `<div style="font-size:.82rem;color:var(--accent2);margin-top:2px">${stats}</div>` : ""}
    </div>`;
  });
  dayRuns.forEach(r => {
    html += `<div style="margin-bottom:8px"><span style="font-weight:600;font-size:.9rem">🏃 Run</span>
      ${r.distance ? `<span style="color:var(--muted);font-size:.8rem;margin-left:8px">${r.distance}km</span>` : ""}
      ${r.time ? `<span style="color:var(--muted);font-size:.8rem;margin-left:8px">${r.time}</span>` : ""}
    </div>`;
  });

  detail.innerHTML = html;
  detail.classList.remove("hidden");
}

/* ── PERSONAL RECORDS ── */
function bindRecords() {
  $("pr-search").addEventListener("input", renderRecords);
}

function renderRecords() {
  const q = $("pr-search").value.toLowerCase();

  // Build PR map from workout history
  const prMap = {};
  workouts.forEach(w => {
    if (!w.exercise || !w.weight) return;
    if (!prMap[w.exercise]) prMap[w.exercise] = { name: w.exercise, day: w.day, maxWeight: 0, maxReps: 0, lastWeight: 0, lastReps: 0, lastDate: "" };
    const pr = prMap[w.exercise];
    if (w.weight > pr.maxWeight) pr.maxWeight = w.weight;
    if ((w.reps||0) > pr.maxReps) pr.maxReps = w.reps || 0;
    if (w.date >= pr.lastDate) { pr.lastDate = w.date; pr.lastWeight = w.weight; pr.lastReps = w.reps || 0; }
  });

  let items = Object.values(prMap).sort((a, b) => a.name.localeCompare(b.name));
  if (q) items = items.filter(i => i.name.toLowerCase().includes(q));

  const list = $("records-list");
  if (items.length === 0) {
    list.innerHTML = `<div class="empty-state"><div class="empty-icon">🏆</div><p>${q ? "No matching exercises." : "Log workouts to see your PRs here."}</p></div>`;
    return;
  }

  list.innerHTML = items.map(pr => `
    <div class="record-card">
      <div>
        <div class="record-name">${pr.name}</div>
        <div class="record-day">${pr.day || ""}</div>
      </div>
      <div class="record-stats">
        <div>
          <div class="record-stat-label">Last session</div>
          <div class="record-stat-value">${pr.lastWeight}kg</div>
          <div class="record-stat-sub">${pr.lastReps} reps · ${formatDate(pr.lastDate)}</div>
        </div>
        <div>
          <div class="record-stat-label">All-time PR</div>
          <div class="record-stat-value">${pr.maxWeight}kg</div>
          <div class="record-stat-sub">${pr.maxReps} reps max</div>
        </div>
      </div>
    </div>
  `).join("");
}

/* ── UTILS ── */
function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function calcPace(timeStr, km) {
  const parts = timeStr.split(":").map(Number);
  if (parts.length < 2 || !km) return "";
  const totalSec = (parts[0]||0)*3600 + (parts[1]||0)*60 + (parts[2]||0);
  const secPerKm = totalSec / km;
  const mins = Math.floor(secPerKm / 60);
  const secs = Math.round(secPerKm % 60);
  return `${mins}:${String(secs).padStart(2,"0")}`;
}

function showToast(msg) {
  const t = $("toast");
  t.textContent = msg;
  t.classList.remove("hidden");
  setTimeout(() => t.classList.add("hidden"), 2500);
}
