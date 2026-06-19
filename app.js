/* ══════════════════════════════════════════
   SUPABASE CONFIG
   ══════════════════════════════════════════ */
const SUPABASE_URL = "https://nqsfgbbabvgebulgqjrb.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5xc2ZnYmJhYnZnZWJ1bGdxanJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE3ODU1NjIsImV4cCI6MjA5NzM2MTU2Mn0.ga9LykWsCsyzIpOsiAiIk4bkS7EeEvCEFwuHkp7At1U";
const db = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

/* ══════════════════════════════════════════
   MUSCLE COLOR MAP
   ══════════════════════════════════════════ */
const MUSCLE_COLORS = {
  "Chest":              { fill: "#7F77DD", stroke: "#534AB7" },
  "Chest (upper)":      { fill: "#7F77DD", stroke: "#534AB7" },
  "Chest (lower)":      { fill: "#7F77DD", stroke: "#534AB7" },
  "Front delts":        { fill: "#378ADD", stroke: "#185FA5" },
  "Side delts":         { fill: "#378ADD", stroke: "#185FA5" },
  "Rear delts":         { fill: "#378ADD", stroke: "#185FA5" },
  "Triceps":            { fill: "#D4537E", stroke: "#993556" },
  "Triceps (long head)":{ fill: "#D4537E", stroke: "#993556" },
  "Biceps":             { fill: "#5DCAA5", stroke: "#1D9E75" },
  "Brachialis":         { fill: "#5DCAA5", stroke: "#1D9E75" },
  "Forearms":           { fill: "#9FE1CB", stroke: "#5DCAA5" },
  "Back (lats)":        { fill: "#EF9F27", stroke: "#BA7517" },
  "Back (mid)":         { fill: "#EF9F27", stroke: "#BA7517" },
  "Back (traps)":       { fill: "#FAC775", stroke: "#EF9F27" },
  "Back (rhomboids)":   { fill: "#EF9F27", stroke: "#BA7517" },
  "Traps":              { fill: "#FAC775", stroke: "#EF9F27" },
  "Lower back":         { fill: "#F0997B", stroke: "#D85A30" },
  "Rotator cuff":       { fill: "#B5D4F4", stroke: "#378ADD" },
  "Quads":              { fill: "#EF9F27", stroke: "#BA7517" },
  "Hamstrings":         { fill: "#1D9E75", stroke: "#0F6E56" },
  "Glutes":             { fill: "#D85A30", stroke: "#993C1D" },
  "Glutes (medius)":    { fill: "#D85A30", stroke: "#993C1D" },
  "Adductors":          { fill: "#97C459", stroke: "#639922" },
  "Abductors":          { fill: "#97C459", stroke: "#639922" },
  "Calves":             { fill: "#534AB7", stroke: "#3C3489" },
  "Calves (soleus)":    { fill: "#534AB7", stroke: "#3C3489" },
  "Core":               { fill: "#E24B4A", stroke: "#A32D2D" },
  "Core (abs)":         { fill: "#E24B4A", stroke: "#A32D2D" },
  "Hip flexors":        { fill: "#F09595", stroke: "#E24B4A" },
  "Lats":               { fill: "#EF9F27", stroke: "#BA7517" },
};

const MUSCLE_REGION_MAP = {
  "Chest":              { front: ["chest"],        back: [] },
  "Chest (upper)":      { front: ["chest"],        back: [] },
  "Chest (lower)":      { front: ["chest"],        back: [] },
  "Front delts":        { front: ["front-delts"],  back: [] },
  "Side delts":         { front: ["front-delts"],  back: ["rear-delts"] },
  "Rear delts":         { front: [],               back: ["rear-delts"] },
  "Triceps":            { front: [],               back: ["triceps"] },
  "Triceps (long head)":{ front: [],               back: ["triceps"] },
  "Biceps":             { front: ["biceps"],       back: [] },
  "Brachialis":         { front: ["biceps"],       back: [] },
  "Forearms":           { front: ["forearms-f"],   back: ["forearms-b"] },
  "Back (lats)":        { front: [],               back: ["lats"] },
  "Back (mid)":         { front: [],               back: ["lats"] },
  "Back (traps)":       { front: [],               back: ["traps"] },
  "Back (rhomboids)":   { front: [],               back: ["lats"] },
  "Traps":              { front: [],               back: ["traps"] },
  "Lower back":         { front: [],               back: ["lower-back"] },
  "Rotator cuff":       { front: [],               back: ["rear-delts"] },
  "Quads":              { front: ["quads"],        back: [] },
  "Hamstrings":         { front: [],               back: ["hamstrings"] },
  "Glutes":             { front: [],               back: ["glutes"] },
  "Glutes (medius)":    { front: [],               back: ["glutes"] },
  "Adductors":          { front: ["adductors"],    back: [] },
  "Abductors":          { front: [],               back: ["glutes"] },
  "Calves":             { front: [],               back: ["calves"] },
  "Calves (soleus)":    { front: [],               back: ["calves"] },
  "Core":               { front: ["abs"],          back: ["lower-back"] },
  "Core (abs)":         { front: ["abs"],          back: [] },
  "Hip flexors":        { front: ["hip-flexors"],  back: [] },
  "Lats":               { front: [],               back: ["lats"] },
};

