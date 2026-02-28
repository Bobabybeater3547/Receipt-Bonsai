// Receipt Bonsai — cute accumulation-as-art PWA
const STORAGE_KEY = "receipt_bonsai_v1";

const TYPES = [
  {
    "id": "cafe",
    "name": "Cafe",
    "hint": "coffee & pastries",
    "color": "#F3C7C4"
  },
  {
    "id": "konbini",
    "name": "Konbini",
    "hint": "snack run",
    "color": "#F6E1A6"
  },
  {
    "id": "groceries",
    "name": "Groceries",
    "hint": "fresh & simple",
    "color": "#BFE7D1"
  },
  {
    "id": "transit",
    "name": "Transit",
    "hint": "train/bus",
    "color": "#CFE4F7"
  },
  {
    "id": "books",
    "name": "Books",
    "hint": "paper & ink",
    "color": "#E7D7F6"
  },
  {
    "id": "gift",
    "name": "Gift",
    "hint": "for someone",
    "color": "#F7D0E8"
  },
  {
    "id": "home",
    "name": "Home",
    "hint": "little fixes",
    "color": "#D7F0E8"
  },
  {
    "id": "dining",
    "name": "Dining",
    "hint": "a meal out",
    "color": "#FAD7B5"
  },
  {
    "id": "market",
    "name": "Market",
    "hint": "small vendors",
    "color": "#CFEFD5"
  },
  {
    "id": "pharmacy",
    "name": "Pharmacy",
    "hint": "essentials",
    "color": "#D8E6FF"
  },
  {
    "id": "hobby",
    "name": "Hobby",
    "hint": "tools & toys",
    "color": "#FFE0EA"
  },
  {
    "id": "other",
    "name": "Other",
    "hint": "misc",
    "color": "#EDE2D0"
  }
];

