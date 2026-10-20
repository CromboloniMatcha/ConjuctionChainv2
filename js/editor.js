/* Editor view: add, edit, reorder and delete questions and conjunctions. Autosaves via Store. */
(function () {
  const $ = id => document.getElementById(id);
  const qList = $("qList"), cList = $("cList");
  let dirty = false;

  const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const say = (t, good) => { const m = $("editMsg"); m.textContent = t || ""; m.className = "msgbar" + (t ? (good ? " good" : " warn") : ""); };
  function changed() {
    dirty = true;
    $("saveState").textContent = Store.save() ? "Saved ✓" : "Couldn’t save in this browser (storage is blocked)";
  }
  // Two-step button: first click arms it ("Sure?"), second click runs the action.
  function confirmClick(btn, fn) {
    if (btn.dataset.armed) { fn(); return; }
    btn.dataset.armed = "1";
    const t = btn.textContent; btn.textContent = "Sure?";
    setTimeout(() => { delete btn.dataset.armed; btn.textContent = t; }, 2500);
  }

  function renderQ() {
    const words = Object.keys(CONJ);
    qList.innerHTML = QUESTIONS.map((Q, i) => `
      <div class="qcard" data-i="${i}">
        <div class="qhead"><b>Question ${i + 1}</b>
          <span class="qtools">
            <button class="icon" data-act="up" title="Move up" ${i ? "" : "disabled"}>↑</button>
            <button class="icon" data-act="down" title="Move down" ${i < QUESTIONS.length - 1 ? "" : "disabled"}>↓</button>
            <button class="icon danger" data-act="del" title="Delete question">🗑</button>
          </span></div>
        <label>First sentence<input data-f="top" value="${esc(Q.top)}" placeholder="e.g. I was very tired"></label>
        <label>Second sentence<input data-f="bottom" value="${esc(Q.bottom)}" placeholder="e.g. I went to bed early"></label>
        <div class="lbl">Correct conjunctions (tap to select, one or more)</div>
        <div class="chips">${words.map(w => `<button class="chip${Q.answer.includes(w) ? " on" : ""}" data-act="ans" data-w="${esc(w)}">${esc(w)}</button>`).join("")}</div>
      </div>`).join("") || '<p class="empty">No questions yet. Tap “+ Add question”.</p>';
  }
  function renderC() {
    cList.innerHTML = Object.entries(CONJ).map(([w, c]) => `
      <div class="ccard" data-w="${esc(w)}">
        <div class="qhead"><b>${esc(w)}</b><button class="icon danger" data-act="delc" title="Delete conjunction">🗑</button></div>
        <label>What it does<input data-f="use" value="${esc(c.use)}"></label>
        <label>Similar words (comma separated)<input data-f="syn" value="${esc(c.syn)}"></label>
      </div>`).join("");
  }
  const renderAll = () => { renderQ(); renderC(); };

  qList.addEventListener("click", e => {
    const b = e.target.closest("button[data-act]"); if (!b) return;
    const i = +b.closest(".qcard").dataset.i, act = b.dataset.act;
    if (act === "del") { confirmClick(b, () => { QUESTIONS.splice(i, 1); changed(); renderQ(); }); return; }
    if (act === "up" || act === "down") {
      const j = act === "up" ? i - 1 : i + 1;
      [QUESTIONS[i], QUESTIONS[j]] = [QUESTIONS[j], QUESTIONS[i]]; changed(); renderQ(); return;
    }
    if (act === "ans") {
      const a = QUESTIONS[i].answer, k = a.indexOf(b.dataset.w);
      if (k < 0) a.push(b.dataset.w); else a.splice(k, 1);
      changed(); renderQ();
    }
  });
  qList.addEventListener("input", e => {
    const f = e.target.dataset.f; if (!f) return;
    QUESTIONS[+e.target.closest(".qcard").dataset.i][f] = e.target.value;
    e.target.classList.remove("invalid"); changed();
  });
  cList.addEventListener("click", e => {
    const b = e.target.closest("button[data-act=delc]"); if (!b) return;
    const w = b.closest(".ccard").dataset.w;
    confirmClick(b, () => {
      delete CONJ[w];
      QUESTIONS.forEach(Q => { Q.answer = Q.answer.filter(a => a !== w); });
      changed(); renderAll();
    });
  });
  cList.addEventListener("input", e => {
    const f = e.target.dataset.f; if (!f) return;
    CONJ[e.target.closest(".ccard").dataset.w][f] = e.target.value; changed();
  });

  function addQuestion() {
    QUESTIONS.push({ top: "", bottom: "", answer: [] });
    changed(); renderQ(); say("");
    const card = qList.lastElementChild;
    card.scrollIntoView({ behavior: "smooth", block: "center" });
    card.querySelector("input").focus({ preventScroll: true });
  }
  function addConj() {
    const inp = $("newConj"), w = inp.value.trim().toLowerCase();
    if (!w) return say("Type the conjunction first.");
    if (CONJ[w]) return say("“" + w + "” already exists.");
    CONJ[w] = { use: "Explain what it does.", syn: "" };
    inp.value = ""; changed(); renderAll();
    say("Added “" + w + "”. Write its explanation below.", true);
  }
  $("addQ").onclick = addQuestion; $("addQ2").onclick = addQuestion;
  $("addConj").onclick = addConj;
  $("newConj").addEventListener("keydown", e => { if (e.key === "Enter") addConj(); });

  // Backup / restore / share
  const box = $("backupText"), bmsg = $("backupMsg");
  $("showJson").onclick = () => { box.value = JSON.stringify({ conj: CONJ, questions: QUESTIONS }, null, 2); box.select(); bmsg.textContent = "Copy this text to keep a backup."; };
  $("showJs").onclick = () => { box.value = "const CONJ = " + JSON.stringify(CONJ, null, 2) + ";\n\nconst QUESTIONS = " + JSON.stringify(QUESTIONS, null, 2) + ";\n"; box.select(); bmsg.textContent = "Paste this into js/data.js to make the changes permanent."; };
  $("importBtn").onclick = () => {
    try {
      const d = JSON.parse(box.value);
      const ok = d && d.conj && typeof d.conj === "object" && Array.isArray(d.questions) &&
        d.questions.every(Q => typeof Q.top === "string" && typeof Q.bottom === "string" && Array.isArray(Q.answer));
      if (!ok) throw new Error("shape");
      Store.replace(d); changed(); renderAll(); bmsg.textContent = "Imported ✓";
    } catch (err) { bmsg.textContent = "That doesn’t look like valid JSON from this editor."; }
  };
  $("resetBtn").onclick = e => confirmClick(e.currentTarget, () => { Store.reset(); location.reload(); });

  function validate() {
    if (!QUESTIONS.length) { say("Add at least one question first."); return false; }
    let first = null;
    QUESTIONS.forEach((Q, i) => {
      Q.top = Q.top.trim(); Q.bottom = Q.bottom.trim();
      const bad = !Q.top || !Q.bottom || !Q.answer.length;
      qList.children[i].classList.toggle("invalid", bad);
      if (bad && !first) first = qList.children[i];
    });
    if (first) {
      first.scrollIntoView({ behavior: "smooth", block: "center" });
      say("Fill in both sentences and pick at least one correct conjunction in the highlighted question(s).");
      return false;
    }
    Store.save(); return true;
  }
  function show(view) {
    const edit = view === "edit";
    $("playView").hidden = edit; $("editView").hidden = !edit;
    $("tabPlay").classList.toggle("active", !edit); $("tabEdit").classList.toggle("active", edit);
    $("subTitle").textContent = edit ? "Add, change or delete questions. Changes save automatically." : "Drag a conjunction piece into the gap to connect the two sentences.";
    if (edit) { renderAll(); say(""); }
  }
  $("tabEdit").onclick = () => show("edit");
  $("tabPlay").onclick = () => {
    if ($("editView").hidden) return;
    if (!validate()) return;
    if (dirty) location.reload(); else show("play");
  };
})();
