/* =======================
   GLOBAL VERSION STRING
======================= */
const VERSION = "v0.18";

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

  // Convert local date → UTC range
  const localStart = new Date(dateStr + "T00:00:00");
  const localEnd   = new Date(dateStr + "T23:59:59");

  return {
    from: localStart.toISOString(),
    to:   localEnd.toISOString()
  };
}

/* ========================== */
/* UNIVERSAL GRID BUILDER */
/* ========================== */
function buildGrid(containerId, clickable = false, mode = "tracker") {

  const table = document.getElementById(containerId);
  table.innerHTML = "";

  let id = 1;

  for (let r = 0; r < 7; r++) {

    const tr = document.createElement("tr");

    for (let c = 0; c < 4; c++) {

      if (id > 28) break;

      const td = document.createElement("td");

      // ✅ FIX: capture id safely
      const cellId = id;

      if (mode === "admin") {

        td.innerHTML = `
          <div>${cellId}</div>
          <div id="c${cellId}">0</div>
        `;

      } else {

        const num = document.createElement("div");
        num.innerText = cellId;

        const desc = document.createElement("div");
        desc.className = "desc";
        desc.innerText = LEGEND_TEXT[cellId] || "";

        td.appendChild(num);
        td.appendChild(desc);

        if (clickable) {
          td.addEventListener("click", () => {
            if (typeof changeCell === "function") {
              changeCell(cellId);
            } else {
              console.error("changeCell() not defined");
            }
          });
        }
      }

      tr.appendChild(td);
      id++;
    }

    table.appendChild(tr);
  }
}