const TYPE_ICON = {
  "cafe": "<svg viewBox=\"0 0 64 64\" aria-hidden=\"true\" focusable=\"false\">\n      <g fill=\"none\" stroke=\"#C67970\" stroke-width=\"2.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\">\n        \n        <path d=\"M18 38c0 4 3 7 7 7h14c4 0 7-3 7-7V24H18v14z\"/>\n        <path d=\"M46 28h6c3 0 5 2 5 5s-2 5-5 5h-6\"/>\n        <path d=\"M16 46h32\"/><path d=\"M14 49h36\"/>\n        <path d=\"M22 26h20v6H22z\" fill=\"#7A4636\" opacity=\"0.75\" stroke=\"none\"/>\n        <path d=\"M24 29c3-3 9-3 12 0\" stroke=\"#FBF6EE\" stroke-width=\"2.2\"/>\n        \n      </g>\n    </svg>",
  "konbini": "<svg viewBox=\"0 0 64 64\" aria-hidden=\"true\" focusable=\"false\">\n      <g fill=\"none\" stroke=\"#C67970\" stroke-width=\"2.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\">\n        \n        <path d=\"M18 22h28v34H18z\"/>\n        <path d=\"M22 22l2-10h16l2 10\"/>\n        <path d=\"M24 36h16\"/><path d=\"M24 44h16\"/>\n        <circle cx=\"26\" cy=\"30\" r=\"2.2\" fill=\"#77B592\" stroke=\"none\"/>\n        <circle cx=\"32\" cy=\"30\" r=\"2.2\" fill=\"#F6E1A6\" stroke=\"none\"/>\n        <circle cx=\"38\" cy=\"30\" r=\"2.2\" fill=\"#F3C7C4\" stroke=\"none\"/>\n        \n      </g>\n    </svg>",
  "groceries": "<svg viewBox=\"0 0 64 64\" aria-hidden=\"true\" focusable=\"false\">\n      <g fill=\"none\" stroke=\"#C67970\" stroke-width=\"2.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\">\n        \n        <path d=\"M22 26h20l-2 26H24l-2-26z\"/>\n        <path d=\"M26 26c0-6 12-6 12 0\"/>\n        <path d=\"M26 38h12\"/>\n        <path d=\"M28 32c1 2 2 2 4 0\" stroke=\"#77B592\" stroke-width=\"2.2\"/>\n        \n      </g>\n    </svg>",
  "transit": "<svg viewBox=\"0 0 64 64\" aria-hidden=\"true\" focusable=\"false\">\n      <g fill=\"none\" stroke=\"#C67970\" stroke-width=\"2.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\">\n        \n        <path d=\"M22 14h20v30c0 4-3 7-7 7H29c-4 0-7-3-7-7V14z\"/>\n        <path d=\"M24 22h16\"/><path d=\"M24 30h16\"/>\n        <circle cx=\"28\" cy=\"46\" r=\"2.6\" fill=\"#1E2630\" opacity=\"0.45\" stroke=\"none\"/>\n        <circle cx=\"36\" cy=\"46\" r=\"2.6\" fill=\"#1E2630\" opacity=\"0.45\" stroke=\"none\"/>\n        <path d=\"M20 50h24\"/>\n        \n      </g>\n    </svg>",
  "books": "<svg viewBox=\"0 0 64 64\" aria-hidden=\"true\" focusable=\"false\">\n      <g fill=\"none\" stroke=\"#C67970\" stroke-width=\"2.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\">\n        \n        <path d=\"M22 16h18c3 0 6 2 6 5v27c-2-2-4-3-6-3H22V16z\"/>\n        <path d=\"M22 16c0 3-2 5-5 5v27c3 0 5 2 5 5\"/>\n        <path d=\"M26 26h12\"/><path d=\"M26 32h12\"/>\n        \n      </g>\n    </svg>",
  "gift": "<svg viewBox=\"0 0 64 64\" aria-hidden=\"true\" focusable=\"false\">\n      <g fill=\"none\" stroke=\"#C67970\" stroke-width=\"2.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\">\n        \n        <path d=\"M20 30h24v22H20z\"/>\n        <path d=\"M20 30h24v-6H20v6z\"/>\n        <path d=\"M32 24v28\"/>\n        <path d=\"M28 24c-3 0-5-2-5-4s2-4 5-2c2 1 3 3 4 6\"/>\n        <path d=\"M36 24c3 0 5-2 5-4s-2-4-5-2c-2 1-3 3-4 6\"/>\n        \n      </g>\n    </svg>",
  "home": "<svg viewBox=\"0 0 64 64\" aria-hidden=\"true\" focusable=\"false\">\n      <g fill=\"none\" stroke=\"#C67970\" stroke-width=\"2.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\">\n        \n        <path d=\"M20 32l12-12 12 12\"/>\n        <path d=\"M24 30v22h16V30\"/>\n        <path d=\"M30 52V40h4v12\"/>\n        <path d=\"M28 36h8\"/>\n        \n      </g>\n    </svg>",
  "dining": "<svg viewBox=\"0 0 64 64\" aria-hidden=\"true\" focusable=\"false\">\n      <g fill=\"none\" stroke=\"#C67970\" stroke-width=\"2.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\">\n        \n        <path d=\"M22 22h20v10c0 6-4 10-10 10s-10-4-10-10V22z\"/>\n        <path d=\"M22 48h20\"/>\n        <path d=\"M28 18v10\"/><path d=\"M36 18v10\"/>\n        <path d=\"M32 22v20\" stroke=\"#FBF6EE\" stroke-width=\"2.2\"/>\n        \n      </g>\n    </svg>",
  "market": "<svg viewBox=\"0 0 64 64\" aria-hidden=\"true\" focusable=\"false\">\n      <g fill=\"none\" stroke=\"#C67970\" stroke-width=\"2.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\">\n        \n        <path d=\"M18 26h28l-2 26H20l-2-26z\"/>\n        <path d=\"M20 26c2-10 22-10 24 0\"/>\n        <path d=\"M24 38h16\"/>\n        <path d=\"M26 32c2 3 5 3 7 0\" stroke=\"#77B592\" stroke-width=\"2.2\"/>\n        \n      </g>\n    </svg>",
  "pharmacy": "<svg viewBox=\"0 0 64 64\" aria-hidden=\"true\" focusable=\"false\">\n      <g fill=\"none\" stroke=\"#C67970\" stroke-width=\"2.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\">\n        \n        <path d=\"M22 20h20v32H22z\"/>\n        <path d=\"M32 26v20\"/><path d=\"M24 36h16\"/>\n        <path d=\"M26 20c0-4 12-4 12 0\"/>\n        \n      </g>\n    </svg>",
  "hobby": "<svg viewBox=\"0 0 64 64\" aria-hidden=\"true\" focusable=\"false\">\n      <g fill=\"none\" stroke=\"#C67970\" stroke-width=\"2.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\">\n        \n        <path d=\"M20 42l24-16\"/>\n        <path d=\"M24 24l16 24\"/>\n        <circle cx=\"24\" cy=\"24\" r=\"4\"/>\n        <circle cx=\"40\" cy=\"40\" r=\"4\"/>\n        <path d=\"M30 30l4 4\" stroke=\"#77B592\" stroke-width=\"2.2\"/>\n        \n      </g>\n    </svg>",
  "other": "<svg viewBox=\"0 0 64 64\" aria-hidden=\"true\" focusable=\"false\">\n      <g fill=\"none\" stroke=\"#C67970\" stroke-width=\"2.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\">\n        \n        <path d=\"M22 18h20v28H22z\"/>\n        <path d=\"M26 22h12\"/><path d=\"M26 28h12\"/><path d=\"M26 34h12\"/>\n        <path d=\"M24 46l8 8 8-8\" stroke=\"#77B592\" stroke-width=\"2.2\"/>\n        \n      </g>\n    </svg>"
};

