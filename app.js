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
let workouts=[],runs=[],shoes=[],customExercises=[],allExercises=[];
let session={active:false,day:"",date:"",startTime:null,timerInterval:null,exercises:[]};
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
  session.exercises.push({exData,sets,machineUsed:(exData.equipment||[])[0]||null,collapsed:false});
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
function renderExerciseList(){
  const list=$("exercise-list");
  if(!session.exercises.length){ list.innerHTML=""; return; }
  list.innerHTML=session.exercises.map((item,idx)=>item.collapsed?buildCollapsedCard(item,idx):buildExerciseCard(item,idx)).join("");
  bindExerciseCardEvents();
}

function bindExerciseCardEvents(){
  const list=$("exercise-list");
  list.querySelectorAll(".set-input").forEach(inp=>{ inp.addEventListener("change",e=>{ const {exIdx,setIdx,field}=e.target.dataset; session.exercises[exIdx].sets[setIdx][field]=e.target.value?parseFloat(e.target.value):""; saveSessionToLocal(); }); });
  list.querySelectorAll(".set-check").forEach(btn=>{ btn.addEventListener("click",e=>{ const {exIdx,setIdx}=e.target.dataset; session.exercises[exIdx].sets[setIdx].done=!session.exercises[exIdx].sets[setIdx].done; saveSessionToLocal(); renderExerciseList(); }); });
  list.querySelectorAll(".add-set-btn").forEach(btn=>{ btn.addEventListener("click",e=>{ const idx=parseInt(e.target.dataset.exIdx); const last=session.exercises[idx].sets.slice(-1)[0]; session.exercises[idx].sets.push({reps:last?.reps||"",weight:last?.weight||"",done:false}); saveSessionToLocal(); renderExerciseList(); }); });
  list.querySelectorAll(".set-del-btn").forEach(btn=>{ btn.addEventListener("click",e=>{ const {exIdx,setIdx}=e.target.dataset; session.exercises[exIdx].sets.splice(parseInt(setIdx),1); saveSessionToLocal(); renderExerciseList(); }); });
  list.querySelectorAll(".exercise-card-del,.collapsed-del-btn").forEach(btn=>{ btn.addEventListener("click",e=>{ session.exercises.splice(parseInt(e.target.dataset.exIdx),1); saveSessionToLocal(); renderExerciseList(); }); });
  list.querySelectorAll(".exercise-save-btn").forEach(btn=>{ btn.addEventListener("click",e=>{ const idx=parseInt(e.target.dataset.exIdx); session.exercises[idx].collapsed=true; saveSessionToLocal(); renderExerciseList(); }); });

  list.querySelectorAll(".collapsed-expand-btn").forEach(btn=>{ btn.addEventListener("click",e=>{ const idx=parseInt(e.target.dataset.exIdx); session.exercises[idx].collapsed=false; saveSessionToLocal(); renderExerciseList(); }); });
  list.querySelectorAll(".machine-radio").forEach(radio=>{ radio.addEventListener("change",e=>{ const {exIdx}=e.target.dataset; session.exercises[exIdx].machineUsed=e.target.value; saveSessionToLocal(); }); });
}

