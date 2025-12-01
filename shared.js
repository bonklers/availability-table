/* =======================
   GLOBAL VERSION STRING
======================= */
const VERSION = "v0.09";

/* =======================
   APPLY VERSION TO TITLE
======================= */
(function applyVersionToTitle() {
  if (typeof VERSION !== "undefined") {
    document.title = document.title + " " + VERSION;
  }
})();

/* ========================== */
/* SUPABASE CONFIG (SINGLE SOURCE) */
/* ========================== */
const SUPABASE_URL = "https://thfrvjwkqesmisyzhfji.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRoZnJ2andrcWVzbWlzeXpoZmppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzNzA2MjksImV4cCI6MjA3OTk0NjYyOX0.lid5S9n4OX2O7IjkO5JFIPBT9mXSIuEMyqt1SCCBECg";

/* ========================== */
/* GRID CONSTANTS */
/* ========================== */
const GRID_ROWS = 7;
const GRID_COLS = 4;
const TOTAL_CELLS = 28;
const COLORS = ["green", "red", "yellow"];

const LEGEND_TEXT = {
  1:"one",2:"two",3:"three",4:"four",5:"five",6:"six",7:"seven",
  8:"eight",9:"nine",10:"ten",11:"eleven",12:"twelve",13:"thirteen",
  14:"fourteen",15:"fifteen",16:"sixteen",17:"seventeen",18:"eighteen",
  19:"nineteen",20:"twenty",21:"twenty-one",22:"twenty-two",
  23:"twenty-three",24:"twenty-four",25:"twenty-five",
  26:"twenty-six",27:"twenty-seven",28:"twenty-eight"
};

/* ========================== */
/* API */
/* ========================== */
async function api(endpoint, method="GET", body=null){
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${endpoint}`,{
    method,
    headers:{
      apikey:SUPABASE_KEY,
      Authorization:`Bearer ${SUPABASE_KEY}`,
      "Content-Type":"application/json",
      Prefer:"return=representation"
    },
    body: body?JSON.stringify(body):null
  });
  return await res.json();
}

/* ========================== */
/* UTILITIES */
/* ========================== */
function nextColor(color){
  return COLORS[(COLORS.indexOf(color)+1) % COLORS.length];
}

function safeUtc(ts){
  return ts.includes("Z") ? ts : ts + "Z";
}

function getDayBounds(dateStr){
  return {
    from: `${dateStr}T00:00:00.000Z`,
    to:   `${dateStr}T23:59:59.999Z`
  };
}

/* ========================== */
/* UNIVERSAL GRID BUILDER */
/* ========================== */
function buildGrid(containerId = "grid", enableClicks = false){

  const table = document.getElementById(containerId);
  if(!table){
    console.error("Grid container missing:", containerId);
    return;
  }

  table.innerHTML = "";
  let id = 1;

  for(let r=0; r<GRID_ROWS; r++){
    const tr = document.createElement("tr");

    for(let c=0; c<GRID_COLS; c++){
      if(id > TOTAL_CELLS) break;

      const td = document.createElement("td");
      td.dataset.id = id;

      td.innerHTML = `
        <div>${id}</div>
        <div class="desc">${LEGEND_TEXT[id]}</div>
      `;

      if(enableClicks){
        const cellId = id;               // ✅ closure safe
        td.style.cursor = "pointer";
        td.onclick = () => changeCell(cellId);
      }

      tr.appendChild(td);
      id++;
    }

    table.appendChild(tr);
  }
}