const ANCHORS = [[400, 120], [360, 135], [440, 140], [320, 160], [480, 165], [380, 175], [420, 175], [350, 205], [450, 210], [300, 205], [500, 210], [335, 235], [465, 235], [395, 245], [430, 255], [365, 255], [285, 245], [515, 245], [320, 280], [480, 280], [360, 295], [440, 295], [300, 315], [500, 315], [335, 335], [465, 335], [385, 350], [415, 350], [360, 375], [440, 375], [315, 365], [485, 365], [270, 290], [530, 290], [250, 330], [550, 330], [290, 410], [510, 410], [330, 430], [470, 430], [285, 455], [515, 455], [350, 470], [450, 470], [260, 490], [540, 490], [315, 510], [485, 510], [350, 520], [450, 520], [395, 535], [420, 540], [370, 545], [440, 550]];

const state = {
  view: "tree",
  search: ""
};

let data = loadData();

function loadData(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if(!raw) return { entries: [], prefs: { showAmounts: true } };
    const d = JSON.parse(raw);
    if(!Array.isArray(d.entries)) d.entries = [];
    if(!d.prefs) d.prefs = { showAmounts: true };
    if(typeof d.prefs.showAmounts !== "boolean") d.prefs.showAmounts = true;
    return d;
  }catch(e){
    return { entries: [], prefs: { showAmounts: true } };
  }
}
function saveData(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }

const app = document.getElementById("app");
const modalRoot = document.getElementById("modalRoot");

function nowISO(){ return new Date().toISOString(); }
function pad2(n){ return String(n).padStart(2,"0"); }
function shortDate(iso){
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { year:"numeric", month:"short", day:"numeric" });
}
function escapeHTML(s){
  return String(s ?? "")
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll("\"","&quot;")
    .replaceAll("'","&#39;");
}
function escapeAttr(s){ return escapeHTML(s).replaceAll("\n"," "); }

function uid(){
  const a = new Uint8Array(16);
  (crypto || window.msCrypto).getRandomValues(a);
  return Array.from(a).map(x=>x.toString(16).padStart(2,"0")).join("");
}

function topbar(leftHTML, rightHTML){
  return `
    <div class="topbar">
      <div>${leftHTML || ""}</div>
      <div></div>
      <div>${rightHTML || ""}</div>
    </div>
  `;
}

function openModal(innerHTML){
  modalRoot.innerHTML = innerHTML;
  modalRoot.classList.remove("hidden");
  modalRoot.onclick = (e)=>{ if(e.target === modalRoot) closeModal(); };
  window.addEventListener("keydown", escCloseOnce);
}
function escCloseOnce(e){ if(e.key === "Escape") closeModal(); }
function closeModal(rerender=true){
  modalRoot.classList.add("hidden");
  modalRoot.innerHTML = "";
  window.removeEventListener("keydown", escCloseOnce);
  if(rerender) render();
}

function render(){
  if(state.view === "tree") renderTree();
  if(state.view === "list") renderList();
  if(state.view === "settings") renderSettings();
}

