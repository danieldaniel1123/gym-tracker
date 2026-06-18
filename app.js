/* ══════════════════════════════════════════
   MUSCLE MAP — SVG highlight definitions
   Each key maps to which muscle regions
   light up on the front/back body silhouette
   ══════════════════════════════════════════ */

// Muscle group → which SVG paths to highlight
// front regions: chest, front-delts, biceps, quads, abs, obliques, hip-flexors, forearms-front, adductors
// back  regions: traps, lats, rear-delts, triceps, hamstrings, glutes, lower-back, calves, forearms-back

const MUSCLE_HIGHLIGHT_MAP = {
  "Chest":             { front: ["chest"],               back: [] },
  "Chest (upper)":     { front: ["chest"],               back: [] },
  "Chest (lower)":     { front: ["chest"],               back: [] },
  "Front delts":       { front: ["front-delts"],         back: [] },
  "Side delts":        { front: ["front-delts"],         back: ["rear-delts"] },
  "Rear delts":        { front: [],                      back: ["rear-delts"] },
  "Triceps":           { front: [],                      back: ["triceps"] },
  "Triceps (long head)":{ front: [],                     back: ["triceps"] },
  "Biceps":            { front: ["biceps"],              back: [] },
  "Brachialis":        { front: ["biceps"],              back: [] },
  "Forearms":          { front: ["forearms-front"],      back: ["forearms-back"] },
  "Back (lats)":       { front: [],                      back: ["lats"] },
  "Back (mid)":        { front: [],                      back: ["lats"] },
  "Back (traps)":      { front: [],                      back: ["traps"] },
  "Back (rhomboids)":  { front: [],                      back: ["lats"] },
  "Traps":             { front: [],                      back: ["traps"] },
  "Lower back":        { front: [],                      back: ["lower-back"] },
  "Rotator cuff":      { front: [],                      back: ["rear-delts"] },
  "Quads":             { front: ["quads"],               back: [] },
  "Hamstrings":        { front: [],                      back: ["hamstrings"] },
  "Glutes":            { front: [],                      back: ["glutes"] },
  "Glutes (medius)":   { front: [],                      back: ["glutes"] },
  "Adductors":         { front: ["adductors"],           back: [] },
  "Abductors":         { front: [],                      back: ["glutes"] },
  "Calves":            { front: [],                      back: ["calves"] },
  "Calves (soleus)":   { front: [],                      back: ["calves"] },
  "Core":              { front: ["abs"],                 back: ["lower-back"] },
  "Core (abs)":        { front: ["abs"],                 back: [] },
  "Hip flexors":       { front: ["hip-flexors"],         back: [] },
  "Lats":              { front: [],                      back: ["lats"] },
};

