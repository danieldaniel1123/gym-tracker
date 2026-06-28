/* ══════════════════════════════════════════
   SUPABASE
   ══════════════════════════════════════════ */
var SUPABASE_URL = "https://nqsfgbbabvgebulgqjrb.supabase.co";
var SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5xc2ZnYmJhYnZnZWJ1bGdxanJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE3ODU1NjIsImV4cCI6MjA5NzM2MTU2Mn0.ga9LykWsCsyzIpOsiAiIk4bkS7EeEvCEFwuHkp7At1U";
var db = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

/* ══════════════════════════════════════════
   MUSCLE COLORS
   ══════════════════════════════════════════ */
var MUSCLE_COLORS = {
  "Chest":                  "#7F77DD",
  "Chest (upper)":          "#7F77DD",
  "Chest (middle)":         "#7F77DD",
  "Chest (lower)":          "#7F77DD",
  "Front delts":            "#378ADD",
  "Side delts":             "#5AA8E8",
  "Rear delts":             "#2E6DB0",
  "Triceps":                "#D4537E",
  "Triceps (long head)":    "#D4537E",
  "Triceps (lateral head)": "#D4537E",
  "Triceps (medial head)":  "#D4537E",
  "Biceps":                 "#5DCAA5",
  "Brachialis":             "#5DCAA5",
  "Forearms":               "#9FE1CB",
  "Back (lats)":            "#EF9F27",
  "Back (mid)":             "#EF9F27",
  "Back (rhomboids)":       "#EF9F27",
  "Back (traps)":           "#FAC775",
  "Traps":                  "#FAC775",
  "Lower back":             "#F0997B",
  "Lower back (erector)":   "#F0997B",
  "Rotator cuff":           "#B5D4F4",
  "Quads":                  "#EF9F27",
  "Hamstrings":             "#1D9E75",
  "Glutes":                 "#D85A30",
  "Glutes (medius)":        "#D85A30",
  "Adductors":              "#97C459",
  "Abductors":              "#97C459",
  "Calves":                 "#534AB7",
  "Calves (soleus)":        "#534AB7",
  "Core":                   "#E24B4A",
  "Core (abs)":             "#E24B4A",
  "Obliques":               "#E87A5D",
  "Hip flexors":            "#F09595",
  "Lats":                   "#EF9F27",
};

/* ══════════════════════════════════════════
   MUSCLE LABEL → BODY-HIGHLIGHTER SLUG
   ══════════════════════════════════════════ */
var MUSCLE_TO_SLUG = {
  "Chest":                  "chest",
  "Chest (upper)":          "chest",
  "Chest (middle)":         "chest",
  "Chest (lower)":          "chest",
  "Front delts":            "front-deltoids",
  "Side delts":             "front-deltoids",
  "Rear delts":             "back-deltoids",
  "Triceps":                "triceps",
  "Triceps (long head)":    "triceps",
  "Triceps (lateral head)": "triceps",
  "Triceps (medial head)":  "triceps",
  "Biceps":                 "biceps",
  "Brachialis":             "biceps",
  "Forearms":               "forearm",
  "Back (lats)":            "upper-back",
  "Back (mid)":             "upper-back",
  "Back (rhomboids)":       "upper-back",
  "Back (traps)":           "trapezius",
  "Traps":                  "trapezius",
  "Lower back":             "lower-back",
  "Lower back (erector)":   "lower-back",
  "Rotator cuff":           "back-deltoids",
  "Quads":                  "quadriceps",
  "Hamstrings":             "hamstring",
  "Glutes":                 "gluteal",
  "Glutes (medius)":        "gluteal",
  "Adductors":              "adductor",
  "Abductors":              "abductors",
  "Calves":                 "calves",
  "Calves (soleus)":        "left-soleus",
  "Core":                   "abs",
  "Core (abs)":             "abs",
  "Obliques":               "obliques",
  "Hip flexors":            "abs",
  "Lats":                   "upper-back",
};