function renderTree(){
  const left = `<button class="iconBtn" id="goList" aria-label="List">🧾</button>`;
  const right = `<button class="iconBtn" id="goSettings" aria-label="Settings">⚙️</button>`;

  const count = data.entries.length;
  const stage = growthStage(count);

  app.innerHTML = `
    ${topbar(left, right)}
    <div class="titleBlock">
      <div class="title">Receipt Bonsai</div>
      <div class="sub">Tiny receipts become leaves. No guilt. Just a tree.</div>
    </div>

    <div class="panel">
      <div class="treeWrap">
        <div class="treeMeta">
          <div class="pill">Leaves: <b>${count}</b></div>
          <div class="treeStage">${stage}</div>
        </div>
        <svg id="treeSvg" viewBox="0 0 800 820" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Your receipt bonsai">
  <defs>
    <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="10" flood-color="#000" flood-opacity="0.12"/>
    </filter>
    <filter id="leafSoft" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#000" flood-opacity="0.14"/>
    </filter>
    <linearGradient id="potGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#FFFFFF" stop-opacity="0.35"/>
      <stop offset="1" stop-color="#FFFFFF" stop-opacity="0.10"/>
    </linearGradient>
    <linearGradient id="groundGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.10"/>
      <stop offset="1" stop-color="#ffffff" stop-opacity="0.0"/>
    </linearGradient>

    <symbol id="leafShape" viewBox="-40 -40 80 80">
      <path d="M-6 26c18-6 32-24 28-40C14-26-6-36-20-28c-14 8-18 32 14 54z"
            fill="currentColor" opacity="0.92"/>
      <path d="M-18 -22c10 12 18 28 22 48" fill="none" stroke="#1E2630" opacity="0.16" stroke-width="2.4" stroke-linecap="round"/>
      <path d="M-4 2c-8 2-14 8-16 16" fill="none" stroke="#1E2630" opacity="0.10" stroke-width="2.0" stroke-linecap="round"/>
    </symbol>

    <symbol id="leafReceipt" viewBox="-20 -20 40 40">
      <path d="M-10 -12h20v22l-3-2-3 2-3-2-3 2-3-2-3 2V-12z" fill="#FBF6EE" opacity="0.75"/>
      <path d="M-6 -6h12M-6 -2h12M-6 2h9" stroke="#C67970" stroke-width="2.0" stroke-linecap="round" opacity="0.85"/>
    </symbol>
  </defs>

  <ellipse cx="400" cy="760" rx="320" ry="55" fill="url(#groundGrad)"/>

  <g filter="url(#softShadow)">
    <path d="M410 620c6-70 2-120-8-165-14-60-34-104-32-150 2-44 30-82 68-96"
          fill="none" stroke="#7A4636" stroke-width="18" stroke-linecap="round" stroke-linejoin="round" opacity="0.92"/>
    <path d="M395 505c-26-16-54-34-76-68-14-22-20-46-18-72"
          fill="none" stroke="#7A4636" stroke-width="14" stroke-linecap="round" opacity="0.92"/>
    <path d="M420 470c28-18 58-42 80-78 14-24 18-50 12-78"
          fill="none" stroke="#7A4636" stroke-width="14" stroke-linecap="round" opacity="0.92"/>
    <path d="M360 410c-30-10-54-26-70-52"
          fill="none" stroke="#7A4636" stroke-width="12" stroke-linecap="round" opacity="0.92"/>
    <path d="M455 400c28-12 52-30 68-58"
          fill="none" stroke="#7A4636" stroke-width="12" stroke-linecap="round" opacity="0.92"/>
    <path d="M438 330c22-18 40-40 48-68"
          fill="none" stroke="#7A4636" stroke-width="10" stroke-linecap="round" opacity="0.92"/>
    <path d="M352 330c-20-16-36-38-42-66"
          fill="none" stroke="#7A4636" stroke-width="10" stroke-linecap="round" opacity="0.92"/>
  </g>

  <g id="leafLayer"></g>

  <g filter="url(#softShadow)">
    <path d="M260 620h280l-26 130c-3 18-18 32-36 32H322c-18 0-33-14-36-32l-26-130z"
          fill="url(#potGrad)" stroke="#C67970" stroke-width="6" stroke-linejoin="round"/>
    <path d="M248 620c40-34 264-34 304 0" fill="none" stroke="#C67970" stroke-width="6" stroke-linecap="round"/>
    <circle cx="360" cy="700" r="8" fill="#1E2630" opacity="0.45"/>
    <circle cx="440" cy="700" r="8" fill="#1E2630" opacity="0.45"/>
    <path d="M392 728c14 10 30 10 44 0" fill="none" stroke="#1E2630" opacity="0.35" stroke-width="5" stroke-linecap="round"/>
  </g>

  <path d="M290 628c30-24 190-24 220 0" fill="#1E2630" opacity="0.06"/>
</svg>

      </div>
    </div>

    <button class="fab" id="fab" aria-label="Add">+</button>
  `;

  document.getElementById("goList").onclick = ()=>{ state.view="list"; render(); };
  document.getElementById("goSettings").onclick = ()=>{ state.view="settings"; render(); };
  document.getElementById("fab").onclick = ()=> openTypePicker();

  drawLeaves();
}

function growthStage(n){
  if(n === 0) return "Seedling. Add your first leaf.";
  if(n < 6) return "Sprouting.";
  if(n < 18) return "Growing.";
  if(n < 36) return "Blooming.";
  if(n < 60) return "A sturdy little tree.";
  return "A whole life, in leaves.";
}