// Build SVG body diagram with highlighted regions
// view = "front" | "back", highlights = array of region keys, isPrimary = bool
function buildBodySVG(view, highlights, isPrimary) {
  const PRIMARY   = "#e8533a";
  const SECONDARY = "none";
  const PSTROKE   = "#e8533a";
  const SSTROKE   = "#f0834e";
  const BASE_FILL = "#2a2a2a";
  const BASE_STR  = "#3a3a3a";
  const HL_FILL   = isPrimary ? PRIMARY   : "rgba(240,131,78,0.18)";
  const HL_STR    = isPrimary ? PSTROKE   : SSTROKE;

  const h = s => highlights.includes(s);
  const r = (region, fill, stroke) =>
    `fill="${h(region) ? HL_FILL : fill}" stroke="${h(region) ? HL_STR : stroke}"`;

  if (view === "front") {
    return `<svg width="52" height="100" viewBox="0 0 52 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="26" cy="9" rx="8" ry="8.5" ${r("head", BASE_FILL, BASE_STR)} stroke-width="0.8"/>
      <rect x="20" y="18" width="12" height="5" rx="2" ${r("neck", BASE_FILL, BASE_STR)} stroke-width="0.8"/>
      <path d="M10 24 Q8 30 8 40 L44 40 Q44 30 42 24 Q34 22 26 22 Q18 22 10 24Z" ${r("chest", BASE_FILL, BASE_STR)} stroke-width="0.8"/>
      <ellipse cx="10" cy="28" rx="5" ry="7" ${r("front-delts", BASE_FILL, BASE_STR)} stroke-width="0.8"/>
      <ellipse cx="42" cy="28" rx="5" ry="7" ${r("front-delts", BASE_FILL, BASE_STR)} stroke-width="0.8"/>
      <rect x="4" y="33" width="6" height="14" rx="3" ${r("biceps", BASE_FILL, BASE_STR)} stroke-width="0.8"/>
      <rect x="42" y="33" width="6" height="14" rx="3" ${r("biceps", BASE_FILL, BASE_STR)} stroke-width="0.8"/>
      <rect x="3" y="47" width="6" height="10" rx="2" ${r("forearms-front", BASE_FILL, BASE_STR)} stroke-width="0.8"/>
      <rect x="43" y="47" width="6" height="10" rx="2" ${r("forearms-front", BASE_FILL, BASE_STR)} stroke-width="0.8"/>
      <rect x="18" y="40" width="16" height="12" rx="2" ${r("abs", BASE_FILL, BASE_STR)} stroke-width="0.8"/>
      <rect x="15" y="52" width="22" height="8" rx="2" ${r("hip-flexors", BASE_FILL, BASE_STR)} stroke-width="0.8"/>
      <rect x="15" y="53" width="9" height="5" rx="1" ${r("obliques", BASE_FILL, BASE_STR)} stroke-width="0.6"/>
      <rect x="28" y="53" width="9" height="5" rx="1" ${r("obliques", BASE_FILL, BASE_STR)} stroke-width="0.6"/>
      <rect x="14" y="60" width="10" height="24" rx="4" ${r("quads", BASE_FILL, BASE_STR)} stroke-width="0.8"/>
      <rect x="28" y="60" width="10" height="24" rx="4" ${r("quads", BASE_FILL, BASE_STR)} stroke-width="0.8"/>
      <rect x="15" y="61" width="8" height="8" rx="2" ${r("adductors", BASE_FILL, BASE_STR)} stroke-width="0.6"/>
      <rect x="29" y="61" width="8" height="8" rx="2" ${r("adductors", BASE_FILL, BASE_STR)} stroke-width="0.6"/>
      <rect x="15" y="84" width="10" height="14" rx="3" ${r("calves-front", BASE_FILL, BASE_STR)} stroke-width="0.8"/>
      <rect x="27" y="84" width="10" height="14" rx="3" ${r("calves-front", BASE_FILL, BASE_STR)} stroke-width="0.8"/>
    </svg>`;
  } else {
    return `<svg width="52" height="100" viewBox="0 0 52 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="26" cy="9" rx="8" ry="8.5" ${r("head", BASE_FILL, BASE_STR)} stroke-width="0.8"/>
      <rect x="20" y="18" width="12" height="5" rx="2" ${r("neck", BASE_FILL, BASE_STR)} stroke-width="0.8"/>
      <path d="M10 24 Q8 30 8 40 L44 40 Q44 30 42 24 Q34 22 26 22 Q18 22 10 24Z" ${r("traps", BASE_FILL, BASE_STR)} stroke-width="0.8"/>
      <ellipse cx="10" cy="28" rx="5" ry="7" ${r("rear-delts", BASE_FILL, BASE_STR)} stroke-width="0.8"/>
      <ellipse cx="42" cy="28" rx="5" ry="7" ${r("rear-delts", BASE_FILL, BASE_STR)} stroke-width="0.8"/>
      <path d="M10 34 Q16 38 26 38 Q36 38 42 34 L42 44 Q36 46 26 46 Q16 46 10 44Z" ${r("lats", BASE_FILL, BASE_STR)} stroke-width="0.8"/>
      <rect x="4" y="33" width="6" height="14" rx="3" ${r("triceps", BASE_FILL, BASE_STR)} stroke-width="0.8"/>
      <rect x="42" y="33" width="6" height="14" rx="3" ${r("triceps", BASE_FILL, BASE_STR)} stroke-width="0.8"/>
      <rect x="3" y="47" width="6" height="10" rx="2" ${r("forearms-back", BASE_FILL, BASE_STR)} stroke-width="0.8"/>
      <rect x="43" y="47" width="6" height="10" rx="2" ${r("forearms-back", BASE_FILL, BASE_STR)} stroke-width="0.8"/>
      <rect x="16" y="46" width="20" height="12" rx="2" ${r("lower-back", BASE_FILL, BASE_STR)} stroke-width="0.8"/>
      <path d="M14 60 Q16 58 26 58 Q36 58 38 60 L40 72 Q36 76 26 76 Q16 76 12 72Z" ${r("glutes", BASE_FILL, BASE_STR)} stroke-width="0.8"/>
      <rect x="14" y="60" width="10" height="22" rx="4" ${r("hamstrings", BASE_FILL, BASE_STR)} stroke-width="0.8"/>
      <rect x="28" y="60" width="10" height="22" rx="4" ${r("hamstrings", BASE_FILL, BASE_STR)} stroke-width="0.8"/>
      <rect x="15" y="84" width="10" height="14" rx="3" ${r("calves", BASE_FILL, BASE_STR)} stroke-width="0.8"/>
      <rect x="27" y="84" width="10" height="14" rx="3" ${r("calves", BASE_FILL, BASE_STR)} stroke-width="0.8"/>
    </svg>`;
  }
}