var DAY_OPTIONS = ["Push","Pull","Legs","Back & Biceps","Back & Triceps","Chest & Biceps","Arms","Shoulder","Full body","Upper body","Lower body"];
var ALL_MUSCLES = Object.keys(MUSCLE_COLORS);
var RUN_DISTANCES = [{label:"5k",km:5},{label:"10k",km:10},{label:"16k",km:16},{label:"21k",km:21.1},{label:"42k",km:42.2},{label:"50k",km:50}];

/* ══════════════════════════════════════════
   EXERCISE DATABASE — with specific muscle labels
   ══════════════════════════════════════════ */
var BUILTIN_EXERCISES = [
  // ── CHEST ──
  {name:"Bench Press (Flat)",            days:["Push","Chest & Biceps","Upper body","Full body"], muscles:["Chest (middle)","Front delts","Triceps (lateral head)"],     equipment:["Barbell","Smith machine"]},
  {name:"Bench Press (Incline)",         days:["Push","Chest & Biceps","Upper body","Full body"], muscles:["Chest (upper)","Front delts","Triceps (lateral head)"],       equipment:["Barbell","Smith machine"]},
  {name:"Bench Press (Decline)",         days:["Push","Chest & Biceps","Upper body","Full body"], muscles:["Chest (lower)","Triceps (lateral head)"],                     equipment:["Barbell","Smith machine"]},
  {name:"Flat Barbell Bench Press",      days:["Push","Chest & Biceps","Upper body","Full body"], muscles:["Chest (middle)","Front delts","Triceps (lateral head)"],      equipment:["Barbell"]},
  {name:"Incline Dumbbell Press",        days:["Push","Chest & Biceps","Upper body","Full body"], muscles:["Chest (upper)","Front delts","Triceps (lateral head)"],       equipment:["Dumbbell"]},
  {name:"Flat Dumbbell Chest Press",     days:["Push","Chest & Biceps","Upper body","Full body"], muscles:["Chest (middle)","Front delts","Triceps (lateral head)"],      equipment:["Dumbbell"]},
  {name:"Chest Press (Flat)",            days:["Push","Chest & Biceps","Upper body","Full body"], muscles:["Chest (middle)","Front delts","Triceps"],                     equipment:["Cable machine","Pec deck machine"]},
  {name:"Chest Press (Incline)",         days:["Push","Chest & Biceps","Upper body","Full body"], muscles:["Chest (upper)","Front delts","Triceps"],                      equipment:["Cable machine"]},
  {name:"Chest Press (Decline)",         days:["Push","Chest & Biceps","Upper body","Full body"], muscles:["Chest (lower)","Triceps (lateral head)"],                     equipment:["Cable machine","Smith machine"]},
  {name:"Pectoral Fly",                  days:["Push","Chest & Biceps","Upper body","Full body"], muscles:["Chest (middle)"],                                             equipment:["Pec deck machine"]},
  {name:"Dumbbell Fly (Incline)",        days:["Push","Chest & Biceps","Upper body","Full body"], muscles:["Chest (upper)","Front delts"],                               equipment:["Dumbbell"]},
  {name:"Decline Pectoral Fly",          days:["Push","Chest & Biceps","Upper body","Full body"], muscles:["Chest (lower)"],                                             equipment:["Pec deck machine","Cable machine"]},
  {name:"Cable Chest Fly",               days:["Push","Chest & Biceps","Upper body","Full body"], muscles:["Chest (middle)","Front delts"],                              equipment:["Cable machine"]},
  {name:"Push-up",                       days:["Push","Chest & Biceps","Upper body","Full body"], muscles:["Chest (middle)","Front delts","Triceps (lateral head)"],      equipment:["Bodyweight"]},

  // ── BACK ──
  {name:"Deadlift",                      days:["Pull","Back & Biceps","Legs","Lower body","Full body"], muscles:["Hamstrings","Glutes","Lower back (erector)","Traps"],   equipment:["Barbell"]},
  {name:"Romanian Deadlift (RDL)",       days:["Legs","Back & Biceps","Lower body","Full body"],        muscles:["Hamstrings","Glutes","Lower back (erector)"],           equipment:["Barbell","Dumbbell"]},
  {name:"Stiff-Leg Deadlift",            days:["Legs","Back & Biceps","Lower body","Full body"],        muscles:["Hamstrings","Glutes","Lower back (erector)"],           equipment:["Barbell","Dumbbell"]},
  {name:"Sumo Deadlift",                 days:["Legs","Lower body","Full body"],                        muscles:["Glutes","Hamstrings","Adductors"],                      equipment:["Barbell"]},
  {name:"Bent-Over Barbell Row (Pronated)", days:["Pull","Back & Biceps","Upper body","Full body"],     muscles:["Back (lats)","Back (mid)","Biceps"],                    equipment:["Barbell"]},
  {name:"Bent-Over Barbell Row (Supinated)", days:["Pull","Back & Biceps","Upper body","Full body"],    muscles:["Back (lats)","Back (rhomboids)","Biceps"],              equipment:["Barbell"]},
  {name:"Bent-Over Cable Row",           days:["Pull","Back & Biceps","Upper body","Full body"],        muscles:["Back (lats)","Back (mid)","Biceps"],                    equipment:["Cable machine"]},
  {name:"One-Arm Dumbbell Row",          days:["Pull","Back & Biceps","Upper body","Full body"],        muscles:["Back (lats)","Back (mid)","Biceps"],                    equipment:["Dumbbell"]},
  {name:"Single-Arm Row (Underhand)",    days:["Pull","Back & Biceps","Upper body","Full body"],        muscles:["Back (lats)","Back (rhomboids)","Biceps"],              equipment:["Dumbbell","Cable machine"]},
  {name:"Seated Cable Row",              days:["Pull","Back & Biceps","Upper body","Full body"],        muscles:["Back (mid)","Back (rhomboids)","Biceps"],               equipment:["Seated row machine","Cable machine"]},
  {name:"Seated Cable Row (Close Grip)", days:["Pull","Back & Biceps","Upper body","Full body"],        muscles:["Back (mid)","Back (rhomboids)","Biceps"],               equipment:["Seated row machine","Cable machine"]},
  {name:"Close-Grip Row",                days:["Pull","Back & Biceps","Upper body","Full body"],        muscles:["Back (mid)","Back (rhomboids)","Biceps"],               equipment:["Cable machine","Seated row machine"]},
  {name:"Assisted Row",                  days:["Pull","Back & Biceps","Upper body","Full body"],        muscles:["Back (lats)","Back (mid)","Biceps"],                    equipment:["Assisted row machine"]},
  {name:"Incline Row",                   days:["Pull","Back & Biceps","Upper body","Full body"],        muscles:["Back (lats)","Back (mid)","Rear delts"],                equipment:["Dumbbell","Cable machine"]},
  {name:"Low Row",                       days:["Pull","Back & Biceps","Upper body","Full body"],        muscles:["Back (lats)","Back (mid)","Biceps"],                    equipment:["Cable machine","Seated row machine"]},
  {name:"Row Machine",                   days:["Pull","Back & Biceps","Upper body","Full body"],        muscles:["Back (lats)","Back (mid)","Biceps"],                    equipment:["Row machine"]},
  {name:"Lat Pulldown",                  days:["Pull","Back & Biceps","Upper body","Full body"],        muscles:["Back (lats)","Biceps"],                                 equipment:["Lat pulldown machine","Cable machine"]},
  {name:"Close-Grip Lat Pulldown",       days:["Pull","Back & Biceps","Upper body","Full body"],        muscles:["Back (lats)","Biceps"],                                 equipment:["Lat pulldown machine","Cable machine"]},
  {name:"One-Arm Lat Pulldown",          days:["Pull","Back & Biceps","Upper body","Full body"],        muscles:["Back (lats)","Biceps"],                                 equipment:["Cable machine"]},
  {name:"Pull-Ups",                      days:["Pull","Back & Biceps","Upper body","Full body"],        muscles:["Back (lats)","Biceps","Rear delts"],                    equipment:["Bodyweight","Pull-up bar"]},
  {name:"Face Pull",                     days:["Pull","Back & Biceps","Shoulder","Upper body"],         muscles:["Rear delts","Back (traps)","Rotator cuff"],             equipment:["Cable machine"]},
  {name:"Barbell Shrugs",                days:["Pull","Back & Biceps","Upper body"],                    muscles:["Traps"],                                                equipment:["Barbell","Dumbbell"]},

  // ── SHOULDERS ──
  {name:"Shoulder Press",                days:["Push","Shoulder","Upper body","Full body"], muscles:["Front delts","Side delts","Triceps (lateral head)"],    equipment:["Barbell","Dumbbell","Smith machine"]},
  {name:"Seated Shoulder Press",         days:["Push","Shoulder","Upper body","Full body"], muscles:["Front delts","Side delts","Triceps (lateral head)"],    equipment:["Barbell","Dumbbell","Smith machine"]},
  {name:"Dumbbell Shoulder Press",       days:["Push","Shoulder","Upper body","Full body"], muscles:["Front delts","Side delts","Triceps (lateral head)"],    equipment:["Dumbbell"]},
  {name:"Overhead Shoulder Press",       days:["Push","Shoulder","Upper body","Full body"], muscles:["Front delts","Side delts","Triceps (lateral head)"],    equipment:["Barbell","Dumbbell","Smith machine"]},
  {name:"Side Lateral Raise",            days:["Push","Shoulder","Upper body","Full body"], muscles:["Side delts"],                                          equipment:["Dumbbell","Cable machine"]},
  {name:"Front Raise",                   days:["Push","Shoulder","Upper body","Full body"], muscles:["Front delts","Side delts"],                            equipment:["Dumbbell","Barbell","Cable machine"]},
  {name:"Assisted Front Raise",          days:["Push","Shoulder","Upper body"],             muscles:["Front delts"],                                         equipment:["Cable machine"]},
  {name:"Single-Arm Lateral Raise",      days:["Push","Shoulder","Upper body"],             muscles:["Side delts"],                                          equipment:["Dumbbell","Cable machine"]},
  {name:"Rear Delt Fly",                 days:["Shoulder","Back & Biceps","Upper body"],    muscles:["Rear delts","Back (rhomboids)"],                       equipment:["Dumbbell","Cable machine"]},
  {name:"Reverse Rear Delt Fly",         days:["Shoulder","Back & Biceps","Upper body"],    muscles:["Rear delts","Back (rhomboids)"],                       equipment:["Pec deck machine","Cable machine"]},
  {name:"Supported Rear Delt Fly",       days:["Shoulder","Back & Biceps","Upper body"],    muscles:["Rear delts","Back (rhomboids)"],                       equipment:["Dumbbell"]},
  {name:"Upright Row",                   days:["Shoulder","Upper body"],                    muscles:["Side delts","Traps","Biceps"],                         equipment:["Barbell","EZ bar","Cable machine"]},

  // ── BICEPS ──
  {name:"Barbell Curl",                  days:["Pull","Arms","Back & Biceps","Chest & Biceps"], muscles:["Biceps"],                         equipment:["Barbell","EZ bar"]},
  {name:"Biceps Curl",                   days:["Pull","Arms","Back & Biceps","Chest & Biceps"], muscles:["Biceps"],                         equipment:["Dumbbell","Cable machine"]},
  {name:"Preacher Curl",                 days:["Pull","Arms","Back & Biceps","Chest & Biceps"], muscles:["Biceps"],                         equipment:["EZ bar","Barbell","Dumbbell"]},
  {name:"Spider Curl",                   days:["Pull","Arms","Back & Biceps","Chest & Biceps"], muscles:["Biceps"],                         equipment:["Barbell","Dumbbell","EZ bar"]},
  {name:"Hammer Curl",                   days:["Pull","Arms","Back & Biceps","Chest & Biceps"], muscles:["Biceps","Brachialis","Forearms"], equipment:["Dumbbell"]},
  {name:"Cross-Body Hammer Curl",        days:["Pull","Arms","Back & Biceps","Chest & Biceps"], muscles:["Biceps","Brachialis"],            equipment:["Dumbbell"]},
  {name:"Cross-Body Biceps Curl",        days:["Pull","Arms","Back & Biceps","Chest & Biceps"], muscles:["Biceps"],                         equipment:["Dumbbell","Cable machine"]},
  {name:"Biceps Curl Isolation",         days:["Pull","Arms","Back & Biceps","Chest & Biceps"], muscles:["Biceps"],                         equipment:["Dumbbell","Cable machine"]},

  // ── TRICEPS ──
  {name:"Skull Crusher",                 days:["Push","Arms","Back & Triceps","Upper body"], muscles:["Triceps (long head)"],                               equipment:["EZ bar","Barbell","Dumbbell"]},
  {name:"Incline Skull Crusher",         days:["Push","Arms","Back & Triceps","Upper body"], muscles:["Triceps (long head)"],                               equipment:["EZ bar","Barbell","Dumbbell"]},
  {name:"Dumbbell Skull Crusher",        days:["Push","Arms","Back & Triceps","Upper body"], muscles:["Triceps (long head)"],                               equipment:["Dumbbell"]},
  {name:"Overhead Triceps Extension",    days:["Push","Arms","Back & Triceps","Upper body"], muscles:["Triceps (long head)"],                               equipment:["Dumbbell","Cable machine","EZ bar"]},
  {name:"Triceps Pushdown",              days:["Push","Arms","Back & Triceps","Upper body"], muscles:["Triceps (lateral head)"],                            equipment:["Cable machine"]},
  {name:"Rope Triceps Pushdown",         days:["Push","Arms","Back & Triceps","Upper body"], muscles:["Triceps (lateral head)","Triceps (medial head)"],    equipment:["Cable machine"]},
  {name:"Straight-Bar Triceps Pushdown", days:["Push","Arms","Back & Triceps","Upper body"], muscles:["Triceps (lateral head)"],                            equipment:["Cable machine"]},
  {name:"Cable Triceps Pushdown",        days:["Push","Arms","Back & Triceps","Upper body"], muscles:["Triceps (lateral head)"],                            equipment:["Cable machine"]},
  {name:"Close-Grip Bench Press",        days:["Push","Arms","Back & Triceps","Upper body"], muscles:["Triceps (medial head)","Chest (middle)"],            equipment:["Barbell","Smith machine"]},
  {name:"Triceps Dips",                  days:["Push","Arms","Back & Triceps","Upper body"], muscles:["Triceps (lateral head)","Chest (lower)","Front delts"], equipment:["Bodyweight","Dip machine"]},
  {name:"Flat Triceps Extension",        days:["Push","Arms","Back & Triceps","Upper body"], muscles:["Triceps (long head)"],                               equipment:["Barbell","Dumbbell","EZ bar"]},
  {name:"Bent-Over Triceps Extension",   days:["Push","Arms","Back & Triceps","Upper body"], muscles:["Triceps (long head)"],                               equipment:["Dumbbell","Cable machine"]},
  {name:"Reverse Triceps Extension",     days:["Push","Arms","Back & Triceps","Upper body"], muscles:["Triceps (medial head)"],                             equipment:["Cable machine"]},
  {name:"Triceps Extension",             days:["Push","Arms","Back & Triceps","Upper body"], muscles:["Triceps (long head)"],                               equipment:["Dumbbell","Cable machine","EZ bar"]},

  // ── LEGS ──
  {name:"Barbell Squat",                 days:["Legs","Lower body","Full body"], muscles:["Quads","Glutes","Hamstrings"],                       equipment:["Barbell","Smith machine"]},
  {name:"Weighted Squat",                days:["Legs","Lower body","Full body"], muscles:["Quads","Glutes","Hamstrings"],                       equipment:["Barbell","Dumbbell","Smith machine"]},
  {name:"Goblet Squat",                  days:["Legs","Lower body","Full body"], muscles:["Quads","Glutes"],                                   equipment:["Dumbbell","Kettlebell"]},
  {name:"Sumo Squat",                    days:["Legs","Lower body","Full body"], muscles:["Glutes","Quads","Adductors"],                       equipment:["Barbell","Dumbbell","Kettlebell"]},
  {name:"Bulgarian Split Squat",         days:["Legs","Lower body","Full body"], muscles:["Quads","Glutes"],                                   equipment:["Bodyweight","Dumbbell","Barbell"]},
  {name:"Walking Lunges",                days:["Legs","Lower body","Full body"], muscles:["Quads","Glutes","Hamstrings"],                       equipment:["Bodyweight","Dumbbell","Barbell"]},
  {name:"Static Lunges",                 days:["Legs","Lower body","Full body"], muscles:["Quads","Glutes","Hamstrings"],                       equipment:["Bodyweight","Dumbbell","Barbell"]},
  {name:"Single-Leg Lunges",             days:["Legs","Lower body","Full body"], muscles:["Quads","Glutes","Hamstrings"],                       equipment:["Bodyweight","Dumbbell"]},
  {name:"Leg Press",                     days:["Legs","Lower body","Full body"], muscles:["Quads","Glutes","Hamstrings"],                       equipment:["Leg press machine"]},
  {name:"Leg Extension",                 days:["Legs","Lower body","Full body"], muscles:["Quads"],                                            equipment:["Leg extension machine"]},
  {name:"Leg Curl",                      days:["Legs","Lower body","Full body"], muscles:["Hamstrings"],                                       equipment:["Leg curl machine"]},
  {name:"Calf Raises",                   days:["Legs","Lower body","Full body"], muscles:["Calves"],                                           equipment:["Calf raise machine","Bodyweight","Barbell"]},
  {name:"Seated Calf Raises",            days:["Legs","Lower body","Full body"], muscles:["Calves (soleus)"],                                  equipment:["Seated calf raise machine"]},
  {name:"Weighted Calf Raises",          days:["Legs","Lower body","Full body"], muscles:["Calves"],                                           equipment:["Barbell","Dumbbell","Calf raise machine"]},
  {name:"Hip Thrust",                    days:["Legs","Lower body","Full body"], muscles:["Glutes","Hamstrings"],                              equipment:["Barbell","Hip thrust machine"]},

  // ── CORE ──
  {name:"Hanging Leg Raises",            days:["Full body","Upper body"], muscles:["Core (abs)","Hip flexors"],  equipment:["Pull-up bar"]},
  {name:"Leg Raises",                    days:["Full body","Upper body"], muscles:["Core (abs)","Hip flexors"],  equipment:["Bodyweight","Bench"]},
  {name:"Knee Raises",                   days:["Full body","Upper body"], muscles:["Core (abs)","Hip flexors"],  equipment:["Pull-up bar","Bodyweight"]},
  {name:"Crunches",                      days:["Full body","Upper body"], muscles:["Core (abs)"],               equipment:["Bodyweight"]},
  {name:"Plank",                         days:["Full body","Upper body"], muscles:["Core"],                     equipment:["Bodyweight"]},
  {name:"Cable Crunch",                  days:["Full body","Upper body"], muscles:["Core (abs)"],               equipment:["Cable machine"]},
  {name:"Ab Wheel Rollout",              days:["Full body","Upper body"], muscles:["Core (abs)","Lats"],        equipment:["Ab wheel"]},
];
