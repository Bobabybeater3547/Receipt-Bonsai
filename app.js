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

const ANCHORS = [[400, 120], [360, 135], [440, 140], [320, 160], [480, 165], [380, 175], [420, 175], [350, 205], [450, 210], [300, 205], [500, 210], [335, 235], [465, 235], [395, 245], [430, 255], [365, 255], [285, 245], [515, 245], [320, 280], [480, 280], [360, 295], [440, 295], [300, 315], [500, 315], [335, 335], [465, 335], [385, 350], [415, 350], [360, 375], [440, 375], [315, 365], [485, 365], [270, 290], [530, 290], [250, 330], [550, 330], [290, 410], [510, 410], [330, 430], [470, 430], [285, 455], [515, 455], [350, 470], [450, 470], [260, 490], [540, 490], [315, 510], [485, 510], [350, 520], [450, 520], [395, 535], [420, 540], [370, 545], [440, 550]];

const state = {
  view: "tree",
  search: "",
  statsMonthISO: (new Date(new Date().getFullYear(), new Date().getMonth(), 1)).toISOString()
};

let data = loadData();
let noteCursor = 0;
let shownNoteIds = [];
let lastStage = null;
let lastAddedId = null;

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


function iconImg(id, cls){
  return `<img class="${cls}" src="./icons/${id}.png" alt="" />`;
}

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


function animateOnce(el, className, ms){
  if(!el) return;
  el.classList.remove(className);
  // force reflow
  void el.getBBox?.();
  el.classList.add(className);
  setTimeout(()=>{ el.classList.remove(className); }, ms);
}
function render(){
  if(state.view === "tree") renderTree();
  if(state.view === "list") renderList();
  if(state.view === "settings") renderSettings();
  if(state.view === "stats") renderStats();
}

function renderTree(){
  const left = `<button class="iconBtn" id="goList" aria-label="List">🧾</button><button class="iconBtn" id="goStats" aria-label="Stats">📊</button>`;
  const right = `<button class="iconBtn" id="goSettings" aria-label="Settings">⚙️</button>`;

  const count = data.entries.length;
  const stage = growthStage(count);

  app.innerHTML = `
    ${topbar(left, right)}
    <div class="titleBlock">
      <div class="title">Receipt Bonsai</div>
      <div class="sub">A bonsai grown from daily expenses.</div>
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
      <feDropShadow dx="0" dy="10" stdDeviation="12" flood-color="#000" flood-opacity="0.14"/>
    </filter>
  </defs>

  <g id="bonsaiStageWrap" filter="url(#softShadow)">
    <image id="bonsaiStageImage" href="./bonsai/stage_0.png" x="0" y="0" width="800" height="820" preserveAspectRatio="xMidYMid meet" />
  </g>
</svg>

      </div>
    </div>

    <button class="fab" id="fab" aria-label="Add">+</button>
  `;


  // Ensure receipt note overlay stack exists
  const tw = app.querySelector(".treeWrap");
  if(tw && !document.getElementById("noteOverlay")){
    const od = document.createElement("div");
    od.id = "noteOverlay";
    od.className = "noteOverlay";
    tw.appendChild(od);
  }

document.getElementById("goList").onclick = ()=>{ state.view="list"; render(); };
  document.getElementById("goStats").onclick = ()=>{ state.view="stats"; render(); };
  document.getElementById("goSettings").onclick = ()=>{ state.view="settings"; render(); };
  document.getElementById("fab").onclick = ()=> openTypePicker();

  // Sync the bonsai stage with your receipt count
  updateStageArt(true);
  bindBonsaiTap();
  renderNoteOverlay();

}


function stageIndex(n){
  // 28 stages (0..27). Grow quickly at the start, then slow down.
  // n is number of receipts (leaves).
  const thresholds = [
    0,1,2,3,4,5,6,7,8,10,12,14,16,18,21,24,27,30,34,38,43,48,54,60,67,75,84,999999
  ];
  for(let i=0;i<thresholds.length;i++){
    if(n <= thresholds[i]) return i;
  }
  return 27;
}
function growthStage(n){
  if(n === 0) return "Seedling. Add your first leaf.";
  if(n < 6) return "Sprouting.";
  if(n < 18) return "Growing.";
  if(n < 36) return "Blooming.";
  if(n < 60) return "A sturdy little tree.";
  return "A whole life, in leaves.";
}

