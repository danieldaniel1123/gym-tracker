/* ══════════════════════════════════════════
   SUPABASE
   ══════════════════════════════════════════ */
const SUPABASE_URL = "https://nqsfgbbabvgebulgqjrb.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5xc2ZnYmJhYnZnZWJ1bGdxanJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE3ODU1NjIsImV4cCI6MjA5NzM2MTU2Mn0.ga9LykWsCsyzIpOsiAiIk4bkS7EeEvCEFwuHkp7At1U";
const db = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

/* ══════════════════════════════════════════
   MUSCLE COLORS & REGIONS
   ══════════════════════════════════════════ */
const MUSCLE_COLORS = {
  "Chest":{ fill:"#7F77DD",stroke:"#534AB7" },"Chest (upper)":{ fill:"#7F77DD",stroke:"#534AB7" },"Chest (lower)":{ fill:"#7F77DD",stroke:"#534AB7" },
  "Front delts":{ fill:"#378ADD",stroke:"#185FA5" },"Side delts":{ fill:"#378ADD",stroke:"#185FA5" },"Rear delts":{ fill:"#378ADD",stroke:"#185FA5" },
  "Triceps":{ fill:"#D4537E",stroke:"#993556" },"Triceps (long head)":{ fill:"#D4537E",stroke:"#993556" },
  "Biceps":{ fill:"#5DCAA5",stroke:"#1D9E75" },"Brachialis":{ fill:"#5DCAA5",stroke:"#1D9E75" },"Forearms":{ fill:"#9FE1CB",stroke:"#5DCAA5" },
  "Back (lats)":{ fill:"#EF9F27",stroke:"#BA7517" },"Back (mid)":{ fill:"#EF9F27",stroke:"#BA7517" },"Back (traps)":{ fill:"#FAC775",stroke:"#EF9F27" },
  "Back (rhomboids)":{ fill:"#EF9F27",stroke:"#BA7517" },"Traps":{ fill:"#FAC775",stroke:"#EF9F27" },"Lower back":{ fill:"#F0997B",stroke:"#D85A30" },
  "Rotator cuff":{ fill:"#B5D4F4",stroke:"#378ADD" },"Quads":{ fill:"#EF9F27",stroke:"#BA7517" },"Hamstrings":{ fill:"#1D9E75",stroke:"#0F6E56" },
  "Glutes":{ fill:"#D85A30",stroke:"#993C1D" },"Glutes (medius)":{ fill:"#D85A30",stroke:"#993C1D" },"Adductors":{ fill:"#97C459",stroke:"#639922" },
  "Abductors":{ fill:"#97C459",stroke:"#639922" },"Calves":{ fill:"#534AB7",stroke:"#3C3489" },"Calves (soleus)":{ fill:"#534AB7",stroke:"#3C3489" },
  "Core":{ fill:"#E24B4A",stroke:"#A32D2D" },"Core (abs)":{ fill:"#E24B4A",stroke:"#A32D2D" },"Hip flexors":{ fill:"#F09595",stroke:"#E24B4A" },
  "Lats":{ fill:"#EF9F27",stroke:"#BA7517" },
};
const MUSCLE_REGION_MAP = {
  "Chest":{ front:["chest"],back:[] },"Chest (upper)":{ front:["chest"],back:[] },"Chest (lower)":{ front:["chest"],back:[] },
  "Front delts":{ front:["front-delts"],back:[] },"Side delts":{ front:["front-delts"],back:["rear-delts"] },"Rear delts":{ front:[],back:["rear-delts"] },
  "Triceps":{ front:[],back:["triceps"] },"Triceps (long head)":{ front:[],back:["triceps"] },
  "Biceps":{ front:["biceps"],back:[] },"Brachialis":{ front:["biceps"],back:[] },"Forearms":{ front:["forearms-f"],back:["forearms-b"] },
  "Back (lats)":{ front:[],back:["lats"] },"Back (mid)":{ front:[],back:["lats"] },"Back (traps)":{ front:[],back:["traps"] },
  "Back (rhomboids)":{ front:[],back:["lats"] },"Traps":{ front:[],back:["traps"] },"Lower back":{ front:[],back:["lower-back"] },
  "Rotator cuff":{ front:[],back:["rear-delts"] },"Quads":{ front:["quads"],back:[] },"Hamstrings":{ front:[],back:["hamstrings"] },
  "Glutes":{ front:[],back:["glutes"] },"Glutes (medius)":{ front:[],back:["glutes"] },"Adductors":{ front:["adductors"],back:[] },
  "Abductors":{ front:[],back:["glutes"] },"Calves":{ front:[],back:["calves"] },"Calves (soleus)":{ front:[],back:["calves"] },
  "Core":{ front:["abs"],back:["lower-back"] },"Core (abs)":{ front:["abs"],back:[] },"Hip flexors":{ front:["hip-flexors"],back:[] },"Lats":{ front:[],back:["lats"] },
};
const ALL_MUSCLES = ["Chest","Chest (upper)","Chest (lower)","Front delts","Side delts","Rear delts","Triceps","Triceps (long head)","Biceps","Brachialis","Forearms","Back (lats)","Back (mid)","Back (traps)","Back (rhomboids)","Traps","Lower back","Rotator cuff","Quads","Hamstrings","Glutes","Glutes (medius)","Adductors","Abductors","Calves","Calves (soleus)","Core","Core (abs)","Hip flexors","Lats"];
const DAY_OPTIONS = ["Push","Pull","Legs","Back & Biceps","Back & Triceps","Chest & Biceps","Arms","Shoulder","Full body","Upper body","Lower body"];
const RUN_DISTANCES = [{label:"5k",km:5},{label:"10k",km:10},{label:"16k",km:16},{label:"21k",km:21.1},{label:"42k",km:42.2},{label:"50k",km:50}];