function buildExerciseCard(item,idx){
  const {exData,sets,machineUsed}=item;
  const pr=getPRInfo(exData.name);
  const diagramHTML=buildMuscleDiagram(exData.muscles||[]);
  const legendHTML=(exData.muscles||[]).map(m=>{ const c=MUSCLE_COLORS[m]||{fill:"#888"}; return `<div class="muscle-legend-row"><span class="muscle-dot" style="background:${c.fill}"></span>${m}</div>`; }).join("");
  const equipList=exData.equipment||[];
  let machineHTML="";
  if(equipList.length===1) machineHTML=`<div class="machine-section"><div class="machine-label">Equipment</div><div class="machine-single">${equipList[0]}</div></div>`;
  else if(equipList.length>1) machineHTML=`<div class="machine-section"><div class="machine-label">Equipment used</div><div class="machine-radios">${equipList.map(eq=>`<label class="machine-radio-item"><input type="radio" class="machine-radio" name="machine_${idx}" value="${eq}" data-ex-idx="${idx}" ${(machineUsed||equipList[0])===eq?"checked":""}>${eq}</label>`).join("")}</div></div>`;
  const prHTML=pr?`<div class="pr-strip"><div class="pr-item"><span class="pr-label">Last session</span><span class="pr-value">${pr.lastWeight?pr.lastWeight+"kg × "+pr.lastReps:"—"}</span></div><div class="pr-divider"></div><div class="pr-item"><span class="pr-label">All-time PR</span><span class="pr-value">${pr.prWeight?pr.prWeight+"kg × "+pr.prReps:"—"}</span></div></div>`:"";
  const setsHTML=sets.map((set,sIdx)=>`<div class="set-row ${set.done?"completed":""}"><span class="set-num">${sIdx+1}</span><input class="set-input" type="number" min="0" max="999" step="1" value="${set.reps||""}" placeholder="—" data-ex-idx="${idx}" data-set-idx="${sIdx}" data-field="reps"/><input class="set-input" type="number" min="0" max="9999" step="0.5" value="${set.weight||""}" placeholder="—" data-ex-idx="${idx}" data-set-idx="${sIdx}" data-field="weight"/><button class="set-check ${set.done?"done":""}" data-ex-idx="${idx}" data-set-idx="${sIdx}">✓</button><button class="set-del-btn" data-ex-idx="${idx}" data-set-idx="${sIdx}" title="Remove set">✕</button></div>`).join("");
  return `<div class="exercise-card"><div class="exercise-card-header"><span class="exercise-card-name">${exData.name}</span><div class="exercise-card-actions"><button class="exercise-card-del" data-ex-idx="${idx}">✕</button></div></div><div class="muscle-section"><div class="muscle-diagrams">${diagramHTML}</div><div class="muscle-legend"><div class="muscle-legend-title">Muscles</div>${legendHTML}<div class="equip-section">${(exData.equipment||[]).map(e=>`<div class="equip-row"><span class="equip-dot"></span>${e}</div>`).join("")}</div></div></div>${machineHTML}${prHTML}<div class="sets-header"><span>Set</span><span>Reps</span><span>kg</span><span></span><span></span></div>${setsHTML}<div class="add-set-row"><button class="add-set-btn" data-ex-idx="${idx}">+ Add set</button></div><div class="save-ex-row"><button class="exercise-save-btn" data-ex-idx="${idx}">✓ Save exercise</button></div></div>`;
}

