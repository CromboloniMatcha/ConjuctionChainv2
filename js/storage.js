/* Persistence: teacher edits are kept in this browser (localStorage) and override the defaults in data.js. */
const Store = {
  KEY: "conjunctionChain.v1",
  replace(d) {
    Object.keys(CONJ).forEach(k => delete CONJ[k]);
    Object.assign(CONJ, d.conj);
    QUESTIONS.length = 0;
    QUESTIONS.push(...d.questions);
  },
  save() {
    try { localStorage.setItem(this.KEY, JSON.stringify({ conj: CONJ, questions: QUESTIONS })); return true; }
    catch (e) { return false; }
  },
  reset() { try { localStorage.removeItem(this.KEY); } catch (e) {} },
  restore() {
    try {
      const raw = localStorage.getItem(this.KEY);
      if (!raw) return;
      const d = JSON.parse(raw);
      if (d && d.conj && Array.isArray(d.questions) && d.questions.length) this.replace(d);
    } catch (e) {}
  }
};
Store.restore();