function buildMuscleDiagram(primaryMuscles, secondaryMuscles) {
  // Collect all front/back highlights for primary and secondary
  const frontPrimary = [], backPrimary = [], frontSecondary = [], backSecondary = [];

  primaryMuscles.forEach(m => {
    const map = MUSCLE_HIGHLIGHT_MAP[m];
    if (!map) return;
    frontPrimary.push(...map.front);
    backPrimary.push(...map.back);
  });
  (secondaryMuscles || []).forEach(m => {
    const map = MUSCLE_HIGHLIGHT_MAP[m];
    if (!map) return;
    // Only add as secondary if not already primary
    map.front.forEach(r => { if (!frontPrimary.includes(r)) frontSecondary.push(r); });
    map.back.forEach(r => { if (!backPrimary.includes(r)) backSecondary.push(r); });
  });

  // Determine which views are relevant
  const hasFront = frontPrimary.length > 0 || frontSecondary.length > 0;
  const hasBack  = backPrimary.length > 0  || backSecondary.length > 0;

  // Build combined highlight arrays per view
  // We'll render both views always but grey out less-relevant one
  const frontHL = [...new Set([...frontPrimary, ...frontSecondary])];
  const backHL  = [...new Set([...backPrimary,  ...backSecondary])];

  // For SVG we pass primary highlights only (secondary styling handled via opacity on the wrapper)
  const frontSVG = buildBodySVG("front", frontPrimary, true);
  const backSVG  = buildBodySVG("back",  backPrimary,  true);

  const frontOpacity = hasFront ? "1" : "0.25";
  const backOpacity  = hasBack  ? "1" : "0.25";

  return `<div style="opacity:${frontOpacity}">${frontSVG}</div>
          <div style="opacity:${backOpacity}">${backSVG}</div>`;
}

/* ══════════════════════════════════════════
   EXERCISE DATABASE
   muscles[0] = primary, rest = secondary
   ══════════════════════════════════════════ */