function buildCollapsedCard(item,idx){
  const {exData,sets}=item;
  const pr=getPRInfo(exData.name);
  const completedSets=sets.filter(s=>s.done||s.reps||s.weight);
  const doneSets=sets.filter(s=>s.done).length;
  const sessionMaxW=completedSets.length?Math.max(...completedSets.map(s=>s.weight||0)):0;
  const sessionMaxR=sessionMaxW?completedSets.find(s=>(s.weight||0)===sessionMaxW)?.reps||0:0;
  const isNewPR=pr&&sessionMaxW>pr.prWeight;
  const {fm,bm}=getMuscleColorMaps(exData.muscles||[]);
  const miniSVGs=`<div style="opacity:${Object.keys(fm).length?1:0.2}">${buildBodySVG("front",fm,true)}<div class="collapsed-view-label">Front</div></div><div style="opacity:${Object.keys(bm).length?1:0.2}">${buildBodySVG("back",bm,true)}<div class="collapsed-view-label">Back</div></div>`;
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
      <div class="collapsed-svg-col"><div class="collapsed-svgs">${miniSVGs}</div></div>
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
  const entry={id:Date.now(),type:"run",date:$("r-date").value,distance:dist||null,time:$("r-time").value.trim(),location:$("r-location").value.trim(),shoeId:shoeId||null,shoeName:shoe?`${shoe.brand} ${shoe.model}`:null,notes:$("r-notes").value.trim(),kmSplits:kmRows.length>0?kmRows.map(r=>({km:r.km,pace:r.pace,hr:r.hr?parseInt(r.hr):null})):null};
  try{
    await insertRun(entry); runs.unshift(entry);
    if(shoe&&dist){ const newKm=(shoe.km||0)+dist; await updateShoe(shoe.id,{km:newKm}); shoe.km=newKm; renderShoes(); }
    showToast("Run saved! 🏃"); $("run-form").reset(); kmRows=[]; $("km-tbody").innerHTML=""; setDefaultDates(); updateKmBtnState(); renderCalendar(); renderHistory(); renderRunPRs();
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

/* HISTORY — date grouped */
function bindHistory(){ $("filter-type").addEventListener("change",renderHistory); $("filter-day").addEventListener("change",renderHistory); }

function renderHistory(){
  const tf=$("filter-type").value, df=$("filter-day").value;
  // Group workouts by sessionId
  const sessionMap={};
  workouts.forEach(w=>{
    if(tf==="run") return;
    if(df!=="all"&&w.day!==df) return;
    const key=w.sessionId?String(w.sessionId):`${w.date}_${w.day}`;
    if(!sessionMap[key]) sessionMap[key]={key,type:"workout",date:w.date,day:w.day,duration:w.duration||null,exercises:[]};
    sessionMap[key].exercises.push(w);
  });

  // Build flat list with date
  let items=Object.values(sessionMap).map(s=>({...s,_sort:s.date}));
  if(tf!=="workout") runs.forEach(r=>{ const rn={...r,shoeId:r.shoe_id||r.shoeId,shoeName:r.shoe_name||r.shoeName}; items.push({...rn,_sort:r.date,type:"run"}); });
  items.sort((a,b)=>b._sort.localeCompare(a._sort));

  // Group by date
  const byDate={};
  items.forEach(item=>{ if(!byDate[item._sort]) byDate[item._sort]=[]; byDate[item._sort].push(item); });

  const list=$("history-list");
  if(!items.length){ list.innerHTML=`<div class="empty-state"><div class="empty-icon">📭</div><p>No entries yet. Start logging!</p></div>`; return; }

  // Count sessions per date+day to handle Session 1, Session 2
  list.innerHTML=Object.entries(byDate).sort((a,b)=>b[0].localeCompare(a[0])).map(([date,dateItems])=>{
    // Track workout day counts for same-day numbering
    const dayCounts={};
    const cardHTML=dateItems.map(item=>{
      if(item.type==="run") return renderRunSessionCard(item);
      const dayKey=`${item.date}_${item.day}`;
      dayCounts[dayKey]=(dayCounts[dayKey]||0)+1;
      // Count total sessions for this day to determine if we need numbering
      const totalForDay=dateItems.filter(i=>i.type==="workout"&&i.day===item.day).length;
      const sessionNum=totalForDay>1?dayCounts[dayKey]:null;
      return renderWorkoutSessionCard(item,sessionNum);
    }).join("");
    return `<div class="date-group"><div class="date-group-header">${formatDate(date)}</div><div style="display:flex;flex-direction:column;gap:8px">${cardHTML}</div></div>`;
  }).join("");

  list.querySelectorAll(".session-card-header").forEach(h=>{ h.addEventListener("click",()=>{ const k=h.dataset.key; if(expandedSessions.has(k)) expandedSessions.delete(k); else expandedSessions.add(k); renderHistory(); }); });
  list.querySelectorAll(".history-delete").forEach(btn=>{ btn.addEventListener("click",e=>{ e.stopPropagation(); deleteEntry(btn.dataset.id,btn.dataset.type,btn.dataset.sessionId); }); });
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