/* ── SVG BODY BUILDER ── */
function buildBodySVG(view, regionColorMap) {
  const BASE = "#2a2a2a", BSTR = "#3a3a3a";
  const rc = region => regionColorMap[region]
    ? `fill="${regionColorMap[region].fill}" fill-opacity="0.9" stroke="${regionColorMap[region].stroke}"`
    : `fill="${BASE}" stroke="${BSTR}"`;

  if (view === "front") {
    return `<svg width="52" height="100" viewBox="0 0 52 100" fill="none">
      <ellipse cx="26" cy="9" rx="8" ry="8.5" fill="${BASE}" stroke="${BSTR}" stroke-width="0.8"/>
      <rect x="20" y="18" width="12" height="5" rx="2" fill="${BASE}" stroke="${BSTR}" stroke-width="0.8"/>
      <path d="M10 24 Q8 30 8 40 L44 40 Q44 30 42 24 Q34 22 26 22 Q18 22 10 24Z" ${rc("chest")} stroke-width="0.8"/>
      <ellipse cx="10" cy="28" rx="5" ry="7" ${rc("front-delts")} stroke-width="0.8"/>
      <ellipse cx="42" cy="28" rx="5" ry="7" ${rc("front-delts")} stroke-width="0.8"/>
      <rect x="4" y="33" width="6" height="14" rx="3" ${rc("biceps")} stroke-width="0.8"/>
      <rect x="42" y="33" width="6" height="14" rx="3" ${rc("biceps")} stroke-width="0.8"/>
      <rect x="3" y="47" width="6" height="10" rx="2" ${rc("forearms-f")} stroke-width="0.8"/>
      <rect x="43" y="47" width="6" height="10" rx="2" ${rc("forearms-f")} stroke-width="0.8"/>
      <rect x="18" y="40" width="16" height="12" rx="2" ${rc("abs")} stroke-width="0.8"/>
      <rect x="15" y="52" width="22" height="8" rx="2" ${rc("hip-flexors")} stroke-width="0.8"/>
      <rect x="14" y="60" width="10" height="24" rx="4" ${rc("quads")} stroke-width="0.8"/>
      <rect x="28" y="60" width="10" height="24" rx="4" ${rc("quads")} stroke-width="0.8"/>
      <rect x="15" y="61" width="8" height="8" rx="2" ${rc("adductors")} stroke-width="0.6"/>
      <rect x="29" y="61" width="8" height="8" rx="2" ${rc("adductors")} stroke-width="0.6"/>
      <rect x="15" y="84" width="10" height="14" rx="3" fill="${BASE}" stroke="${BSTR}" stroke-width="0.8"/>
      <rect x="27" y="84" width="10" height="14" rx="3" fill="${BASE}" stroke="${BSTR}" stroke-width="0.8"/>
    </svg>`;
  } else {
    return `<svg width="52" height="100" viewBox="0 0 52 100" fill="none">
      <ellipse cx="26" cy="9" rx="8" ry="8.5" fill="${BASE}" stroke="${BSTR}" stroke-width="0.8"/>
      <rect x="20" y="18" width="12" height="5" rx="2" fill="${BASE}" stroke="${BSTR}" stroke-width="0.8"/>
      <path d="M10 24 Q8 30 8 40 L44 40 Q44 30 42 24 Q34 22 26 22 Q18 22 10 24Z" ${rc("traps")} stroke-width="0.8"/>
      <ellipse cx="10" cy="28" rx="5" ry="7" ${rc("rear-delts")} stroke-width="0.8"/>
      <ellipse cx="42" cy="28" rx="5" ry="7" ${rc("rear-delts")} stroke-width="0.8"/>
      <path d="M10 34 Q16 38 26 38 Q36 38 42 34 L42 44 Q36 46 26 46 Q16 46 10 44Z" ${rc("lats")} stroke-width="0.8"/>
      <rect x="4" y="33" width="6" height="14" rx="3" ${rc("triceps")} stroke-width="0.8"/>
      <rect x="42" y="33" width="6" height="14" rx="3" ${rc("triceps")} stroke-width="0.8"/>
      <rect x="3" y="47" width="6" height="10" rx="2" ${rc("forearms-b")} stroke-width="0.8"/>
      <rect x="43" y="47" width="6" height="10" rx="2" ${rc("forearms-b")} stroke-width="0.8"/>
      <rect x="16" y="46" width="20" height="12" rx="2" ${rc("lower-back")} stroke-width="0.8"/>
      <path d="M14 60 Q16 58 26 58 Q36 58 38 60 L40 72 Q36 76 26 76 Q16 76 12 72Z" ${rc("glutes")} stroke-width="0.8"/>
      <rect x="14" y="60" width="10" height="22" rx="4" ${rc("hamstrings")} stroke-width="0.8"/>
      <rect x="28" y="60" width="10" height="22" rx="4" ${rc("hamstrings")} stroke-width="0.8"/>
      <rect x="15" y="84" width="10" height="14" rx="3" ${rc("calves")} stroke-width="0.8"/>
      <rect x="27" y="84" width="10" height="14" rx="3" ${rc("calves")} stroke-width="0.8"/>
    </svg>`;
  }
}

function buildMuscleDiagram(muscles) {
  const frontMap = {}, backMap = {};
  muscles.forEach(muscle => {
    const color  = MUSCLE_COLORS[muscle];
    const region = MUSCLE_REGION_MAP[muscle];
    if (!color || !region) return;
    region.front.forEach(r => { frontMap[r] = color; });
    region.back.forEach(r  => { backMap[r]  = color; });
  });
  const hasFront = Object.keys(frontMap).length > 0;
  const hasBack  = Object.keys(backMap).length  > 0;
  return `
    <div class="diagram-col" style="opacity:${hasFront?1:0.2}">
      ${buildBodySVG("front", frontMap)}
      <span class="view-label">Front</span>
    </div>
    <div class="diagram-col" style="opacity:${hasBack?1:0.2}">
      ${buildBodySVG("back", backMap)}
      <span class="view-label">Back</span>
    </div>`;
}

/* ══════════════════════════════════════════
   EXERCISE DATABASE
   ══════════════════════════════════════════ */