const EXERCISE_DB = [
  { name: "Barbell bench press",    days: ["Push","Chest & Biceps","Upper body","Full body"], muscles: ["Chest","Front delts","Triceps"],              equipment: ["Barbell","Smith machine"] },
  { name: "Dumbbell bench press",   days: ["Push","Chest & Biceps","Upper body","Full body"], muscles: ["Chest","Front delts","Triceps"],              equipment: ["Dumbbell"] },
  { name: "Incline bench press",    days: ["Push","Chest & Biceps","Upper body","Full body"], muscles: ["Chest (upper)","Front delts","Triceps"],      equipment: ["Barbell","Dumbbell","Smith machine"] },
  { name: "Decline bench press",    days: ["Push","Chest & Biceps","Upper body","Full body"], muscles: ["Chest (lower)","Triceps"],                    equipment: ["Barbell","Dumbbell","Smith machine"] },
  { name: "Chest fly",              days: ["Push","Chest & Biceps","Upper body","Full body"], muscles: ["Chest","Front delts"],                        equipment: ["Dumbbell","Cable machine","Pec deck machine"] },
  { name: "Cable chest fly",        days: ["Push","Chest & Biceps","Upper body","Full body"], muscles: ["Chest","Front delts"],                        equipment: ["Cable machine"] },
  { name: "Push-up",                days: ["Push","Chest & Biceps","Upper body","Full body"], muscles: ["Chest","Front delts","Triceps"],              equipment: ["Bodyweight"] },
  { name: "Overhead press",         days: ["Push","Shoulder","Upper body","Full body"],       muscles: ["Front delts","Side delts","Triceps"],         equipment: ["Barbell","Dumbbell","Smith machine"] },
  { name: "Dumbbell shoulder press",days: ["Push","Shoulder","Upper body","Full body"],       muscles: ["Front delts","Side delts","Triceps"],         equipment: ["Dumbbell"] },
  { name: "Lateral raise",          days: ["Push","Shoulder","Upper body","Full body"],       muscles: ["Side delts"],                                 equipment: ["Dumbbell","Cable machine"] },
  { name: "Front raise",            days: ["Push","Shoulder","Upper body","Full body"],       muscles: ["Front delts","Side delts"],                   equipment: ["Dumbbell","Barbell","Cable machine"] },
  { name: "Arnold press",           days: ["Push","Shoulder","Upper body","Full body"],       muscles: ["Front delts","Side delts","Triceps"],         equipment: ["Dumbbell"] },
  { name: "Tricep pushdown",        days: ["Push","Arms","Back & Triceps","Upper body"],      muscles: ["Triceps"],                                    equipment: ["Cable machine"] },
  { name: "Overhead tricep ext.",   days: ["Push","Arms","Back & Triceps","Upper body"],      muscles: ["Triceps (long head)"],                        equipment: ["Dumbbell","Cable machine","EZ bar"] },
  { name: "Skull crusher",          days: ["Push","Arms","Back & Triceps","Upper body"],      muscles: ["Triceps"],                                    equipment: ["EZ bar","Barbell","Dumbbell"] },
  { name: "Tricep dip",             days: ["Push","Arms","Back & Triceps","Upper body"],      muscles: ["Triceps","Chest","Front delts"],              equipment: ["Bodyweight","Dip machine"] },
  { name: "Close-grip bench press", days: ["Push","Arms","Back & Triceps","Upper body"],      muscles: ["Triceps","Chest"],                            equipment: ["Barbell","Smith machine"] },
  { name: "Pull-up",                days: ["Pull","Back & Biceps","Upper body","Full body"],  muscles: ["Back (lats)","Biceps","Rear delts"],          equipment: ["Bodyweight","Pull-up bar"] },
  { name: "Chin-up",                days: ["Pull","Back & Biceps","Upper body","Full body"],  muscles: ["Back (lats)","Biceps"],                       equipment: ["Bodyweight","Pull-up bar"] },
  { name: "Lat pulldown",           days: ["Pull","Back & Biceps","Upper body","Full body"],  muscles: ["Back (lats)","Biceps"],                       equipment: ["Lat pulldown machine","Cable machine"] },
  { name: "Seated cable row",       days: ["Pull","Back & Biceps","Upper body","Full body"],  muscles: ["Back (mid)","Back (rhomboids)","Biceps"],     equipment: ["Seated row machine","Cable machine"] },
  { name: "Barbell row",            days: ["Pull","Back & Biceps","Upper body","Full body"],  muscles: ["Back (lats)","Back (mid)","Biceps"],          equipment: ["Barbell"] },
  { name: "Dumbbell row",           days: ["Pull","Back & Biceps","Upper body","Full body"],  muscles: ["Back (lats)","Back (mid)","Biceps"],          equipment: ["Dumbbell"] },
  { name: "T-bar row",              days: ["Pull","Back & Biceps","Upper body","Full body"],  muscles: ["Back (lats)","Back (mid)"],                   equipment: ["T-bar row machine","Barbell"] },
  { name: "Face pull",              days: ["Pull","Back & Biceps","Shoulder","Upper body"],   muscles: ["Rear delts","Back (traps)","Rotator cuff"],   equipment: ["Cable machine"] },
  { name: "Straight-arm pulldown",  days: ["Pull","Back & Biceps","Upper body"],              muscles: ["Back (lats)"],                                equipment: ["Cable machine"] },
  { name: "Barbell curl",           days: ["Pull","Arms","Back & Biceps","Chest & Biceps"],   muscles: ["Biceps"],                                     equipment: ["Barbell","EZ bar"] },
  { name: "Dumbbell curl",          days: ["Pull","Arms","Back & Biceps","Chest & Biceps"],   muscles: ["Biceps"],                                     equipment: ["Dumbbell"] },
  { name: "Hammer curl",            days: ["Pull","Arms","Back & Biceps","Chest & Biceps"],   muscles: ["Biceps","Brachialis","Forearms"],             equipment: ["Dumbbell"] },
  { name: "Preacher curl",          days: ["Pull","Arms","Back & Biceps","Chest & Biceps"],   muscles: ["Biceps"],                                     equipment: ["EZ bar","Barbell","Dumbbell"] },
  { name: "Cable curl",             days: ["Pull","Arms","Back & Biceps","Chest & Biceps"],   muscles: ["Biceps"],                                     equipment: ["Cable machine"] },
  { name: "Concentration curl",     days: ["Pull","Arms","Back & Biceps","Chest & Biceps"],   muscles: ["Biceps"],                                     equipment: ["Dumbbell"] },
  { name: "Shrugs",                 days: ["Pull","Back & Biceps","Upper body"],              muscles: ["Back (traps)"],                               equipment: ["Barbell","Dumbbell"] },
  { name: "Barbell squat",          days: ["Legs","Lower body","Full body"],                  muscles: ["Quads","Glutes","Hamstrings"],                equipment: ["Barbell","Smith machine"] },
  { name: "Goblet squat",           days: ["Legs","Lower body","Full body"],                  muscles: ["Quads","Glutes"],                             equipment: ["Dumbbell","Kettlebell"] },
  { name: "Leg press",              days: ["Legs","Lower body","Full body"],                  muscles: ["Quads","Glutes","Hamstrings"],                equipment: ["Leg press machine"] },
  { name: "Hack squat",             days: ["Legs","Lower body","Full body"],                  muscles: ["Quads","Glutes"],                             equipment: ["Hack squat machine","Barbell"] },
  { name: "Romanian deadlift",      days: ["Legs","Lower body","Full body"],                  muscles: ["Hamstrings","Glutes","Lower back"],           equipment: ["Barbell","Dumbbell"] },
  { name: "Conventional deadlift",  days: ["Legs","Lower body","Full body","Back & Biceps"],  muscles: ["Hamstrings","Glutes","Lower back","Traps"],   equipment: ["Barbell"] },
  { name: "Sumo deadlift",          days: ["Legs","Lower body","Full body"],                  muscles: ["Glutes","Hamstrings","Adductors"],            equipment: ["Barbell"] },
  { name: "Leg curl",               days: ["Legs","Lower body","Full body"],                  muscles: ["Hamstrings"],                                 equipment: ["Leg curl machine"] },
  { name: "Leg extension",          days: ["Legs","Lower body","Full body"],                  muscles: ["Quads"],                                      equipment: ["Leg extension machine"] },
  { name: "Hip thrust",             days: ["Legs","Lower body","Full body"],                  muscles: ["Glutes","Hamstrings"],                        equipment: ["Barbell","Hip thrust machine"] },
  { name: "Walking lunges",         days: ["Legs","Lower body","Full body"],                  muscles: ["Quads","Glutes","Hamstrings"],                equipment: ["Bodyweight","Dumbbell","Barbell"] },
  { name: "Bulgarian split squat",  days: ["Legs","Lower body","Full body"],                  muscles: ["Quads","Glutes"],                             equipment: ["Bodyweight","Dumbbell","Barbell"] },
  { name: "Calf raise",             days: ["Legs","Lower body","Full body"],                  muscles: ["Calves"],                                     equipment: ["Calf raise machine","Bodyweight","Barbell"] },
  { name: "Seated calf raise",      days: ["Legs","Lower body","Full body"],                  muscles: ["Calves (soleus)"],                            equipment: ["Seated calf raise machine"] },
  { name: "Adductor machine",       days: ["Legs","Lower body","Full body"],                  muscles: ["Adductors"],                                  equipment: ["Adductor machine"] },
  { name: "Abductor machine",       days: ["Legs","Lower body","Full body"],                  muscles: ["Abductors","Glutes (medius)"],                equipment: ["Abductor machine"] },
  { name: "Reverse fly",            days: ["Shoulder","Back & Biceps","Upper body"],          muscles: ["Rear delts","Back (rhomboids)"],              equipment: ["Dumbbell","Cable machine"] },
  { name: "Upright row",            days: ["Shoulder","Upper body"],                          muscles: ["Side delts","Back (traps)","Biceps"],         equipment: ["Barbell","EZ bar","Cable machine"] },
  { name: "Plank",                  days: ["Full body","Upper body"],                         muscles: ["Core"],                                       equipment: ["Bodyweight"] },
  { name: "Cable crunch",           days: ["Full body","Upper body"],                         muscles: ["Core (abs)"],                                 equipment: ["Cable machine"] },
  { name: "Hanging leg raise",      days: ["Full body","Upper body"],                         muscles: ["Core (abs)","Hip flexors"],                   equipment: ["Pull-up bar"] },
  { name: "Ab wheel rollout",       days: ["Full body","Upper body"],                         muscles: ["Core (abs)","Lats"],                          equipment: ["Ab wheel"] },
];