function drawLeaves(){
  const svg = document.getElementById("treeSvg");
  const layer = svg.querySelector("#leafLayer");
  layer.innerHTML = "";

  const entries = [...data.entries].sort((a,b)=>new Date(a.at)-new Date(b.at));

  const LEAF_D = "M-6 26c18-6 32-24 28-40C14-26-6-36-20-28c-14 8-18 32 14 54z";
  const RECEIPT_D = "M-10 -12h20v22l-3-2-3 2-3-2-3 2-3-2-3 2V-12z";

  entries.forEach((e, idx)=>{
    const anchor = ANCHORS[idx % ANCHORS.length];
    const jitter = seededJitter(e.id);

    const x = anchor[0] + jitter[0];
    const y = anchor[1] + jitter[1];
    const rot = jitter[2];

    const t = TYPES.find(t=>t.id===e.type) || TYPES[TYPES.length-1];
    const color = t.color || "#BFE7D1";

    const g = document.createElementNS("http://www.w3.org/2000/svg","g");
    g.setAttribute("class","leafHit");
    g.setAttribute("data-id", e.id);
    g.setAttribute("filter","url(#leafSoft)");
    g.setAttribute("transform", `translate(${x} ${y}) rotate(${rot}) scale(0.88)`);

    const fill = document.createElementNS("http://www.w3.org/2000/svg","path");
    fill.setAttribute("d", LEAF_D);
    fill.setAttribute("fill", color);
    fill.setAttribute("opacity", "0.88");
    g.appendChild(fill);

    const hi = document.createElementNS("http://www.w3.org/2000/svg","path");
    hi.setAttribute("d", "M-10 -20c10 10 18 26 22 44");
    hi.setAttribute("fill","none");
    hi.setAttribute("stroke","#FFFFFF");
    hi.setAttribute("opacity","0.18");
    hi.setAttribute("stroke-width","3");
    hi.setAttribute("stroke-linecap","round");
    g.appendChild(hi);

    const outline = document.createElementNS("http://www.w3.org/2000/svg","path");
    outline.setAttribute("d", LEAF_D);
    outline.setAttribute("fill","none");
    outline.setAttribute("stroke","#C67970");
    outline.setAttribute("stroke-width","2.3");
    outline.setAttribute("opacity","0.55");
    outline.setAttribute("stroke-linecap","round");
    outline.setAttribute("stroke-linejoin","round");
    g.appendChild(outline);

    const sticker = document.createElementNS("http://www.w3.org/2000/svg","path");
    sticker.setAttribute("d", RECEIPT_D);
    sticker.setAttribute("fill", "#FBF6EE");
    sticker.setAttribute("opacity", "0.72");
    sticker.setAttribute("transform","translate(8 2) scale(0.9)");
    g.appendChild(sticker);

    const lines = document.createElementNS("http://www.w3.org/2000/svg","path");
    lines.setAttribute("d","M2 -4h12M2 0h12M2 4h9");
    lines.setAttribute("fill","none");
    lines.setAttribute("stroke","#C67970");
    lines.setAttribute("stroke-width","2.1");
    lines.setAttribute("stroke-linecap","round");
    lines.setAttribute("opacity","0.78");
    lines.setAttribute("transform","translate(8 2)");
    g.appendChild(lines);

    g.addEventListener("click", ()=> openEdit(e.id));
    layer.appendChild(g);
  });
}


function seededJitter(seed){
  let h = 2166136261;
  for(let i=0;i<seed.length;i++){ h ^= seed.charCodeAt(i); h = Math.imul(h, 16777619); }
  const r1 = ((h >>> 0) % 1000) / 1000;
  const r2 = (((h >>> 8) >>> 0) % 1000) / 1000;
  const r3 = (((h >>> 16) >>> 0) % 1000) / 1000;
  const jx = (r1 - 0.5) * 26;
  const jy = (r2 - 0.5) * 22;
  const rot = (r3 - 0.5) * 24;
  return [jx, jy, rot];
}

function openTypePicker(){
  openModal(`
    <div class="sheet">
      <div class="sheetHeader">
        <div class="mini"><button id="close">✕</button></div>
        <div class="title">Add a receipt leaf</div>
        <div class="mini"><button id="info">i</button></div>
      </div>
      <div class="sheetBody">
        <div class="pickGrid">
          ${TYPES.map(t=>`
            <button class="pickBtn" data-type="${t.id}">
              <div class="pTop">
                <span class="iconMini">${TYPE_ICON[t.id] || ""}</span>
                <div>
                  <div class="pName">${t.name}</div>
                  <div class="pHint">${t.hint}</div>
                </div>
              </div>
            </button>
          `).join("")}
        </div>
      </div>
    </div>
  `);

  document.getElementById("close").onclick = ()=> closeModal();
  document.getElementById("info").onclick = ()=> alert("Pick a type, add an optional note.\nEach receipt becomes one leaf on your bonsai.");

  modalRoot.querySelectorAll(".pickBtn").forEach(btn=>{
    btn.addEventListener("click", ()=> {
      const type = btn.dataset.type;
      openCreate(type);
    });
  });
}