const EXERCISE_DB = [
  { name: "Barbell bench press",    days: ["Push","Chest & Biceps","Upper body","Full body"], muscles: ["Chest","Front delts","Triceps"],            equipment: ["Barbell","Smith machine"] },
  { name: "Dumbbell bench press",   days: ["Push","Chest & Biceps","Upper body","Full body"], muscles: ["Chest","Front delts","Triceps"],            equipment: ["Dumbbell"] },
  { name: "Incline bench press",    days: ["Push","Chest & Biceps","Upper body","Full body"], muscles: ["Chest (upper)","Front delts","Triceps"],    equipment: ["Barbell","Dumbbell","Smith machine"] },
  { name: "Decline bench press",    days: ["Push","Chest & Biceps","Upper body","Full body"], muscles: ["Chest (lower)","Triceps"],                  equipment: ["Barbell","Dumbbell","Smith machine"] },
  { name: "Chest fly",              days: ["Push","Chest & Biceps","Upper body","Full body"], muscles: ["Chest","Front delts"],                      equipment: ["Dumbbell","Cable machine","Pec deck machine"] },
  { name: "Cable chest fly",        days: ["Push","Chest & Biceps","Upper body","Full body"], muscles: ["Chest","Front delts"],                      equipment: ["Cable machine"] },
  { name: "Push-up",                days: ["Push","Chest & Biceps","Upper body","Full body"], muscles: ["Chest","Front delts","Triceps"],            equipment: ["Bodyweight"] },
  { name: "Overhead press",         days: ["Push","Shoulder","Upper body","Full body"],       muscles: ["Front delts","Side delts","Triceps"],       equipment: ["Barbell","Dumbbell","Smith machine"] },
  { name: "Dumbbell shoulder press",days: ["Push","Shoulder","Upper body","Full body"],       muscles: ["Front delts","Side delts","Triceps"],       equipment: ["Dumbbell"] },
  { name: "Lateral raise",          days: ["Push","Shoulder","Upper body","Full body"],       muscles: ["Side delts"],                               equipment: ["Dumbbell","Cable machine"] },
  { name: "Front raise",            days: ["Push","Shoulder","Upper body","Full body"],       muscles: ["Front delts","Side delts"],                 equipment: ["Dumbbell","Barbell","Cable machine"] },
  { name: "Arnold press",           days: ["Push","Shoulder","Upper body","Full body"],       muscles: ["Front delts","Side delts","Triceps"],       equipment: ["Dumbbell"] },
  { name: "Tricep pushdown",        days: ["Push","Arms","Back & Triceps","Upper body"],      muscles: ["Triceps"],                                  equipment: ["Cable machine"] },
  { name: "Overhead tricep ext.",   days: ["Push","Arms","Back & Triceps","Upper body"],      muscles: ["Triceps (long head)"],                      equipment: ["Dumbbell","Cable machine","EZ bar"] },
  { name: "Skull crusher",          days: ["Push","Arms","Back & Triceps","Upper body"],      muscles: ["Triceps"],                                  equipment: ["EZ bar","Barbell","Dumbbell"] },
  { name: "Tricep dip",             days: ["Push","Arms","Back & Triceps","Upper body"],      muscles: ["Triceps","Chest","Front delts"],            equipment: ["Bodyweight","Dip machine"] },
  { name: "Close-grip bench press", days: ["Push","Arms","Back & Triceps","Upper body"],      muscles: ["Triceps","Chest"],                          equipment: ["Barbell","Smith machine"] },
  { name: "Pull-up",                days: ["Pull","Back & Biceps","Upper body","Full body"],  muscles: ["Back (lats)","Biceps","Rear delts"],        equipment: ["Bodyweight","Pull-up bar"] },
  { name: "Chin-up",                days: ["Pull","Back & Biceps","Upper body","Full body"],  muscles: ["Back (lats)","Biceps"],                     equipment: ["Bodyweight","Pull-up bar"] },
  { name: "Lat pulldown",           days: ["Pull","Back & Biceps","Upper body","Full body"],  muscles: ["Back (lats)","Biceps"],                     equipment: ["Lat pulldown machine","Cable machine"] },
  { name: "Seated cable row",       days: ["Pull","Back & Biceps","Upper body","Full body"],  muscles: ["Back (mid)","Back (rhomboids)","Biceps"],   equipment: ["Seated row machine","Cable machine"] },
  { name: "Barbell row",            days: ["Pull","Back & Biceps","Upper body","Full body"],  muscles: ["Back (lats)","Back (mid)","Biceps"],        equipment: ["Barbell"] },
  { name: "Dumbbell row",           days: ["Pull","Back & Biceps","Upper body","Full body"],  muscles: ["Back (lats)","Back (mid)","Biceps"],        equipment: ["Dumbbell"] },
  { name: "T-bar row",              days: ["Pull","Back & Biceps","Upper body","Full body"],  muscles: ["Back (lats)","Back (mid)"],                 equipment: ["T-bar row machine","Barbell"] },
  { name: "Face pull",              days: ["Pull","Back & Biceps","Shoulder","Upper body"],   muscles: ["Rear delts","Back (traps)","Rotator cuff"], equipment: ["Cable machine"] },
  { name: "Straight-arm pulldown",  days: ["Pull","Back & Biceps","Upper body"],              muscles: ["Back (lats)"],                              equipment: ["Cable machine"] },
  { name: "Barbell curl",           days: ["Pull","Arms","Back & Biceps","Chest & Biceps"],   muscles: ["Biceps"],                                   equipment: ["Barbell","EZ bar"] },
  { name: "Dumbbell curl",          days: ["Pull","Arms","Back & Biceps","Chest & Biceps"],   muscles: ["Biceps"],                                   equipment: ["Dumbbell"] },
  { name: "Hammer curl",            days: ["Pull","Arms","Back & Biceps","Chest & Biceps"],   muscles: ["Biceps","Brachialis","Forearms"],           equipment: ["Dumbbell"] },
  { name: "Preacher curl",          days: ["Pull","Arms","Back & Biceps","Chest & Biceps"],   muscles: ["Biceps"],                                   equipment: ["EZ bar","Barbell","Dumbbell"] },
  { name: "Cable curl",             days: ["Pull","Arms","Back & Biceps","Chest & Biceps"],   muscles: ["Biceps"],                                   equipment: ["Cable machine"] },
  { name: "Concentration curl",     days: ["Pull","Arms","Back & Biceps","Chest & Biceps"],   muscles: ["Biceps"],                                   equipment: ["Dumbbell"] },
  { name: "Shrugs",                 days: ["Pull","Back & Biceps","Upper body"],              muscles: ["Back (traps)"],                             equipment: ["Barbell","Dumbbell"] },
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
  { name: "Reverse fly",            days: ["Shoulder","Back & Biceps","Upper body"],          muscles: ["Rear delts","Back (rhomboids)"],            equipment: ["Dumbbell","Cable machine"] },
  { name: "Upright row",            days: ["Shoulder","Upper body"],                          muscles: ["Side delts","Back (traps)","Biceps"],       equipment: ["Barbell","EZ bar","Cable machine"] },
  { name: "Plank",                  days: ["Full body","Upper body"],                         muscles: ["Core"],                                     equipment: ["Bodyweight"] },
  { name: "Cable crunch",           days: ["Full body","Upper body"],                         muscles: ["Core (abs)"],                               equipment: ["Cable machine"] },
  { name: "Hanging leg raise",      days: ["Full body","Upper body"],                         muscles: ["Core (abs)","Hip flexors"],                 equipment: ["Pull-up bar"] },
  { name: "Ab wheel rollout",       days: ["Full body","Upper body"],                         muscles: ["Core (abs)","Lats"],                        equipment: ["Ab wheel"] },
];

const DAY_OPTIONS = [
  "Push","Pull","Legs","Back & Biceps","Back & Triceps",
  "Chest & Biceps","Arms","Shoulder","Full body","Upper body","Lower body"
];

/* ══════════════════════════════════════════
   IN-MEMORY STATE (populated from Supabase)
   ══════════════════════════════════════════ */
let workouts = [];
let runs     = [];
let shoes    = [];

let session = { active:false, day:"", date:"", startTime:null, timerInterval:null, exercises:[] };
let expandedSessions = new Set();
let editingShoeId = null;

const $ = id => document.getElementById(id);

/* ══════════════════════════════════════════
   SUPABASE DATA LAYER
   ══════════════════════════════════════════ */
async function loadAll() {
  showLoadingOverlay(true);
  try {
    const [wRes, rRes, sRes] = await Promise.all([
      db.from("workouts").select("*").order("created_at", { ascending: false }),
      db.from("runs").select("*").order("created_at", { ascending: false }),
      db.from("shoes").select("*").order("created_at", { ascending: true }),
    ]);
    workouts = (wRes.data || []).map(normalizeWorkout);
    runs     = rRes.data  || [];
    shoes    = sRes.data  || [];
  } catch(e) {
    console.error("Load error:", e);
    showToast("Failed to load data — check connection");
  }
  showLoadingOverlay(false);
}

// Supabase uses snake_case columns — normalize to camelCase for the rest of the app
function normalizeWorkout(w) {
  return {
    ...w,
    sessionId:  w.session_id,
    sets_detail: w.sets_detail || [],
  };
}