const DAY_OPTIONS = [
  "Push","Pull","Legs","Back & Biceps","Back & Triceps",
  "Chest & Biceps","Arms","Shoulder","Full body","Upper body","Lower body"
];

/* ── STORAGE ── */
const load = key => JSON.parse(localStorage.getItem(key) || "[]");
const save = (key, val) => localStorage.setItem(key, JSON.stringify(val));

let workouts = load("gt_workouts");
let runs     = load("gt_runs");

/* ── SESSION STATE ── */
let session = {
  active: false,
  day: "",
  date: "",
  startTime: null,
  timerInterval: null,
  exercises: []  // [{ exData, sets: [{reps, weight, done}] }]
};

const $ = id => document.getElementById(id);

/* ── INIT ── */
document.addEventListener("DOMContentLoaded", () => {
  setDefaultDates();
  populateDayDropdowns();
  bindNav();
  bindWorkoutSetup();
  bindSessionControls();
  bindRunForm();
  bindHistory();
  bindCalendar();
  bindRecords();
  renderCalendar();
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
      if (btn.dataset.tab === "records") renderRecords();
      if (btn.dataset.tab === "history") renderHistory();
    });
  });
}

/* ── WORKOUT SETUP ── */
function bindWorkoutSetup() {
  $("w-day").addEventListener("change", () => {
    $("start-session-btn").disabled = !$("w-day").value;
  });
  $("start-session-btn").addEventListener("click", startSession);
}

function startSession() {
  const day  = $("w-day").value;
  const date = $("w-date").value;
  if (!day || !date) return;

  session.active    = true;
  session.day       = day;
  session.date      = date;
  session.startTime = Date.now();
  session.exercises = [];

  $("workout-setup").classList.add("hidden");
  $("workout-session").classList.remove("hidden");
  $("session-day-label").textContent = day;
  $("session-date-label").textContent = formatDate(date);

  startTimer();
  renderExerciseList();
}