function openCreate(type){
  const t = TYPES.find(x=>x.id===type) || TYPES[TYPES.length-1];
  openModal(editorHTML({
    mode: "create",
    id: uid(),
    type: t.id,
    at: nowISO(),
    note: "",
    amount: ""
  }));
  wireEditor("create");
}

function openEdit(id){
  const e = data.entries.find(x=>x.id===id);
  if(!e) return;
  openModal(editorHTML({ mode:"edit", ...e }));
  wireEditor("edit");
}

function editorHTML(e){
  const t = TYPES.find(x=>x.id===e.type) || TYPES[TYPES.length-1];
  const showAmt = !!data.prefs.showAmounts;

  return `
    <div class="sheet">
      <div class="sheetHeader">
        <div class="mini"><button id="close">✕</button></div>
        <div class="title">${e.mode==="create" ? "New leaf" : "Leaf details"}</div>
        <div class="mini"><button id="change" title="Change type">↻</button></div>
      </div>
      <div class="sheetBody">
        <div style="display:flex; gap:12px; align-items:center;">
          <span class="iconMini">${TYPE_ICON[t.id] || ""}</span>
          <div>
            <div class="badge">${t.name}</div>
            <div class="small" style="margin-top:6px;">${shortDate(e.at)}</div>
          </div>
        </div>

        <div class="formRow" style="margin-top:14px; align-items:flex-start;">
          <div class="label" style="padding-top:10px;">Note</div>
          <textarea id="note" placeholder="optional">${escapeHTML(e.note || "")}</textarea>
        </div>

        <div class="formRow">
          <div class="label">Amount</div>
          <input id="amount" class="input" placeholder="${showAmt ? "optional (e.g. 680)" : "hidden in Settings"}" value="${showAmt ? escapeAttr(e.amount || "") : ""}" ${showAmt ? "" : "disabled"} />
        </div>

        <div class="actions">
          ${e.mode==="edit" ? `<button class="btn danger" id="del">Delete</button>` : `<button class="btn" id="cancel">Cancel</button>`}
          <button class="btn primary" id="save">Save</button>
        </div>

        <div class="small" style="margin-top:12px; opacity:0.65;">
          Tip: Export a poster or JSON backup in Settings.
        </div>

        <input type="hidden" id="eid" value="${escapeAttr(e.id)}" />
        <input type="hidden" id="etype" value="${escapeAttr(e.type)}" />
        <input type="hidden" id="eat" value="${escapeAttr(e.at)}" />
      </div>
    </div>
  `;
}

function wireEditor(mode){
  document.getElementById("close").onclick = ()=> closeModal();
  const cancel = document.getElementById("cancel");
  if(cancel) cancel.onclick = ()=> closeModal();

  document.getElementById("change").onclick = ()=> {
    const keep = {
      id: document.getElementById("eid").value,
      type: document.getElementById("etype").value,
      at: document.getElementById("eat").value,
      note: document.getElementById("note").value || "",
      amount: document.getElementById("amount") && !document.getElementById("amount").disabled ? (document.getElementById("amount").value || "") : ""
    };
    closeModal(false);
    openModal(`
      <div class="sheet">
        <div class="sheetHeader">
          <div class="mini"><button id="close2">✕</button></div>
          <div class="title">Change type</div>
          <div class="mini"><button id="info2">i</button></div>
        </div>
        <div class="sheetBody">
          <div class="pickGrid">
            ${TYPES.map(t=>`
              <button class="pickBtn" data-type="${t.id}">
                <div class="pTop">
                  <span class="iconMini">${TYPE_ICON[t.id] || ""}</span>
                  <div>
                    <div class="pName">${t.name}</div>
                    <div class="pHint">${t.hint}</div>
                  </div>
                </div>
              </button>
            `).join("")}
          </div>
        </div>
      </div>
    `);
    document.getElementById("close2").onclick = ()=> closeModal();
    document.getElementById("info2").onclick = ()=> alert("Pick a new type. Your note stays.");
    modalRoot.querySelectorAll(".pickBtn").forEach(btn=>{
      btn.addEventListener("click", ()=> {
        keep.type = btn.dataset.type;
        closeModal(false);
        openModal(editorHTML({ mode, ...keep }));
        wireEditor(mode);
      });
    });
  };

  const del = document.getElementById("del");
  if(del){
    del.onclick = ()=> {
      if(confirm("Delete this leaf?")){
        const id = document.getElementById("eid").value;
        data.entries = data.entries.filter(x=>x.id !== id);
        saveData();
        closeModal();
      }
    };
  }

  document.getElementById("save").onclick = ()=> {
    const id = document.getElementById("eid").value;
    const type = document.getElementById("etype").value;
    const at = document.getElementById("eat").value;
    const note = (document.getElementById("note").value || "").trimEnd();

    const amtEl = document.getElementById("amount");
    let amount = "";
    if(amtEl && !amtEl.disabled) amount = (amtEl.value || "").trim();
    else {
      // preserve prior amount if hidden
      const prior = data.entries.find(x=>x.id===id);
      amount = prior ? (prior.amount || "") : "";
    }

    const entry = { id, type, at, note, amount };
    const idx = data.entries.findIndex(x=>x.id===id);
    if(idx >= 0) data.entries[idx] = entry;
    else data.entries.push(entry);

    data.entries.sort((a,b)=>new Date(a.at)-new Date(b.at));
    saveData();
    closeModal();
  };
}