/* ── SVG BUILDER ── */
function getThemeColors() {
  const theme = document.documentElement.getAttribute("data-theme")||"dark";
  return theme==="dark" ? { base:"#3a3a3a",stroke:"#4a4a4a" } : { base:"#d1d5db",stroke:"#9ca3af" };
}
function buildBodySVG(view,rcMap,small=false) {
  const {base:B,stroke:BS}=getThemeColors();
  const rc=r=>rcMap[r]?`fill="${rcMap[r].fill}" fill-opacity="0.9" stroke="${rcMap[r].stroke}"` :`fill="${B}" stroke="${BS}"`;
  const w=small?28:52, h=small?56:100;
  if(view==="front") return `<svg width="${w}" height="${h}" viewBox="0 0 52 100" fill="none">
    <ellipse cx="26" cy="9" rx="8" ry="8.5" fill="${B}" stroke="${BS}" stroke-width="0.8"/>
    <rect x="20" y="18" width="12" height="5" rx="2" fill="${B}" stroke="${BS}" stroke-width="0.8"/>
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
    <rect x="15" y="84" width="10" height="14" rx="3" fill="${B}" stroke="${BS}" stroke-width="0.8"/>
    <rect x="27" y="84" width="10" height="14" rx="3" fill="${B}" stroke="${BS}" stroke-width="0.8"/>
  </svg>`;
  return `<svg width="${w}" height="${h}" viewBox="0 0 52 100" fill="none">
    <ellipse cx="26" cy="9" rx="8" ry="8.5" fill="${B}" stroke="${BS}" stroke-width="0.8"/>
    <rect x="20" y="18" width="12" height="5" rx="2" fill="${B}" stroke="${BS}" stroke-width="0.8"/>
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
function getMuscleColorMaps(muscles) {
  const fm={},bm={};
  (muscles||[]).forEach(m=>{ const c=MUSCLE_COLORS[m],r=MUSCLE_REGION_MAP[m]; if(!c||!r)return; r.front.forEach(x=>{fm[x]=c;}); r.back.forEach(x=>{bm[x]=c;}); });
  return {fm,bm};
}
function buildMuscleDiagram(muscles,small=false) {
  const {fm,bm}=getMuscleColorMaps(muscles);
  return `<div class="${small?"":"diagram-col"}" style="opacity:${Object.keys(fm).length?1:0.2};display:flex;flex-direction:column;align-items:center;gap:4px">${buildBodySVG("front",fm,small)}<span class="${small?"collapsed-view-label":"view-label"}">Front</span></div>
          <div class="${small?"":"diagram-col"}" style="opacity:${Object.keys(bm).length?1:0.2};display:flex;flex-direction:column;align-items:center;gap:4px">${buildBodySVG("back",bm,small)}<span class="${small?"collapsed-view-label":"view-label"}">Back</span></div>`;
}

/* ══════════════════════════════════════════
   EXERCISE DATABASE
   ══════════════════════════════════════════ */
const BUILTIN_EXERCISES = [
  {name:"Bench Press (Flat)",days:["Push","Chest & Biceps","Upper body","Full body"],muscles:["Chest","Front delts","Triceps"],equipment:["Barbell","Smith machine"]},
  {name:"Bench Press (Incline)",days:["Push","Chest & Biceps","Upper body","Full body"],muscles:["Chest (upper)","Front delts","Triceps"],equipment:["Barbell","Smith machine"]},
  {name:"Chest Press (Flat)",days:["Push","Chest & Biceps","Upper body","Full body"],muscles:["Chest","Front delts","Triceps"],equipment:["Cable machine","Pec deck machine"]},
  {name:"Chest Press (Incline)",days:["Push","Chest & Biceps","Upper body","Full body"],muscles:["Chest (upper)","Front delts","Triceps"],equipment:["Cable machine"]},
  {name:"Chest Press (Decline)",days:["Push","Chest & Biceps","Upper body","Full body"],muscles:["Chest (lower)","Triceps"],equipment:["Cable machine","Smith machine"]},
  {name:"Incline Dumbbell Press",days:["Push","Chest & Biceps","Upper body","Full body"],muscles:["Chest (upper)","Front delts","Triceps"],equipment:["Dumbbell"]},
  {name:"Flat Dumbbell Chest Press",days:["Push","Chest & Biceps","Upper body","Full body"],muscles:["Chest","Front delts","Triceps"],equipment:["Dumbbell"]},
  {name:"Flat Barbell Bench Press",days:["Push","Chest & Biceps","Upper body","Full body"],muscles:["Chest","Front delts","Triceps"],equipment:["Barbell"]},
  {name:"Pectoral Fly",days:["Push","Chest & Biceps","Upper body","Full body"],muscles:["Chest"],equipment:["Pec deck machine"]},
  {name:"Dumbbell Fly (Incline)",days:["Push","Chest & Biceps","Upper body","Full body"],muscles:["Chest (upper)","Front delts"],equipment:["Dumbbell"]},
  {name:"Decline Pectoral Fly",days:["Push","Chest & Biceps","Upper body","Full body"],muscles:["Chest (lower)"],equipment:["Pec deck machine","Cable machine"]},
  {name:"Cable Chest Fly",days:["Push","Chest & Biceps","Upper body","Full body"],muscles:["Chest","Front delts"],equipment:["Cable machine"]},
  {name:"Push-up",days:["Push","Chest & Biceps","Upper body","Full body"],muscles:["Chest","Front delts","Triceps"],equipment:["Bodyweight"]},
  {name:"Deadlift",days:["Pull","Back & Biceps","Legs","Lower body","Full body"],muscles:["Hamstrings","Glutes","Lower back","Traps"],equipment:["Barbell"]},
  {name:"Romanian Deadlift (RDL)",days:["Legs","Back & Biceps","Lower body","Full body"],muscles:["Hamstrings","Glutes","Lower back"],equipment:["Barbell","Dumbbell"]},
  {name:"Stiff-Leg Deadlift",days:["Legs","Back & Biceps","Lower body","Full body"],muscles:["Hamstrings","Glutes","Lower back"],equipment:["Barbell","Dumbbell"]},
  {name:"Sumo Deadlift",days:["Legs","Lower body","Full body"],muscles:["Glutes","Hamstrings","Adductors"],equipment:["Barbell"]},
  {name:"Bent-Over Barbell Row (Pronated)",days:["Pull","Back & Biceps","Upper body","Full body"],muscles:["Back (lats)","Back (mid)","Biceps"],equipment:["Barbell"]},
  {name:"Bent-Over Barbell Row (Supinated)",days:["Pull","Back & Biceps","Upper body","Full body"],muscles:["Back (lats)","Back (mid)","Biceps"],equipment:["Barbell"]},
  {name:"Bent-Over Cable Row",days:["Pull","Back & Biceps","Upper body","Full body"],muscles:["Back (lats)","Back (mid)","Biceps"],equipment:["Cable machine"]},
  {name:"One-Arm Dumbbell Row",days:["Pull","Back & Biceps","Upper body","Full body"],muscles:["Back (lats)","Back (mid)","Biceps"],equipment:["Dumbbell"]},
  {name:"Single-Arm Row (Underhand)",days:["Pull","Back & Biceps","Upper body","Full body"],muscles:["Back (lats)","Back (mid)","Biceps"],equipment:["Dumbbell","Cable machine"]},
  {name:"Seated Cable Row",days:["Pull","Back & Biceps","Upper body","Full body"],muscles:["Back (mid)","Back (rhomboids)","Biceps"],equipment:["Seated row machine","Cable machine"]},
  {name:"Seated Cable Row (Close Grip)",days:["Pull","Back & Biceps","Upper body","Full body"],muscles:["Back (mid)","Back (rhomboids)","Biceps"],equipment:["Seated row machine","Cable machine"]},
  {name:"Close-Grip Row",days:["Pull","Back & Biceps","Upper body","Full body"],muscles:["Back (mid)","Back (rhomboids)","Biceps"],equipment:["Cable machine","Seated row machine"]},
  {name:"Assisted Row",days:["Pull","Back & Biceps","Upper body","Full body"],muscles:["Back (lats)","Back (mid)","Biceps"],equipment:["Assisted row machine"]},
  {name:"Incline Row",days:["Pull","Back & Biceps","Upper body","Full body"],muscles:["Back (lats)","Back (mid)","Rear delts"],equipment:["Dumbbell","Cable machine"]},
  {name:"Low Row",days:["Pull","Back & Biceps","Upper body","Full body"],muscles:["Back (lats)","Back (mid)","Biceps"],equipment:["Cable machine","Seated row machine"]},
  {name:"Row Machine",days:["Pull","Back & Biceps","Upper body","Full body"],muscles:["Back (lats)","Back (mid)","Biceps"],equipment:["Row machine"]},
  {name:"Lat Pulldown",days:["Pull","Back & Biceps","Upper body","Full body"],muscles:["Back (lats)","Biceps"],equipment:["Lat pulldown machine","Cable machine"]},
  {name:"Close-Grip Lat Pulldown",days:["Pull","Back & Biceps","Upper body","Full body"],muscles:["Back (lats)","Biceps"],equipment:["Lat pulldown machine","Cable machine"]},
  {name:"One-Arm Lat Pulldown",days:["Pull","Back & Biceps","Upper body","Full body"],muscles:["Back (lats)","Biceps"],equipment:["Cable machine"]},
  {name:"Pull-Ups",days:["Pull","Back & Biceps","Upper body","Full body"],muscles:["Back (lats)","Biceps","Rear delts"],equipment:["Bodyweight","Pull-up bar"]},
  {name:"Face Pull",days:["Pull","Back & Biceps","Shoulder","Upper body"],muscles:["Rear delts","Back (traps)","Rotator cuff"],equipment:["Cable machine"]},
  {name:"Barbell Shrugs",days:["Pull","Back & Biceps","Upper body"],muscles:["Back (traps)"],equipment:["Barbell","Dumbbell"]},
  {name:"Shoulder Press",days:["Push","Shoulder","Upper body","Full body"],muscles:["Front delts","Side delts","Triceps"],equipment:["Barbell","Dumbbell","Smith machine"]},
  {name:"Seated Shoulder Press",days:["Push","Shoulder","Upper body","Full body"],muscles:["Front delts","Side delts","Triceps"],equipment:["Barbell","Dumbbell","Smith machine"]},
  {name:"Dumbbell Shoulder Press",days:["Push","Shoulder","Upper body","Full body"],muscles:["Front delts","Side delts","Triceps"],equipment:["Dumbbell"]},
  {name:"Overhead Shoulder Press",days:["Push","Shoulder","Upper body","Full body"],muscles:["Front delts","Side delts","Triceps"],equipment:["Barbell","Dumbbell","Smith machine"]},
  {name:"Side Lateral Raise",days:["Push","Shoulder","Upper body","Full body"],muscles:["Side delts"],equipment:["Dumbbell","Cable machine"]},
  {name:"Front Raise",days:["Push","Shoulder","Upper body","Full body"],muscles:["Front delts","Side delts"],equipment:["Dumbbell","Barbell","Cable machine"]},
  {name:"Assisted Front Raise",days:["Push","Shoulder","Upper body"],muscles:["Front delts"],equipment:["Cable machine"]},
  {name:"Single-Arm Lateral Raise",days:["Push","Shoulder","Upper body"],muscles:["Side delts"],equipment:["Dumbbell","Cable machine"]},
  {name:"Rear Delt Fly",days:["Shoulder","Back & Biceps","Upper body"],muscles:["Rear delts","Back (rhomboids)"],equipment:["Dumbbell","Cable machine"]},
  {name:"Reverse Rear Delt Fly",days:["Shoulder","Back & Biceps","Upper body"],muscles:["Rear delts","Back (rhomboids)"],equipment:["Pec deck machine","Cable machine"]},
  {name:"Supported Rear Delt Fly",days:["Shoulder","Back & Biceps","Upper body"],muscles:["Rear delts","Back (rhomboids)"],equipment:["Dumbbell"]},
  {name:"Upright Row",days:["Shoulder","Upper body"],muscles:["Side delts","Back (traps)","Biceps"],equipment:["Barbell","EZ bar","Cable machine"]},
  {name:"Barbell Curl",days:["Pull","Arms","Back & Biceps","Chest & Biceps"],muscles:["Biceps"],equipment:["Barbell","EZ bar"]},
  {name:"Biceps Curl",days:["Pull","Arms","Back & Biceps","Chest & Biceps"],muscles:["Biceps"],equipment:["Dumbbell","Cable machine"]},
  {name:"Preacher Curl",days:["Pull","Arms","Back & Biceps","Chest & Biceps"],muscles:["Biceps"],equipment:["EZ bar","Barbell","Dumbbell"]},
  {name:"Spider Curl",days:["Pull","Arms","Back & Biceps","Chest & Biceps"],muscles:["Biceps"],equipment:["Barbell","Dumbbell","EZ bar"]},
  {name:"Hammer Curl",days:["Pull","Arms","Back & Biceps","Chest & Biceps"],muscles:["Biceps","Brachialis","Forearms"],equipment:["Dumbbell"]},
  {name:"Cross-Body Hammer Curl",days:["Pull","Arms","Back & Biceps","Chest & Biceps"],muscles:["Biceps","Brachialis"],equipment:["Dumbbell"]},
  {name:"Cross-Body Biceps Curl",days:["Pull","Arms","Back & Biceps","Chest & Biceps"],muscles:["Biceps"],equipment:["Dumbbell","Cable machine"]},
  {name:"Biceps Curl Isolation",days:["Pull","Arms","Back & Biceps","Chest & Biceps"],muscles:["Biceps"],equipment:["Dumbbell","Cable machine"]},
  {name:"Skull Crusher",days:["Push","Arms","Back & Triceps","Upper body"],muscles:["Triceps"],equipment:["EZ bar","Barbell","Dumbbell"]},
  {name:"Incline Skull Crusher",days:["Push","Arms","Back & Triceps","Upper body"],muscles:["Triceps (long head)"],equipment:["EZ bar","Barbell","Dumbbell"]},
  {name:"Dumbbell Skull Crusher",days:["Push","Arms","Back & Triceps","Upper body"],muscles:["Triceps"],equipment:["Dumbbell"]},
  {name:"Overhead Triceps Extension",days:["Push","Arms","Back & Triceps","Upper body"],muscles:["Triceps (long head)"],equipment:["Dumbbell","Cable machine","EZ bar"]},
  {name:"Triceps Pushdown",days:["Push","Arms","Back & Triceps","Upper body"],muscles:["Triceps"],equipment:["Cable machine"]},
  {name:"Rope Triceps Pushdown",days:["Push","Arms","Back & Triceps","Upper body"],muscles:["Triceps"],equipment:["Cable machine"]},
  {name:"Straight-Bar Triceps Pushdown",days:["Push","Arms","Back & Triceps","Upper body"],muscles:["Triceps"],equipment:["Cable machine"]},
  {name:"Cable Triceps Pushdown",days:["Push","Arms","Back & Triceps","Upper body"],muscles:["Triceps"],equipment:["Cable machine"]},
  {name:"Close-Grip Bench Press",days:["Push","Arms","Back & Triceps","Upper body"],muscles:["Triceps","Chest"],equipment:["Barbell","Smith machine"]},
  {name:"Triceps Dips",days:["Push","Arms","Back & Triceps","Upper body"],muscles:["Triceps","Chest","Front delts"],equipment:["Bodyweight","Dip machine"]},
  {name:"Flat Triceps Extension",days:["Push","Arms","Back & Triceps","Upper body"],muscles:["Triceps"],equipment:["Barbell","Dumbbell","EZ bar"]},
  {name:"Bent-Over Triceps Extension",days:["Push","Arms","Back & Triceps","Upper body"],muscles:["Triceps"],equipment:["Dumbbell","Cable machine"]},
  {name:"Reverse Triceps Extension",days:["Push","Arms","Back & Triceps","Upper body"],muscles:["Triceps"],equipment:["Cable machine"]},
  {name:"Triceps Extension",days:["Push","Arms","Back & Triceps","Upper body"],muscles:["Triceps"],equipment:["Dumbbell","Cable machine","EZ bar"]},
  {name:"Barbell Squat",days:["Legs","Lower body","Full body"],muscles:["Quads","Glutes","Hamstrings"],equipment:["Barbell","Smith machine"]},
  {name:"Weighted Squat",days:["Legs","Lower body","Full body"],muscles:["Quads","Glutes","Hamstrings"],equipment:["Barbell","Dumbbell","Smith machine"]},
  {name:"Goblet Squat",days:["Legs","Lower body","Full body"],muscles:["Quads","Glutes"],equipment:["Dumbbell","Kettlebell"]},
  {name:"Sumo Squat",days:["Legs","Lower body","Full body"],muscles:["Glutes","Quads","Adductors"],equipment:["Barbell","Dumbbell","Kettlebell"]},
  {name:"Bulgarian Split Squat",days:["Legs","Lower body","Full body"],muscles:["Quads","Glutes"],equipment:["Bodyweight","Dumbbell","Barbell"]},
  {name:"Walking Lunges",days:["Legs","Lower body","Full body"],muscles:["Quads","Glutes","Hamstrings"],equipment:["Bodyweight","Dumbbell","Barbell"]},
  {name:"Static Lunges",days:["Legs","Lower body","Full body"],muscles:["Quads","Glutes","Hamstrings"],equipment:["Bodyweight","Dumbbell","Barbell"]},
  {name:"Single-Leg Lunges",days:["Legs","Lower body","Full body"],muscles:["Quads","Glutes","Hamstrings"],equipment:["Bodyweight","Dumbbell"]},
  {name:"Leg Press",days:["Legs","Lower body","Full body"],muscles:["Quads","Glutes","Hamstrings"],equipment:["Leg press machine"]},
  {name:"Leg Extension",days:["Legs","Lower body","Full body"],muscles:["Quads"],equipment:["Leg extension machine"]},
  {name:"Leg Curl",days:["Legs","Lower body","Full body"],muscles:["Hamstrings"],equipment:["Leg curl machine"]},
  {name:"Calf Raises",days:["Legs","Lower body","Full body"],muscles:["Calves"],equipment:["Calf raise machine","Bodyweight","Barbell"]},
  {name:"Seated Calf Raises",days:["Legs","Lower body","Full body"],muscles:["Calves (soleus)"],equipment:["Seated calf raise machine"]},
  {name:"Weighted Calf Raises",days:["Legs","Lower body","Full body"],muscles:["Calves"],equipment:["Barbell","Dumbbell","Calf raise machine"]},
  {name:"Hip Thrust",days:["Legs","Lower body","Full body"],muscles:["Glutes","Hamstrings"],equipment:["Barbell","Hip thrust machine"]},
  {name:"Hanging Leg Raises",days:["Full body","Upper body"],muscles:["Core (abs)","Hip flexors"],equipment:["Pull-up bar"]},
  {name:"Leg Raises",days:["Full body","Upper body"],muscles:["Core (abs)","Hip flexors"],equipment:["Bodyweight","Bench"]},
  {name:"Knee Raises",days:["Full body","Upper body"],muscles:["Core (abs)","Hip flexors"],equipment:["Pull-up bar","Bodyweight"]},
  {name:"Crunches",days:["Full body","Upper body"],muscles:["Core (abs)"],equipment:["Bodyweight"]},
  {name:"Plank",days:["Full body","Upper body"],muscles:["Core"],equipment:["Bodyweight"]},
  {name:"Cable Crunch",days:["Full body","Upper body"],muscles:["Core (abs)"],equipment:["Cable machine"]},
  {name:"Ab Wheel Rollout",days:["Full body","Upper body"],muscles:["Core (abs)","Lats"],equipment:["Ab wheel"]},
];

/* ══════════════════════════════════════════
   STATE
   ══════════════════════════════════════════ */