function startTimer() {
  if (session.timerInterval) clearInterval(session.timerInterval);
  session.timerInterval = setInterval(() => {
    const elapsed = Math.floor((Date.now() - session.startTime) / 1000);
    const h = Math.floor(elapsed / 3600);
    const m = Math.floor((elapsed % 3600) / 60);
    const s = elapsed % 60;
    $("session-timer").textContent =
      `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;
  }, 1000);
}

/* ── SESSION CONTROLS ── */
function bindSessionControls() {
  $("add-exercise-btn").addEventListener("click", toggleExercisePicker);
  $("exercise-search").addEventListener("input", renderExercisePickerList);
  $("discard-session-btn").addEventListener("click", discardSession);
  $("finish-session-btn").addEventListener("click", finishSession);
}

function toggleExercisePicker() {
  const picker = $("exercise-picker");
  const isHidden = picker.classList.contains("hidden");
  picker.classList.toggle("hidden", !isHidden);
  if (isHidden) {
    $("exercise-search").value = "";
    renderExercisePickerList();
    $("exercise-search").focus();
  }
}

function renderExercisePickerList() {
  const q = $("exercise-search").value.toLowerCase();
  const filtered = EXERCISE_DB
    .filter(e => e.days.includes(session.day))
    .filter(e => !q || e.name.toLowerCase().includes(q))
    .sort((a, b) => a.name.localeCompare(b.name));

  const list = $("exercise-picker-list");
  if (filtered.length === 0) {
    list.innerHTML = `<div style="padding:12px;color:var(--muted);font-size:0.85rem;text-align:center">No exercises found</div>`;
    return;
  }
  list.innerHTML = filtered.map(e => `
    <div class="picker-item" data-name="${e.name}">
      <div class="picker-item-name">${e.name}</div>
      <div class="picker-item-muscles">${e.muscles.slice(0,3).join(" · ")}</div>
    </div>
  `).join("");

  list.querySelectorAll(".picker-item").forEach(item => {
    item.addEventListener("click", () => {
      addExerciseToSession(item.dataset.name);
      $("exercise-picker").classList.add("hidden");
    });
  });
}

function addExerciseToSession(name) {
  const exData = EXERCISE_DB.find(e => e.name === name);
  if (!exData) return;

  // Prefill from last session
  const lastSets = getLastSessionSets(name);
  const sets = lastSets.length > 0
    ? lastSets.map(s => ({ reps: s.reps, weight: s.weight, done: false }))
    : [{ reps: "", weight: "", done: false }];

  session.exercises.push({ exData, sets });
  renderExerciseList();
  // Scroll to the new exercise
  setTimeout(() => {
    const cards = document.querySelectorAll(".exercise-card");
    if (cards.length) cards[cards.length - 1].scrollIntoView({ behavior: "smooth", block: "start" });
  }, 50);
}

function getLastSessionSets(exerciseName) {
  // Find the most recent workout session that included this exercise
  const matching = workouts.filter(w => w.exercise === exerciseName && w.sets_detail);
  if (matching.length === 0) return [];
  matching.sort((a, b) => b.date.localeCompare(a.date));
  return matching[0].sets_detail || [];
}

function getPRInfo(exerciseName) {
  const entries = workouts.filter(w => w.exercise === exerciseName);
  if (entries.length === 0) return null;

  // All-time best weight
  let prWeight = 0, prReps = 0;
  entries.forEach(e => {
    if ((e.sets_detail || []).length > 0) {
      e.sets_detail.forEach(s => {
        if ((s.weight || 0) > prWeight) { prWeight = s.weight; prReps = s.reps; }
        if ((s.reps || 0) > prReps && s.weight === prWeight) prReps = s.reps;
      });
    } else {
      if ((e.weight || 0) > prWeight) { prWeight = e.weight; prReps = e.reps || 0; }
    }
  });

  // Last session
  const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date));
  const last   = sorted[0];
  let lastWeight = 0, lastReps = 0;
  if (last.sets_detail && last.sets_detail.length > 0) {
    const heaviest = last.sets_detail.reduce((a, b) => (b.weight || 0) > (a.weight || 0) ? b : a, last.sets_detail[0]);
    lastWeight = heaviest.weight || 0;
    lastReps   = heaviest.reps   || 0;
  } else {
    lastWeight = last.weight || 0;
    lastReps   = last.reps   || 0;
  }

  return { prWeight, prReps, lastWeight, lastReps };
}

/* ── RENDER EXERCISE LIST ── */
function renderExerciseList() {
  const list = $("exercise-list");
  if (session.exercises.length === 0) {
    list.innerHTML = `<div class="empty-state" style="padding:2rem 1rem">
      <div class="empty-icon">🏋️</div>
      <p>Add your first exercise below</p>
    </div>`;
    return;
  }

  list.innerHTML = session.exercises.map((item, idx) => buildExerciseCard(item, idx)).join("");

  // Bind set inputs
  list.querySelectorAll(".set-input").forEach(input => {
    input.addEventListener("change", (e) => {
      const { exIdx, setIdx, field } = e.target.dataset;
      session.exercises[exIdx].sets[setIdx][field] = e.target.value ? parseFloat(e.target.value) : "";
    });
  });

  // Bind set check buttons
  list.querySelectorAll(".set-check").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const { exIdx, setIdx } = e.target.dataset;
      session.exercises[exIdx].sets[setIdx].done = !session.exercises[exIdx].sets[setIdx].done;
      renderExerciseList();
    });
  });

  // Bind add set buttons
  list.querySelectorAll(".add-set-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const idx = parseInt(e.target.dataset.exIdx);
      const lastSet = session.exercises[idx].sets.slice(-1)[0];
      session.exercises[idx].sets.push({
        reps: lastSet?.reps || "",
        weight: lastSet?.weight || "",
        done: false
      });
      renderExerciseList();
    });
  });

  // Bind delete exercise buttons
  list.querySelectorAll(".exercise-card-del").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const idx = parseInt(e.target.dataset.exIdx);
      session.exercises.splice(idx, 1);
      renderExerciseList();
    });
  });
}

function buildExerciseCard(item, idx) {
  const { exData, sets } = item;
  const primary   = exData.muscles.slice(0, 2);
  const secondary = exData.muscles.slice(2);
  const pr        = getPRInfo(exData.name);

  const diagramHTML = buildMuscleDiagram(primary, secondary);

  const legendHTML = primary.map(m =>
    `<div class="muscle-legend-row"><span class="muscle-dot primary"></span>${m}</div>`
  ).join("") + secondary.map(m =>
    `<div class="muscle-legend-row"><span class="muscle-dot secondary"></span>${m}</div>`
  ).join("");

  const equipHTML = exData.equipment.map(e =>
    `<div class="equip-row"><span class="equip-dot"></span>${e}</div>`
  ).join("");

  const prHTML = pr ? `
    <div class="pr-strip">
      <div class="pr-item">
        <span class="pr-label">Last session</span>
        <span class="pr-value">${pr.lastWeight ? pr.lastWeight + "kg × " + pr.lastReps : "—"}</span>
      </div>
      <div class="pr-divider"></div>
      <div class="pr-item">
        <span class="pr-label">All-time PR</span>
        <span class="pr-value">${pr.prWeight ? pr.prWeight + "kg × " + pr.prReps : "—"}</span>
      </div>
    </div>` : "";

  const setsHTML = sets.map((set, sIdx) => `
    <div class="set-row ${set.done ? "completed" : ""}">
      <span class="set-num">${sIdx + 1}</span>
      <input class="set-input" type="number" min="0" max="999" step="1"
        value="${set.reps || ""}" placeholder="—"
        data-ex-idx="${idx}" data-set-idx="${sIdx}" data-field="reps" />
      <input class="set-input" type="number" min="0" max="9999" step="0.5"
        value="${set.weight || ""}" placeholder="—"
        data-ex-idx="${idx}" data-set-idx="${sIdx}" data-field="weight" />
      <button class="set-check ${set.done ? "done" : ""}"
        data-ex-idx="${idx}" data-set-idx="${sIdx}">✓</button>
    </div>
  `).join("");

  return `
    <div class="exercise-card">
      <div class="exercise-card-header">
        <span class="exercise-card-name">${exData.name}</span>
        <button class="exercise-card-del" data-ex-idx="${idx}">✕</button>
      </div>

      <div class="muscle-section">
        <div class="muscle-diagrams">${diagramHTML}</div>
        <div class="muscle-legend">
          <div class="muscle-legend-title">Muscles</div>
          ${legendHTML}
          <div class="equip-section">${equipHTML}</div>
        </div>
      </div>

      ${prHTML}

      <div class="sets-header">
        <span>Set</span><span>Reps</span><span>kg</span><span></span>
      </div>
      ${setsHTML}
      <div class="add-set-row">
        <button class="add-set-btn" data-ex-idx="${idx}">+ Add set</button>
      </div>
    </div>
  `;
}

/* ── FINISH / DISCARD SESSION ── */
function finishSession() {
  clearInterval(session.timerInterval);

  // Save one workout entry per exercise
  session.exercises.forEach(item => {
    const completedSets = item.sets.filter(s => s.done || s.reps || s.weight);
    if (completedSets.length === 0) return;

    const entry = {
      id:          Date.now() + Math.random(),
      type:        "workout",
      date:        session.date,
      day:         session.day,
      exercise:    item.exData.name,
      muscles:     item.exData.muscles,
      equipment:   item.exData.equipment,
      sets_detail: completedSets,
      sets:        completedSets.length,
      reps:        completedSets[0]?.reps  || null,
      weight:      completedSets[0]?.weight || null,
    };
    workouts.unshift(entry);
  });

  save("gt_workouts", workouts);
  showToast(`Session saved — ${session.exercises.length} exercise${session.exercises.length !== 1 ? "s" : ""} logged 💪`);
  resetSession();
  renderCalendar();
  renderRecords();
}

function discardSession() {
  if (!confirm("Discard this session? All entries will be lost.")) return;
  clearInterval(session.timerInterval);
  showToast("Session discarded");
  resetSession();
}

function resetSession() {
  session = { active: false, day: "", date: "", startTime: null, timerInterval: null, exercises: [] };
  $("workout-session").classList.add("hidden");
  $("workout-setup").classList.remove("hidden");
  $("w-day").value = "";
  $("start-session-btn").disabled = true;
  setDefaultDates();
  $("exercise-list").innerHTML = "";
  $("exercise-picker").classList.add("hidden");
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
  renderCalendar();
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
  if (dayFilter !== "all") items = items.filter(i => i._type === "workout" && i.day === dayFilter);

  const list = $("history-list");
  if (items.length === 0) {
    list.innerHTML = `<div class="empty-state"><div class="empty-icon">📭</div><p>No entries yet. Start logging!</p></div>`;
    return;
  }
  list.innerHTML = items.map(item =>
    item._type === "run" ? renderRunCard(item) : renderWorkoutCard(item)
  ).join("");

  list.querySelectorAll(".history-delete").forEach(btn => {
    btn.addEventListener("click", () => deleteEntry(btn.dataset.id, btn.dataset.type));
  });
}

function renderWorkoutCard(w) {
  const sets = w.sets_detail || [];
  const setsHTML = sets.length > 0
    ? sets.map((s, i) =>
        `<div class="history-exercise-row">Set ${i+1}: <span>${s.reps || "—"} reps · ${s.weight || "—"}kg</span></div>`
      ).join("")
    : (w.sets ? `<div class="history-exercise-row"><span>${w.sets} sets · ${w.reps || "—"} reps · ${w.weight || "—"}kg</span></div>` : "");

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
      ${(w.muscles || []).slice(0,2).map(m => `<span class="badge">${m}</span>`).join("")}
    </div>
    <div class="history-exercises">${setsHTML}</div>
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
  if (type === "workout") {
    workouts = workouts.filter(w => String(w.id) !== String(id));
    save("gt_workouts", workouts);
  } else {
    runs = runs.filter(r => String(r.id) !== String(id));
    save("gt_runs", runs);
  }
  renderHistory();
  renderRecords();
  renderCalendar();
}

/* ── CALENDAR ── */
let calYear, calMonth;
function bindCalendar() {
  const now = new Date();
  calYear = now.getFullYear();
  calMonth = now.getMonth();
  $("cal-prev").addEventListener("click", () => { calMonth--; if (calMonth < 0) { calMonth = 11; calYear--; } renderCalendar(); });
  $("cal-next").addEventListener("click", () => { calMonth++; if (calMonth > 11) { calMonth = 0; calYear++; } renderCalendar(); });
}

function renderCalendar() {
  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  $("cal-title").textContent = `${months[calMonth]} ${calYear}`;

  const actMap = {};
  workouts.forEach(w => { actMap[w.date] = actMap[w.date] || {}; actMap[w.date].workout = true; });
  runs.forEach(r => { actMap[r.date] = actMap[r.date] || {}; actMap[r.date].run = true; });

  const firstDay = new Date(calYear, calMonth, 1).getDay();
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const today = new Date().toISOString().split("T")[0];

  let html = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d =>
    `<div class="cal-day-name">${d}</div>`).join("");

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
      <span class="cal-num">${d}</span>${dots}</div>`;
  }
  $("cal-grid").innerHTML = html;
  $("cal-grid").querySelectorAll(".cal-cell[data-date]").forEach(cell => {
    cell.addEventListener("click", () => showDayDetail(cell.dataset.date));
  });
}

function showDayDetail(date) {
  const dayWorkouts = workouts.filter(w => w.date === date);
  const dayRuns     = runs.filter(r => r.date === date);
  const detail      = $("cal-detail");
  if (dayWorkouts.length === 0 && dayRuns.length === 0) { detail.classList.add("hidden"); return; }

  let html = `<h3>${formatDate(date)}</h3>`;
  dayWorkouts.forEach(w => {
    const sets = (w.sets_detail || []);
    const stats = sets.length > 0
      ? sets.map((s, i) => `Set ${i+1}: ${s.reps||"—"}r · ${s.weight||"—"}kg`).join("  ")
      : [w.sets && `${w.sets}s`, w.reps && `${w.reps}r`, w.weight && `${w.weight}kg`].filter(Boolean).join(" · ");
    html += `<div style="margin-bottom:8px">
      <span style="font-weight:700;font-size:.9rem">${w.exercise}</span>
      <span style="color:var(--muted);font-size:.78rem;margin-left:8px">${w.day}</span>
      ${stats ? `<div style="font-size:.8rem;color:var(--accent2);margin-top:2px">${stats}</div>` : ""}
    </div>`;
  });
  dayRuns.forEach(r => {
    html += `<div style="margin-bottom:8px">
      <span style="font-weight:700;font-size:.9rem">🏃 Run</span>
      ${r.distance ? `<span style="color:var(--muted);font-size:.78rem;margin-left:8px">${r.distance}km</span>` : ""}
      ${r.time ? `<span style="color:var(--muted);font-size:.78rem;margin-left:4px">${r.time}</span>` : ""}
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
  const prMap = {};
  workouts.forEach(w => {
    if (!w.exercise) return;
    if (!prMap[w.exercise]) prMap[w.exercise] = { name: w.exercise, day: w.day, maxWeight: 0, maxReps: 0, lastWeight: 0, lastReps: 0, lastDate: "" };
    const pr = prMap[w.exercise];
    const sets = w.sets_detail || (w.weight ? [{ weight: w.weight, reps: w.reps || 0 }] : []);
    sets.forEach(s => {
      if ((s.weight || 0) > pr.maxWeight) { pr.maxWeight = s.weight; pr.maxReps = s.reps || 0; }
      if ((s.reps || 0) > pr.maxReps && s.weight >= pr.maxWeight) pr.maxReps = s.reps || 0;
    });
    if (w.date >= pr.lastDate) {
      pr.lastDate = w.date;
      const heaviest = sets.reduce((a, b) => (b.weight || 0) > (a.weight || 0) ? b : a, sets[0] || {});
      pr.lastWeight = heaviest.weight || 0;
      pr.lastReps   = heaviest.reps   || 0;
    }
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
          <div class="record-stat-value">${pr.lastWeight ? pr.lastWeight + "kg" : "—"}</div>
          <div class="record-stat-sub">${pr.lastReps ? pr.lastReps + " reps" : ""} ${pr.lastDate ? "· " + formatDate(pr.lastDate) : ""}</div>
        </div>
        <div>
          <div class="record-stat-label">All-time PR</div>
          <div class="record-stat-value">${pr.maxWeight ? pr.maxWeight + "kg" : "—"}</div>
          <div class="record-stat-sub">${pr.maxReps ? pr.maxReps + " reps max" : ""}</div>
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
  setTimeout(() => t.classList.add("hidden"), 2800);
}