function renderList(){
  const left = `<button class="iconBtn" id="back" aria-label="Back">←</button>`;
  const right = `<button class="iconBtn" id="goSettings" aria-label="Settings">⚙️</button>`;

  const entries = [...data.entries].sort((a,b)=>new Date(b.at)-new Date(a.at));
  const q = (state.search || "").toLowerCase().trim();
  const filtered = q ? entries.filter(e=> {
    const t = (TYPES.find(x=>x.id===e.type)?.name || "").toLowerCase();
    const n = (e.note || "").toLowerCase();
    const a = (e.amount || "").toLowerCase();
    return t.includes(q) || n.includes(q) || a.includes(q);
  }) : entries;

  app.innerHTML = `
    ${topbar(left, right)}
    <div class="titleBlock">
      <div class="title">Leaves</div>
      <div class="sub">${filtered.length} item(s)</div>
    </div>

    <div class="searchRow">
      <input class="input" id="search" placeholder="Search (type, note, amount)" value="${escapeAttr(state.search)}" />
    </div>

    <div>
      ${filtered.length===0 ? `<div class="small" style="padding:14px 18px;">No leaves yet. Add one from the tree.</div>` : ""}
      ${filtered.map(e=>cardHTML(e)).join("")}
    </div>
  `;

  document.getElementById("back").onclick = ()=>{ state.view="tree"; render(); };
  document.getElementById("goSettings").onclick = ()=>{ state.view="settings"; render(); };

  document.getElementById("search").oninput = (ev)=>{
    state.search = ev.target.value || "";
    renderList();
  };

  app.querySelectorAll(".card").forEach(el=>{
    el.addEventListener("click", ()=> openEdit(el.dataset.id));
  });
}

function cardHTML(e){
  const t = TYPES.find(x=>x.id===e.type) || TYPES[TYPES.length-1];
  const showAmt = !!data.prefs.showAmounts;
  const amt = (showAmt && e.amount) ? ` • ¥${escapeHTML(e.amount)}` : "";
  return `
    <div class="card" data-id="${escapeAttr(e.id)}">
      <span class="iconMini">${TYPE_ICON[t.id] || ""}</span>
      <div class="meta">
        <div class="d">${shortDate(e.at)} <span class="badge">${t.name}</span></div>
        <div class="s">${escapeHTML(t.hint)}${amt}</div>
        ${e.note ? `<div class="n">${escapeHTML(e.note)}</div>` : ``}
      </div>
    </div>
  `;
}