function updateStageArt(force=false){
  const img = document.getElementById("bonsaiStageImage");
  const wrap = document.getElementById("bonsaiStageWrap");
  if(!img || !wrap) return;

  const n = data.entries.length;
  const s = stageIndex(n);
  const changed = (lastStage === null) ? true : (s !== lastStage);
  lastStage = s;

  const href = `./bonsai/stage_${s}.png`;
  img.setAttribute("href", href);
  try{ img.setAttributeNS("http://www.w3.org/1999/xlink","href", href); }catch(e){}

  if(force && changed){
    // cute grow pop
    wrap.classList.remove("stageGrow");
    void wrap.getBBox?.();
    wrap.classList.add("stageGrow");
    setTimeout(()=>wrap.classList.remove("stageGrow"), 420);
  }
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
            <button class="pickBtn" data-type="${t.id}" aria-label="${t.name}">
              <div class="pTop">
                ${iconImg(t.id,"iconPickImg")}
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
          <span class="iconMini">${iconImg(t.id,"iconCardImg")}</span>
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
              <button class="pickBtn" data-type="${t.id}" aria-label="${t.name}">
                <div class="pTop">
                  ${iconImg(t.id,"iconPickImg")}
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
        // cleanup overlay stack
        shownNoteIds = shownNoteIds.filter(id2 => data.entries.some(e2=>e2.id===id2));
        if(noteCursor > data.entries.length) noteCursor = data.entries.length;
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
    else { data.entries.push(entry); lastAddedId = id; }

    data.entries.sort((a,b)=>new Date(a.at)-new Date(b.at));
    saveData();
    shownNoteIds = shownNoteIds.filter(id2 => data.entries.some(e2=>e2.id===id2));
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
      ${iconImg(t.id,"iconCardImg")}
      <div class="meta">
        <div class="d">${shortDate(e.at)}</div>
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

  document.getElementById("clearAll").onclick = ()=>{
    if(confirm("Clear all leaves? This cannot be undone.")){
      data = { entries: [], prefs: { showAmounts: true } };
      noteCursor = 0;
      shownNoteIds = [];
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
      noteCursor = 0;
      shownNoteIds = [];
      alert("Imported.");
      render();
    }catch(e){
      alert("Could not import: " + (e.message || "invalid file"));
    }
  };
  reader.readAsText(file);
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


function bindBonsaiTap(){
  const svg = document.getElementById("treeSvg");
  if(!svg || svg.dataset.tapbound === "1") return;
  svg.dataset.tapbound = "1";
  svg.addEventListener("click", (ev)=>{
    // ignore clicks that are clearly not on the tree (e.g., if future UI is added)
    showNextReceiptNote();
  }, {passive:true});
}

function recentEntriesDesc(){
  return [...data.entries].sort((a,b)=>new Date(b.at)-new Date(a.at));
}

function showNextReceiptNote(){
  const entries = recentEntriesDesc();
  if(entries.length === 0){
    // nothing to show; do a gentle shake by toggling class?
    return;
  }

  // If we've already shown 5 notes, reset stack (then show latest again)
  if(shownNoteIds.length >= 5 || noteCursor >= entries.length){
    noteCursor = 0;
    shownNoteIds = [];
    renderNoteOverlay();
  }

  const e = entries[noteCursor];
  noteCursor += 1;

  // Avoid duplicates if user deleted entries
  if(!e) return;
  shownNoteIds.push(e.id);
  renderNoteOverlay(true);
}

function renderNoteOverlay(animateNew=false){
  const host = document.getElementById("noteOverlay");
  if(!host) return;

  const entriesById = new Map(data.entries.map(e=>[e.id,e]));
  const list = shownNoteIds.map(id=>entriesById.get(id)).filter(Boolean);
  // newest displayed at bottom, newest tap on top: keep order as shownNoteIds (latest first, then older)
  host.innerHTML = "";

  list.forEach((e, i)=>{
    const t = TYPES.find(x=>x.id===e.type) || TYPES[TYPES.length-1];
    const idx = i; // 0..n-1
    // Overlap offsets
    const dx = 0;
    const dy = idx * 12;
    // Tiny rotation for cuteness (deterministic from id)
    const rot = ((seededJitter(e.id)[2] || 0) / 12).toFixed(2); // about [-2,2]
    const z = 50 + idx;

    const showAmt = !!data.prefs.showAmounts;
    const amt = (showAmt && e.amount) ? `¥${escapeHTML(e.amount)}` : "";

    const note = formatReceiptSnippet(e.note || "");

    const div = document.createElement("div");
    div.className = "receiptNote" + ((animateNew && idx === list.length-1) ? " noteIn" : "");
    div.style.transform = `translate(${dx}px, ${dy}px) rotate(${rot}deg)`;
    div.style.zIndex = String(z);

    div.innerHTML = `
      <div class="row1">
        <div class="rowLeft">
          ${iconImg(t.id,"iconNoteImg")}
          <div>
            <div class="when">${shortDate(e.at)}</div>
          </div>
        </div>
        ${amt ? `<div class="amt">${amt}</div>` : ``}
      </div>
      ${note ? `<div class="note">${escapeHTML(note)}</div>` : ``}
    `;
    div.addEventListener("click", (ev)=> {
      ev.stopPropagation();
      // remove this note from the stack
      shownNoteIds = shownNoteIds.filter(x => x !== e.id);
      renderNoteOverlay(false);
    });
    host.appendChild(div);
  });
}

function formatReceiptSnippet(s){
  const txt = String(s || "").trim();
  if(!txt) return "";
  // single-line-ish snippet
  const one = txt.replace(/\s+/g, " ");
  if(one.length <= 90) return one;
  return one.slice(0, 88) + "…";
}


function startOfMonth(d){
  return new Date(d.getFullYear(), d.getMonth(), 1);
}
function addMonths(d, delta){
  return new Date(d.getFullYear(), d.getMonth() + delta, 1);
}
function monthTitle(d){
  return d.toLocaleDateString(undefined, { year:"numeric", month:"long" });
}
function parseAmount(s){
  const txt = String(s || "").trim();
  if(!txt) return 0;
  const cleaned = txt.replace(/[^\d.,-]/g, "").replace(/,/g, "");
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : 0;
}
function fmtYen(n){
  try{
    return new Intl.NumberFormat(undefined, { style:"currency", currency:"JPY", maximumFractionDigits:0 }).format(n);
  }catch(e){
    return "¥" + Math.round(n).toString();
  }
}

function monthEntries(anchor){
  const start = startOfMonth(anchor);
  const end = addMonths(start, 1);
  return data.entries.filter(e=>{
    const t = new Date(e.at);
    return t >= start && t < end;
  });
}

function computeMonthSums(anchor){
  const entries = monthEntries(anchor);
  const sums = {};
  TYPES.forEach(t=>{ sums[t.id] = 0; });
  for(const e of entries){
    sums[e.type] = (sums[e.type] || 0) + parseAmount(e.amount);
  }
  return sums;
}

function pieSVG(items, total){
  const cx = 120, cy = 120;
  const r1 = 92, r0 = 58;
  let a0 = -Math.PI/2;
  const paths = [];
  const gap = 0.012; // radians
  for(const it of items){
    const frac = it.value / total;
    const a1 = a0 + frac * Math.PI * 2;
    const aa0 = a0 + gap;
    const aa1 = a1 - gap;
    if(aa1 <= aa0){
      a0 = a1;
      continue;
    }
    const x00 = cx + r1*Math.cos(aa0), y00 = cy + r1*Math.sin(aa0);
    const x01 = cx + r1*Math.cos(aa1), y01 = cy + r1*Math.sin(aa1);
    const x10 = cx + r0*Math.cos(aa1), y10 = cy + r0*Math.sin(aa1);
    const x11 = cx + r0*Math.cos(aa0), y11 = cy + r0*Math.sin(aa0);
    const large = (aa1-aa0) > Math.PI ? 1 : 0;
    const d = [
      `M ${x00.toFixed(2)} ${y00.toFixed(2)}`,
      `A ${r1} ${r1} 0 ${large} 1 ${x01.toFixed(2)} ${y01.toFixed(2)}`,
      `L ${x10.toFixed(2)} ${y10.toFixed(2)}`,
      `A ${r0} ${r0} 0 ${large} 0 ${x11.toFixed(2)} ${y11.toFixed(2)}`,
      "Z"
    ].join(" ");
    paths.push(`<path d="${d}" fill="${it.color}" opacity="0.92" />`);
    a0 = a1;
  }
  const center = `
    <text x="${cx}" y="${cy-6}" text-anchor="middle" font-family="American Typewriter, Courier New, monospace" font-size="18" fill="#1E2630">${fmtYen(total)}</text>
    <text x="${cx}" y="${cy+18}" text-anchor="middle" font-family="American Typewriter, Courier New, monospace" font-size="12" fill="#1E2630" opacity="0.60">this month</text>
  `;
  return `<svg class="pie" viewBox="0 0 240 240" role="img" aria-label="Monthly expense pie chart">
    <defs>
      <filter id="pieShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="10" stdDeviation="12" flood-color="#000" flood-opacity="0.10"/>
      </filter>
    </defs>
    <circle cx="120" cy="120" r="96" fill="rgba(255,255,255,0.22)" stroke="rgba(30,38,48,0.10)" />
    <g filter="url(#pieShadow)">${paths.join("")}</g>
    ${center}
  </svg>`;
}

function renderStats(){
  const left = `<button class="iconBtn" id="back" aria-label="Back">←</button>`;
  const right = `<button class="iconBtn" id="goSettings" aria-label="Settings">⚙️</button>`;

  const anchor = startOfMonth(new Date(state.statsMonthISO));
  const sums = computeMonthSums(anchor);
  const items = TYPES
    .map(t=>({ id:t.id, name:t.name, color:t.color, value: Math.max(0, sums[t.id] || 0) }))
    .filter(x=>x.value > 0.0001)
    .sort((a,b)=>b.value-a.value);

  const total = items.reduce((s,x)=>s+x.value,0);

  app.innerHTML = `
    ${topbar(left, right)}
    <div class="titleBlock">
      <div class="title">Overview</div>
      <div class="sub">A gentle monthly summary.</div>
    </div>

    <div class="statsHeader">
      <button class="navBtn" id="prevM" aria-label="Previous month">‹</button>
      <div class="m">${monthTitle(anchor)}</div>
      <button class="navBtn" id="nextM" aria-label="Next month">›</button>
    </div>

    <div class="statsCard">
      <div class="pieRow">
        ${total > 0 ? pieSVG(items, total) : `<div class="small" style="padding:14px 0; text-align:center;">No amounts in this month yet.</div>`}
      </div>

      ${total > 0 ? `
      <div class="legend">
        ${items.map(it=>`
          <div class="legItem">
            ${iconImg(it.id,"iconCardImg")}
            <div class="legTxt">
              <div class="n">${escapeHTML(it.name)}</div>
              <div class="v">${fmtYen(it.value)}</div>
            </div>
          </div>
        `).join("")}
      </div>` : ``}
    </div>
  `;

  document.getElementById("back").onclick = ()=>{ state.view="tree"; render(); };
  document.getElementById("goSettings").onclick = ()=>{ state.view="settings"; render(); };

  document.getElementById("prevM").onclick = ()=>{
    const d = addMonths(anchor, -1);
    state.statsMonthISO = d.toISOString();
    renderStats();
  };
  document.getElementById("nextM").onclick = ()=>{
    const d = addMonths(anchor, 1);
    state.statsMonthISO = d.toISOString();
    renderStats();
  };
}

// Start
render();
window.addEventListener("focus", ()=>{ data = loadData(); render(); });