async function insertWorkout(entry) {
  const { error } = await db.from("workouts").insert({
    id:          Math.floor(entry.id),
    session_id:  entry.sessionId,
    date:        entry.date,
    day:         entry.day,
    exercise:    entry.exercise,
    muscles:     entry.muscles,
    equipment:   entry.equipment,
    sets_detail: entry.sets_detail,
    sets:        entry.sets,
    reps:        entry.reps,
    weight:      entry.weight,
    duration:    entry.duration,
  });
  if (error) throw error;
}

async function deleteWorkoutsBySession(sessionKey) {
  // sessionKey is either the numeric sessionId or "date_day"
  const isNumeric = /^\d+$/.test(sessionKey);
  let query;
  if (isNumeric) {
    query = db.from("workouts").delete().eq("session_id", parseInt(sessionKey));
  } else {
    const [date, ...dayParts] = sessionKey.split("_");
    const day = dayParts.join("_");
    query = db.from("workouts").delete().eq("date", date).eq("day", day).is("session_id", null);
  }
  const { error } = await query;
  if (error) throw error;
}

async function insertRun(entry) {
  const { error } = await db.from("runs").insert({
    id:        entry.id,
    date:      entry.date,
    distance:  entry.distance,
    time:      entry.time,
    location:  entry.location,
    shoe_id:   entry.shoeId ? parseInt(entry.shoeId) : null,
    shoe_name: entry.shoeName,
    notes:     entry.notes,
  });
  if (error) throw error;
}

async function deleteRun(id) {
  const { error } = await db.from("runs").delete().eq("id", id);
  if (error) throw error;
}

async function insertShoe(shoe) {
  const { data, error } = await db.from("shoes").insert({
    id:     shoe.id,
    brand:  shoe.brand,
    model:  shoe.model,
    km:     shoe.km || 0,
    max_km: shoe.maxKm || null,
    notes:  shoe.notes || null,
  }).select().single();
  if (error) throw error;
  return data;
}

async function updateShoe(id, fields) {
  const mapped = {};
  if (fields.brand   !== undefined) mapped.brand   = fields.brand;
  if (fields.model   !== undefined) mapped.model   = fields.model;
  if (fields.km      !== undefined) mapped.km      = fields.km;
  if (fields.maxKm   !== undefined) mapped.max_km  = fields.maxKm;
  if (fields.notes   !== undefined) mapped.notes   = fields.notes;
  const { error } = await db.from("shoes").update(mapped).eq("id", id);
  if (error) throw error;
}

async function deleteShoe(id) {
  const { error } = await db.from("shoes").delete().eq("id", id);
  if (error) throw error;
}

/* ── LOADING OVERLAY ── */
function showLoadingOverlay(show) {
  let el = document.getElementById("loading-overlay");
  if (show && !el) {
    el = document.createElement("div");
    el.id = "loading-overlay";
    el.style.cssText = `
      position:fixed;inset:0;background:rgba(15,15,15,0.85);
      display:flex;align-items:center;justify-content:center;
      z-index:9999;font-size:1rem;color:#888;flex-direction:column;gap:12px;`;
    el.innerHTML = `<div style="font-size:2rem">⏳</div><div>Loading your data…</div>`;
    document.body.appendChild(el);
  } else if (!show && el) {
    el.remove();
  }
}

/* ══════════════════════════════════════════
   INIT
   ══════════════════════════════════════════ */