function renderSettings(){
  const left = `<button class="iconBtn" id="back" aria-label="Back">←</button>`;
  app.innerHTML = `
    ${topbar(left, "")}
    <div class="titleBlock">
      <div class="title">Settings</div>
      <div class="sub">Keep it gentle.</div>
    </div>

    <div class="settings">
      <div class="block">
        <div class="h">Preferences</div>
        <label class="small" style="display:flex; gap:10px; align-items:center;">
          <input id="showAmt" type="checkbox" ${data.prefs.showAmounts ? "checked" : ""} />
          Show amounts (optional)
        </label>
        <div class="small" style="margin-top:10px;">
          If off, amount fields are hidden (but preserved in your data).
        </div>
      </div>

      <div class="block">
        <div class="h">Export / Import</div>
        <button class="btn" id="exportJSON">Export JSON backup</button>
        <div style="height:8px"></div>
        <label class="btn" style="display:block; text-align:center; cursor:pointer;">
          Import JSON backup
          <input id="importJSON" type="file" accept="application/json" style="display:none;">
        </label>
        <hr class="hair"/>
        <button class="btn" id="exportPoster">Export Bonsai Poster (SVG)</button>
        <div class="small" style="margin-top:10px;">
          Poster includes your leaves and can be saved/shared.
        </div>
      </div>

      <div class="block">
        <div class="h">Danger zone</div>
        <button class="btn danger" id="clearAll">Clear all data</button>
      </div>

      <div class="block">
        <div class="h">About</div>
        <div class="small">
          Receipt Bonsai is a tiny lifestyle app: your purchases become leaves.<br/>
          Install: Safari → Share → <b>Add to Home Screen</b>.<br/>
          Offline: works after first load.
        </div>
      </div>
    </div>
  `;

  document.getElementById("back").onclick = ()=>{ state.view="tree"; render(); };

  document.getElementById("showAmt").onchange = (ev)=>{
    data.prefs.showAmounts = !!ev.target.checked;
    saveData();
  };

  document.getElementById("exportJSON").onclick = exportJSONBackup;
  document.getElementById("importJSON").onchange = importJSONBackup;
  document.getElementById("exportPoster").onclick = exportPosterSVG;

  document.getElementById("clearAll").onclick = ()=>{
    if(confirm("Clear all leaves? This cannot be undone.")){
      data = { entries: [], prefs: { showAmounts: true } };
      saveData();
      alert("Cleared.");
      state.view = "tree";
      render();
    }
  };
}

function exportJSONBackup(){
  const stamp = new Date();
  const name = `receipt-bonsai-backup-${stamp.getFullYear()}${pad2(stamp.getMonth()+1)}${pad2(stamp.getDate())}.json`;
  const blob = new Blob([JSON.stringify(data, null, 2)], {type:"application/json"});
  downloadBlob(blob, name);
}
function importJSONBackup(ev){
  const file = ev.target.files && ev.target.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = ()=> {
    try{
      const parsed = JSON.parse(String(reader.result || ""));
      if(!Array.isArray(parsed.entries)) throw new Error("Invalid backup.");
      if(!parsed.prefs) parsed.prefs = { showAmounts: true };
      if(typeof parsed.prefs.showAmounts !== "boolean") parsed.prefs.showAmounts = true;
      data = parsed;
      saveData();
      alert("Imported.");
      render();
    }catch(e){
      alert("Could not import: " + (e.message || "invalid file"));
    }
  };
  reader.readAsText(file);
}

function exportPosterSVG(){
  const svg = document.getElementById("treeSvg");
  if(!svg) {
    alert("Open the tree view first, then export.");
    return;
  }
  const clone = svg.cloneNode(true);
  clone.setAttribute("xmlns","http://www.w3.org/2000/svg");
  clone.setAttribute("width","1080");
  clone.setAttribute("height","1107");
  clone.setAttribute("viewBox","0 0 800 820");

  const bg = document.createElementNS("http://www.w3.org/2000/svg","rect");
  bg.setAttribute("x","0"); bg.setAttribute("y","0");
  bg.setAttribute("width","800"); bg.setAttribute("height","820");
  bg.setAttribute("fill","#FBF6EE");
  clone.insertBefore(bg, clone.firstChild);

  const title = document.createElementNS("http://www.w3.org/2000/svg","text");
  title.setAttribute("x","400"); title.setAttribute("y","70");
  title.setAttribute("text-anchor","middle");
  title.setAttribute("font-family","American Typewriter, Courier New, monospace");
  title.setAttribute("font-size","34");
  title.setAttribute("fill","#1E2630");
  title.setAttribute("opacity","0.9");
  title.textContent = "Receipt Bonsai";
  clone.insertBefore(title, clone.firstChild);

  const subtitle = document.createElementNS("http://www.w3.org/2000/svg","text");
  subtitle.setAttribute("x","400"); subtitle.setAttribute("y","104");
  subtitle.setAttribute("text-anchor","middle");
  subtitle.setAttribute("font-family","American Typewriter, Courier New, monospace");
  subtitle.setAttribute("font-size","16");
  subtitle.setAttribute("fill","#1E2630");
  subtitle.setAttribute("opacity","0.55");
  subtitle.textContent = `${data.entries.length} leaf/leaves`;
  clone.insertBefore(subtitle, clone.firstChild);

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n` + new XMLSerializer().serializeToString(clone);
  const blob = new Blob([xml], {type:"image/svg+xml"});
  downloadBlob(blob, "receipt-bonsai-poster.svg");
}

function downloadBlob(blob, filename){
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(()=>URL.revokeObjectURL(url), 500);
}

// Start
render();
window.addEventListener("focus", ()=>{ data = loadData(); render(); });
