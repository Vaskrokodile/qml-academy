// MMR/rank calculator: loads db.js in Node, applies a state (default:
// the bundled restore snapshot), prints MMR + rank under the CURRENT
// formula in db.js. Usage: node mmr.js [stateFile.json]
const fs = require('fs');
const path = require('path');

const store = {};
const localStorage = {
  getItem: k => (k in store ? store[k] : null),
  setItem: (k, v) => { store[k] = String(v); },
  removeItem: k => { delete store[k]; },
};
const window = {};
eval(fs.readFileSync(path.join(__dirname, 'assets/js/db.js'), 'utf8'));
const DB = window.QML.DB;

const arg = process.argv[2];
let state;
if (arg && arg !== '-') {
  state = JSON.parse(fs.readFileSync(arg, 'utf8'));
} else {
  // bundled restore snapshot
  eval(fs.readFileSync(path.join(__dirname, 'assets/js/restore-data.js'), 'utf8'));
  state = window.QML_RESTORE;
}
if (state) DB.importState(state);

const s = DB.stats();
const m = DB.mmrRank();
console.log('xp', s.xp, '| q', s.questions.correct + '/' + s.questions.total,
  '| evalAvg', s.evalAvg, '| courses', s.coursesDone + '/' + s.courseCount,
  '| study', Math.round(s.studySec / 3600) + 'h', '| site', Math.round(s.timeSec / 3600) + 'h');
console.log('MMR', m.value, '->', m.rank.label || m.rank.name, m.next ? `(next: ${m.next.label || m.next.name} at ${m.next.mmr}, ${m.pct}% in)` : '(max)');