document.addEventListener("DOMContentLoaded", async () => {
  setDefaultDates();
  populateDayDropdowns();
  bindNav();
  bindWorkoutSetup();
  bindSessionControls();
  bindRunForm();
  bindHistory();
  bindCalendar();
  bindRecords();
  bindShoes();

  await loadAll();

  renderCalendar();
  renderHistory();
  renderRecords();
  renderShoes();
  populateShoeDropdown();
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

function populateShoeDropdown() {
  const sel = $("r-shoe");
  const cur = sel.value;
  sel.innerHTML = '<option value="">No shoe selected</option>';
  shoes.forEach(s => {
    const o = document.createElement("option");
    o.value = s.id;
    o.textContent = `${s.brand} ${s.model}`;
    sel.appendChild(o);
  });
  if (cur) sel.value = cur;
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
      if (btn.dataset.tab === "shoes")   renderShoes();
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
  const day = $("w-day").value, date = $("w-date").value;
  if (!day || !date) return;
  session = { active:true, day, date, startTime:Date.now(), timerInterval:null, exercises:[] };
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
    const e = Math.floor((Date.now() - session.startTime) / 1000);
    $("session-timer").textContent =
      `${String(Math.floor(e/3600)).padStart(2,"0")}:${String(Math.floor((e%3600)/60)).padStart(2,"0")}:${String(e%60).padStart(2,"0")}`;
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
  const alreadyAdded = new Set(session.exercises.map(e => e.exData.name));
  const filtered = EXERCISE_DB
    .filter(e => e.days.includes(session.day))
    .filter(e => !alreadyAdded.has(e.name))
    .filter(e => !q || e.name.toLowerCase().includes(q))
    .sort((a, b) => a.name.localeCompare(b.name));

  const list = $("exercise-picker-list");
  if (!filtered.length) {
    list.innerHTML = `<div style="padding:12px;color:var(--muted);font-size:0.85rem;text-align:center">
      ${alreadyAdded.size > 0 && !q ? "All exercises for this day have been added" : "No exercises found"}
    </div>`;
    return;
  }
  list.innerHTML = filtered.map(e => `
    <div class="picker-item" data-name="${e.name}">
      <div class="picker-item-name">${e.name}</div>
      <div class="picker-item-muscles">${e.muscles.slice(0,3).join(" · ")}</div>
    </div>`).join("");
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
  const lastSets = getLastSessionSets(name);
  const sets = lastSets.length > 0
    ? lastSets.map(s => ({ reps: s.reps, weight: s.weight, done: false }))
    : [{ reps: "", weight: "", done: false }];
  session.exercises.push({ exData, sets });
  renderExerciseList();
  setTimeout(() => {
    const cards = document.querySelectorAll(".exercise-card");
    if (cards.length) cards[cards.length-1].scrollIntoView({ behavior:"smooth", block:"start" });
  }, 50);
}

function getLastSessionSets(exerciseName) {
  const matching = workouts.filter(w => w.exercise === exerciseName && w.sets_detail?.length);
  if (!matching.length) return [];
  matching.sort((a, b) => b.date.localeCompare(a.date));
  return matching[0].sets_detail || [];
}

function getPRInfo(exerciseName) {
  const entries = workouts.filter(w => w.exercise === exerciseName);
  if (!entries.length) return null;
  let prWeight = 0, prReps = 0;
  entries.forEach(e => {
    (e.sets_detail || (e.weight ? [{ weight: e.weight, reps: e.reps||0 }] : [])).forEach(s => {
      if ((s.weight||0) > prWeight) { prWeight = s.weight; prReps = s.reps||0; }
      if ((s.reps||0) > prReps && (s.weight||0) >= prWeight) prReps = s.reps||0;
    });
  });
  const sorted = [...entries].sort((a,b) => b.date.localeCompare(a.date));
  const last = sorted[0];
  const lastSets = last.sets_detail || (last.weight ? [{ weight: last.weight, reps: last.reps||0 }] : []);
  const heaviest = lastSets.reduce((a,b) => (b.weight||0) > (a.weight||0) ? b : a, lastSets[0]||{});
  return { prWeight, prReps, lastWeight: heaviest.weight||0, lastReps: heaviest.reps||0 };
}

/* ── RENDER EXERCISE LIST ── */
function renderExerciseList() {
  const list = $("exercise-list");
  if (!session.exercises.length) {
    list.innerHTML = `<div class="empty-state" style="padding:2rem 1rem"><div class="empty-icon">🏋️</div><p>Add your first exercise below</p></div>`;
    return;
  }
  list.innerHTML = session.exercises.map((item, idx) => buildExerciseCard(item, idx)).join("");

  list.querySelectorAll(".set-input").forEach(input => {
    input.addEventListener("change", e => {
      const { exIdx, setIdx, field } = e.target.dataset;
      session.exercises[exIdx].sets[setIdx][field] = e.target.value ? parseFloat(e.target.value) : "";
    });
  });
  list.querySelectorAll(".set-check").forEach(btn => {
    btn.addEventListener("click", e => {
      const { exIdx, setIdx } = e.target.dataset;
      session.exercises[exIdx].sets[setIdx].done = !session.exercises[exIdx].sets[setIdx].done;
      renderExerciseList();
    });
  });
  list.querySelectorAll(".add-set-btn").forEach(btn => {
    btn.addEventListener("click", e => {
      const idx = parseInt(e.target.dataset.exIdx);
      const last = session.exercises[idx].sets.slice(-1)[0];
      session.exercises[idx].sets.push({ reps: last?.reps||"", weight: last?.weight||"", done: false });
      renderExerciseList();
    });
  });
  list.querySelectorAll(".exercise-card-del").forEach(btn => {
    btn.addEventListener("click", e => {
      session.exercises.splice(parseInt(e.target.dataset.exIdx), 1);
      renderExerciseList();
    });
  });
}

function buildExerciseCard(item, idx) {
  const { exData, sets } = item;
  const pr = getPRInfo(exData.name);
  const diagramHTML = buildMuscleDiagram(exData.muscles);
  const legendHTML = exData.muscles.map(m => {
    const c = MUSCLE_COLORS[m] || { fill: "#888" };
    return `<div class="muscle-legend-row">
      <span class="muscle-dot" style="background:${c.fill};width:9px;height:9px;border-radius:50%;flex-shrink:0;display:inline-block"></span>${m}
    </div>`;
  }).join("");
  const equipHTML = exData.equipment.map(e =>
    `<div class="equip-row"><span class="equip-dot"></span>${e}</div>`).join("");
  const prHTML = pr ? `
    <div class="pr-strip">
      <div class="pr-item"><span class="pr-label">Last session</span>
        <span class="pr-value">${pr.lastWeight ? pr.lastWeight+"kg × "+pr.lastReps : "—"}</span></div>
      <div class="pr-divider"></div>
      <div class="pr-item"><span class="pr-label">All-time PR</span>
        <span class="pr-value">${pr.prWeight ? pr.prWeight+"kg × "+pr.prReps : "—"}</span></div>
    </div>` : "";
  const setsHTML = sets.map((set, sIdx) => `
    <div class="set-row ${set.done?"completed":""}">
      <span class="set-num">${sIdx+1}</span>
      <input class="set-input" type="number" min="0" max="999" step="1"
        value="${set.reps||""}" placeholder="—"
        data-ex-idx="${idx}" data-set-idx="${sIdx}" data-field="reps"/>
      <input class="set-input" type="number" min="0" max="9999" step="0.5"
        value="${set.weight||""}" placeholder="—"
        data-ex-idx="${idx}" data-set-idx="${sIdx}" data-field="weight"/>
      <button class="set-check ${set.done?"done":""}"
        data-ex-idx="${idx}" data-set-idx="${sIdx}">✓</button>
    </div>`).join("");

  return `<div class="exercise-card">
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
    <div class="sets-header"><span>Set</span><span>Reps</span><span>kg</span><span></span></div>
    ${setsHTML}
    <div class="add-set-row"><button class="add-set-btn" data-ex-idx="${idx}">+ Add set</button></div>
  </div>`;
}

/* ── FINISH / DISCARD ── */
async function finishSession() {
  clearInterval(session.timerInterval);
  const duration  = Math.floor((Date.now() - session.startTime) / 1000);
  const sessionId = Date.now();
  const toInsert  = [];

  session.exercises.forEach(item => {
    const completed = item.sets.filter(s => s.done || s.reps || s.weight);
    if (!completed.length) return;
    toInsert.push({
      id:         sessionId + Math.random(),
      sessionId,
      type:       "workout",
      date:       session.date,
      day:        session.day,
      exercise:   item.exData.name,
      muscles:    item.exData.muscles,
      equipment:  item.exData.equipment,
      sets_detail:completed,
      sets:       completed.length,
      reps:       completed[0]?.reps  || null,
      weight:     completed[0]?.weight || null,
      duration,
    });
  });

  try {
    await Promise.all(toInsert.map(e => insertWorkout(e)));
    workouts = [...toInsert.map(normalizeWorkout), ...workouts];
    showToast(`Session saved — ${toInsert.length} exercise${toInsert.length!==1?"s":""} logged 💪`);
    resetSession();
    renderCalendar();
    renderRecords();
    renderHistory();
  } catch(e) {
    console.error(e);
    showToast("Error saving session — check connection");
  }
}

function discardSession() {
  if (!confirm("Discard this session? All entries will be lost.")) return;
  clearInterval(session.timerInterval);
  showToast("Session discarded");
  resetSession();
}

function resetSession() {
  session = { active:false, day:"", date:"", startTime:null, timerInterval:null, exercises:[] };
  $("workout-session").classList.add("hidden");
  $("workout-setup").classList.remove("hidden");
  $("w-day").value = "";
  $("start-session-btn").disabled = true;
  setDefaultDates();
  $("exercise-list").innerHTML = "";
  $("exercise-picker").classList.add("hidden");
}

/* ── RUN FORM ── */
function bindRunForm() { $("run-form").addEventListener("submit", saveRun); }

async function saveRun(e) {
  e.preventDefault();
  const shoeId = $("r-shoe").value;
  const shoe   = shoes.find(s => s.id == shoeId);
  const dist   = parseFloat($("r-distance").value) || 0;
  const entry  = {
    id:       Date.now(),
    type:     "run",
    date:     $("r-date").value,
    distance: dist || null,
    time:     $("r-time").value.trim(),
    location: $("r-location").value.trim(),
    shoeId:   shoeId || null,
    shoeName: shoe ? `${shoe.brand} ${shoe.model}` : null,
    notes:    $("r-notes").value.trim(),
  };
  try {
    await insertRun(entry);
    runs.unshift(entry);
    if (shoe && dist) {
      const newKm = (shoe.km || 0) + dist;
      await updateShoe(shoe.id, { km: newKm });
      shoe.km = newKm;
      renderShoes();
    }
    showToast("Run saved! 🏃");
    $("run-form").reset();
    setDefaultDates();
    renderCalendar();
    renderHistory();
  } catch(err) {
    console.error(err);
    showToast("Error saving run — check connection");
  }
}

/* ── HISTORY ── */
function bindHistory() {
  $("filter-type").addEventListener("change", renderHistory);
  $("filter-day").addEventListener("change", renderHistory);
}

function renderHistory() {
  const typeFilter = $("filter-type").value;
  const dayFilter  = $("filter-day").value;

  const sessionMap = {};
  workouts.forEach(w => {
    if (typeFilter === "run") return;
    if (dayFilter !== "all" && w.day !== dayFilter) return;
    const key = w.sessionId ? String(w.sessionId) : `${w.date}_${w.day}`;
    if (!sessionMap[key]) {
      sessionMap[key] = { key, type:"workout", date:w.date, day:w.day, duration:w.duration||null, exercises:[] };
    }
    sessionMap[key].exercises.push(w);
  });

  let items = Object.values(sessionMap).map(s => ({ ...s, _sort: s.date }));
  if (typeFilter !== "workout") {
    runs.forEach(r => {
      const rNorm = { ...r, shoeId: r.shoe_id || r.shoeId, shoeName: r.shoe_name || r.shoeName };
      items.push({ ...rNorm, _sort: r.date, type:"run" });
    });
  }
  items.sort((a, b) => b._sort.localeCompare(a._sort));

  const list = $("history-list");
  if (!items.length) {
    list.innerHTML = `<div class="empty-state"><div class="empty-icon">📭</div><p>No entries yet. Start logging!</p></div>`;
    return;
  }
  list.innerHTML = items.map(item =>
    item.type === "run" ? renderRunSessionCard(item) : renderWorkoutSessionCard(item)
  ).join("");

  list.querySelectorAll(".session-card-header").forEach(header => {
    header.addEventListener("click", () => {
      const key = header.dataset.key;
      if (expandedSessions.has(key)) expandedSessions.delete(key);
      else expandedSessions.add(key);
      renderHistory();
    });
  });
  list.querySelectorAll(".history-delete").forEach(btn => {
    btn.addEventListener("click", e => {
      e.stopPropagation();
      deleteEntry(btn.dataset.id, btn.dataset.type, btn.dataset.sessionId);
    });
  });
}

function renderWorkoutSessionCard(s) {
  const key = s.key;
  const isOpen = expandedSessions.has(key);
  const dur = s.duration ? fmtDuration(s.duration) : null;

  const previewHTML = `<div class="session-card-preview">
    ${s.exercises.map(e => `<span class="preview-pill">${e.exercise}</span>`).join("")}
  </div>`;

  const bodyHTML = `<div class="session-card-body">
    ${s.exercises.map(ex => {
      const sets = ex.sets_detail || [];
      return `<div class="session-exercise-row">
        <div>
          <div class="session-ex-name">${ex.exercise}</div>
          <div class="session-ex-muscles">${(ex.muscles||[]).slice(0,3).join(" · ")}</div>
        </div>
        <div class="session-ex-sets">
          <div class="session-ex-set-label">${sets.length} set${sets.length!==1?"s":""}</div>
          ${sets.map(s => `<div class="session-ex-set-row">${s.reps||"—"} × ${s.weight||"—"}kg</div>`).join("")}
        </div>
      </div>`;
    }).join("")}
    <div style="padding:8px 16px;text-align:right">
      <button class="history-delete" style="opacity:1;position:static;font-size:0.75rem;color:var(--muted)"
        data-id="${s.exercises[0]?.id}" data-type="workout-session" data-session-id="${key}">Delete session</button>
    </div>
  </div>`;

  return `<div class="session-card workout-session">
    <div class="session-card-header" data-key="${key}">
      <div class="session-card-left">
        <div class="session-card-title">${s.day}</div>
        <div class="session-card-meta">
          <span class="session-card-date">${formatDate(s.date)}</span>
          <span class="badge accent">${s.exercises.length} exercise${s.exercises.length!==1?"s":""}</span>
          ${dur ? `<span class="badge">${dur}</span>` : ""}
        </div>
      </div>
      <div class="session-card-right">
        <span class="session-chevron ${isOpen?"open":""}">▾</span>
      </div>
    </div>
    ${isOpen ? bodyHTML : previewHTML}
  </div>`;
}

function renderRunSessionCard(r) {
  const key = String(r.id);
  const isOpen = expandedSessions.has(key);
  const pace = r.distance && r.time ? calcPace(r.time, r.distance) : null;
  const shoeName = r.shoeName || r.shoe_name;

  const previewHTML = `<div class="session-card-preview">
    ${r.location ? `<span class="preview-pill">📍 ${r.location}</span>` : ""}
    ${pace ? `<span class="preview-pill">${pace} /km pace</span>` : ""}
    ${shoeName ? `<span class="preview-pill">👟 ${shoeName}</span>` : ""}
  </div>`;

  const bodyHTML = `<div class="session-card-body">
    <div class="session-run-detail">
      ${r.distance ? `<div class="session-run-stat"><div class="session-run-val">${r.distance} km</div><div class="session-run-lbl">Distance</div></div>` : ""}
      ${r.time     ? `<div class="session-run-stat"><div class="session-run-val">${r.time}</div><div class="session-run-lbl">Time</div></div>` : ""}
      ${pace       ? `<div class="session-run-stat"><div class="session-run-val">${pace}</div><div class="session-run-lbl">Pace /km</div></div>` : ""}
    </div>
    ${r.location ? `<div style="padding:0 16px 8px;font-size:0.82rem;color:var(--muted)">📍 ${r.location}</div>` : ""}
    ${shoeName   ? `<div style="padding:0 16px 8px;font-size:0.82rem;color:var(--muted)">👟 ${shoeName}</div>` : ""}
    ${r.notes    ? `<div style="padding:0 16px 10px;font-size:0.82rem;color:var(--muted);font-style:italic">${r.notes}</div>` : ""}
    <div style="padding:8px 16px;text-align:right">
      <button class="history-delete" style="opacity:1;position:static;font-size:0.75rem;color:var(--muted)"
        data-id="${r.id}" data-type="run">Delete</button>
    </div>
  </div>`;

  return `<div class="session-card run-session">
    <div class="session-card-header" data-key="${key}">
      <div class="session-card-left">
        <div class="session-card-title">🏃 Run</div>
        <div class="session-card-meta">
          <span class="session-card-date">${formatDate(r.date)}</span>
          ${r.distance ? `<span class="badge blue">${r.distance} km</span>` : ""}
          ${r.time     ? `<span class="badge">${r.time}</span>` : ""}
        </div>
      </div>
      <div class="session-card-right">
        <span class="session-chevron ${isOpen?"open":""}">▾</span>
      </div>
    </div>
    ${isOpen ? bodyHTML : previewHTML}
  </div>`;
}

async function deleteEntry(id, type, sessionKey) {
  try {
    if (type === "workout-session") {
      await deleteWorkoutsBySession(sessionKey);
      workouts = workouts.filter(w => {
        const wKey = w.sessionId ? String(w.sessionId) : `${w.date}_${w.day}`;
        return wKey !== sessionKey;
      });
    } else if (type === "run") {
      const run = runs.find(r => String(r.id) === String(id));
      const shoeId = run?.shoe_id || run?.shoeId;
      const dist   = run?.distance;
      if (shoeId && dist) {
        const shoe = shoes.find(s => s.id == shoeId);
        if (shoe) {
          const newKm = Math.max(0, (shoe.km||0) - dist);
          await updateShoe(shoe.id, { km: newKm });
          shoe.km = newKm;
          renderShoes();
        }
      }
      await deleteRun(id);
      runs = runs.filter(r => String(r.id) !== String(id));
    }
    expandedSessions.delete(sessionKey || id);
    renderHistory();
    renderRecords();
    renderCalendar();
  } catch(e) {
    console.error(e);
    showToast("Error deleting — check connection");
  }
}

/* ── CALENDAR ── */
let calYear, calMonth;
function bindCalendar() {
  const now = new Date();
  calYear = now.getFullYear(); calMonth = now.getMonth();
  $("cal-prev").addEventListener("click", () => { calMonth--; if(calMonth<0){calMonth=11;calYear--;} renderCalendar(); });
  $("cal-next").addEventListener("click", () => { calMonth++; if(calMonth>11){calMonth=0;calYear++;} renderCalendar(); });
}
function renderCalendar() {
  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  $("cal-title").textContent = `${months[calMonth]} ${calYear}`;
  const actMap = {};
  workouts.forEach(w => { actMap[w.date]=actMap[w.date]||{}; actMap[w.date].workout=true; });
  runs.forEach(r => { actMap[r.date]=actMap[r.date]||{}; actMap[r.date].run=true; });
  const firstDay = new Date(calYear, calMonth, 1).getDay();
  const daysInMonth = new Date(calYear, calMonth+1, 0).getDate();
  const today = new Date().toISOString().split("T")[0];
  let html = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d=>`<div class="cal-day-name">${d}</div>`).join("");
  for (let i=0;i<firstDay;i++) html+=`<div class="cal-cell empty"><span class="cal-num"></span></div>`;
  for (let d=1;d<=daysInMonth;d++) {
    const ds=`${calYear}-${String(calMonth+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
    const act=actMap[ds]||{};
    let dots="";
    if(act.workout&&act.run) dots=`<div class="cal-dot-row"><span class="dot dot-both"></span></div>`;
    else if(act.workout) dots=`<div class="cal-dot-row"><span class="dot dot-workout"></span></div>`;
    else if(act.run) dots=`<div class="cal-dot-row"><span class="dot dot-run"></span></div>`;
    html+=`<div class="cal-cell${ds===today?" today":""}" data-date="${ds}"><span class="cal-num">${d}</span>${dots}</div>`;
  }
  $("cal-grid").innerHTML=html;
  $("cal-grid").querySelectorAll(".cal-cell[data-date]").forEach(cell=>{
    cell.addEventListener("click",()=>showDayDetail(cell.dataset.date));
  });
}
function showDayDetail(date) {
  const dw=workouts.filter(w=>w.date===date);
  const dr=runs.filter(r=>r.date===date);
  const detail=$("cal-detail");
  if(!dw.length&&!dr.length){detail.classList.add("hidden");return;}
  let html=`<h3>${formatDate(date)}</h3>`;
  const seen=new Set();
  dw.forEach(w=>{
    if(seen.has(w.exercise))return; seen.add(w.exercise);
    const sets=(w.sets_detail||[]);
    const stats=sets.map((s,i)=>`Set ${i+1}: ${s.reps||"—"}r · ${s.weight||"—"}kg`).join("  ");
    html+=`<div style="margin-bottom:8px"><span style="font-weight:700;font-size:.9rem">${w.exercise}</span>
      <span style="color:var(--muted);font-size:.78rem;margin-left:8px">${w.day}</span>
      ${stats?`<div style="font-size:.8rem;color:var(--accent2);margin-top:2px">${stats}</div>`:""}
    </div>`;
  });
  dr.forEach(r=>{
    html+=`<div style="margin-bottom:8px"><span style="font-weight:700;font-size:.9rem">🏃 Run</span>
      ${r.distance?`<span style="color:var(--muted);font-size:.78rem;margin-left:8px">${r.distance}km</span>`:""}
      ${r.time?`<span style="color:var(--muted);font-size:.78rem;margin-left:4px">${r.time}</span>`:""}
    </div>`;
  });
  detail.innerHTML=html;
  detail.classList.remove("hidden");
}

/* ── PERSONAL RECORDS ── */
function bindRecords() { $("pr-search").addEventListener("input", renderRecords); }
function renderRecords() {
  const q=$("pr-search").value.toLowerCase();
  const prMap={};
  workouts.forEach(w=>{
    if(!w.exercise)return;
    if(!prMap[w.exercise]) prMap[w.exercise]={name:w.exercise,day:w.day,maxWeight:0,maxReps:0,lastWeight:0,lastReps:0,lastDate:""};
    const pr=prMap[w.exercise];
    const sets=w.sets_detail||(w.weight?[{weight:w.weight,reps:w.reps||0}]:[]);
    sets.forEach(s=>{
      if((s.weight||0)>pr.maxWeight){pr.maxWeight=s.weight;pr.maxReps=s.reps||0;}
      if((s.reps||0)>pr.maxReps&&(s.weight||0)>=pr.maxWeight) pr.maxReps=s.reps||0;
    });
    if(w.date>=pr.lastDate){
      pr.lastDate=w.date;
      const h=sets.reduce((a,b)=>(b.weight||0)>(a.weight||0)?b:a,sets[0]||{});
      pr.lastWeight=h.weight||0; pr.lastReps=h.reps||0;
    }
  });
  let items=Object.values(prMap).sort((a,b)=>a.name.localeCompare(b.name));
  if(q) items=items.filter(i=>i.name.toLowerCase().includes(q));
  const list=$("records-list");
  if(!items.length){
    list.innerHTML=`<div class="empty-state"><div class="empty-icon">🏆</div><p>${q?"No matching exercises.":"Log workouts to see your PRs here."}</p></div>`;
    return;
  }
  list.innerHTML=items.map(pr=>`
    <div class="record-card">
      <div><div class="record-name">${pr.name}</div><div class="record-day">${pr.day||""}</div></div>
      <div class="record-stats">
        <div>
          <div class="record-stat-label">Last session</div>
          <div class="record-stat-value">${pr.lastWeight?pr.lastWeight+"kg":"—"}</div>
          <div class="record-stat-sub">${pr.lastReps?pr.lastReps+" reps":""} ${pr.lastDate?"· "+formatDate(pr.lastDate):""}</div>
        </div>
        <div>
          <div class="record-stat-label">All-time PR</div>
          <div class="record-stat-value">${pr.maxWeight?pr.maxWeight+"kg":"—"}</div>
          <div class="record-stat-sub">${pr.maxReps?pr.maxReps+" reps max":""}</div>
        </div>
      </div>
    </div>`).join("");
}

/* ── SHOES ── */
function bindShoes() {
  $("add-shoe-btn").addEventListener("click", () => {
    editingShoeId = null;
    $("shoe-form-title").textContent = "Add shoe";
    $("shoe-brand").value = ""; $("shoe-model").value = "";
    $("shoe-start-km").value = ""; $("shoe-max-km").value = "800"; $("shoe-notes").value = "";
    $("shoe-form-wrap").classList.remove("hidden");
    $("shoe-brand").focus();
  });
  $("shoe-form-cancel").addEventListener("click", () => {
    $("shoe-form-wrap").classList.add("hidden"); editingShoeId = null;
  });
  $("shoe-form-save").addEventListener("click", saveShoe);
}

async function saveShoe() {
  const brand = $("shoe-brand").value.trim();
  const model = $("shoe-model").value.trim();
  if (!brand || !model) { showToast("Please enter brand and model"); return; }

  try {
    if (editingShoeId) {
      const fields = { brand, model, maxKm: parseFloat($("shoe-max-km").value)||null, notes: $("shoe-notes").value.trim() };
      await updateShoe(editingShoeId, fields);
      const shoe = shoes.find(s => s.id === editingShoeId);
      if (shoe) { shoe.brand=brand; shoe.model=model; shoe.max_km=fields.maxKm; shoe.notes=fields.notes; }
    } else {
      const newShoe = { id: Date.now(), brand, model, km: parseFloat($("shoe-start-km").value)||0, maxKm: parseFloat($("shoe-max-km").value)||null, notes: $("shoe-notes").value.trim() };
      await insertShoe(newShoe);
      shoes.push({ ...newShoe, max_km: newShoe.maxKm });
    }
    $("shoe-form-wrap").classList.add("hidden");
    editingShoeId = null;
    renderShoes();
    populateShoeDropdown();
    showToast(editingShoeId ? "Shoe updated 👟" : "Shoe added 👟");
  } catch(e) {
    console.error(e);
    showToast("Error saving shoe — check connection");
  }
}

function renderShoes() {
  const list = $("shoes-list");
  if (!shoes.length) {
    list.innerHTML = `<div class="empty-state"><div class="empty-icon">👟</div><p>No shoes yet. Add your first pair!</p></div>`;
    return;
  }
  list.innerHTML = shoes.map(shoe => {
    const km    = shoe.km || 0;
    const maxKm = shoe.max_km || shoe.maxKm || 800;
    const pct   = Math.min(100, Math.round((km / maxKm) * 100));
    const cls   = pct >= 90 ? "danger" : pct >= 70 ? "warning" : "ok";
    return `<div class="shoe-card">
      <div class="shoe-card-top">
        <div>
          <div class="shoe-card-name">${shoe.brand} ${shoe.model}</div>
          ${shoe.notes ? `<div class="shoe-card-notes">${shoe.notes}</div>` : ""}
        </div>
        <div style="display:flex;gap:6px;align-items:center">
          <button class="shoe-edit-btn" style="color:var(--muted);background:none;border:1px solid var(--border);border-radius:6px;padding:4px 10px;font-size:0.78rem;cursor:pointer"
            data-id="${shoe.id}">Edit</button>
          <button class="shoe-del-btn shoe-card-del" data-id="${shoe.id}">Delete</button>
        </div>
      </div>
      <div class="shoe-km-bar-wrap">
        <div class="shoe-km-labels">
          <span>Mileage</span>
          <span><span class="shoe-km-value">${km.toFixed(1)} km</span> / ${maxKm} km</span>
        </div>
        <div class="shoe-km-bar-bg">
          <div class="shoe-km-bar-fill ${cls}" style="width:${pct}%"></div>
        </div>
        <div style="font-size:0.72rem;color:var(--muted);text-align:right">${pct}% used${pct>=90?" · Consider replacing":pct>=70?" · Getting worn":""}</div>
      </div>
    </div>`;
  }).join("");

  list.querySelectorAll(".shoe-del-btn").forEach(btn => {
    btn.addEventListener("click", async () => {
      if (!confirm("Delete this shoe?")) return;
      try {
        await deleteShoe(btn.dataset.id);
        shoes = shoes.filter(s => s.id != btn.dataset.id);
        renderShoes();
        populateShoeDropdown();
      } catch(e) { showToast("Error deleting shoe"); }
    });
  });

  list.querySelectorAll(".shoe-edit-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const shoe = shoes.find(s => s.id == btn.dataset.id);
      if (!shoe) return;
      editingShoeId = shoe.id;
      $("shoe-form-title").textContent = "Edit shoe";
      $("shoe-brand").value   = shoe.brand;
      $("shoe-model").value   = shoe.model;
      $("shoe-start-km").value = shoe.km || 0;
      $("shoe-max-km").value  = shoe.max_km || shoe.maxKm || 800;
      $("shoe-notes").value   = shoe.notes || "";
      $("shoe-form-wrap").classList.remove("hidden");
      $("shoe-brand").focus();
    });
  });
}

/* ── UTILS ── */
function formatDate(ds) {
  if(!ds)return"";
  return new Date(ds+"T00:00:00").toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"});
}
function fmtDuration(sec) {
  const h=Math.floor(sec/3600),m=Math.floor((sec%3600)/60),s=sec%60;
  return h>0?`${h}h ${m}m`:`${m}m ${s}s`;
}
function calcPace(timeStr,km) {
  const p=timeStr.split(":").map(Number);
  if(p.length<2||!km)return"";
  const t=(p[0]||0)*3600+(p[1]||0)*60+(p[2]||0);
  const spk=t/km;
  return `${Math.floor(spk/60)}:${String(Math.round(spk%60)).padStart(2,"0")}`;
}
function showToast(msg) {
  const t=$("toast");
  t.textContent=msg;
  t.classList.remove("hidden");
  setTimeout(()=>t.classList.add("hidden"),2800);
}
