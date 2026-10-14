// Load-order smoke test: eval each runtime file with stubbed browser
// globals and report any top-level throw (views render lazily, so
// app.js's boot errors are reported separately, not fatal).
const fs = require('fs');
const path = require('path');
const root = __dirname;

global.window = global;
global.QML = {};
const store = {};
global.localStorage = {
  getItem: k => (k in store ? store[k] : null),
  setItem: (k, v) => { store[k] = String(v); },
  removeItem: k => { delete store[k]; },
  key: i => Object.keys(store)[i] || null,
  get length() { return Object.keys(store).length; },
};
const nullEl = () => ({ innerHTML: '', appendChild() {}, querySelector: () => null, querySelectorAll: () => [], style: {}, dataset: {}, classList: { add() {}, toggle() {} }, addEventListener() {}, remove() {} });
global.document = {
  documentElement: { dataset: {} },
  hidden: false,
  addEventListener() {},
  getElementById: () => nullEl(),
  createElement: () => nullEl(),
  body: nullEl(),
  querySelectorAll: () => [],
};
global.location = { hash: '', reload() {} };
global.navigator = {};
global.performance = { now: () => 0 };
global.requestAnimationFrame = () => 0;
global.devicePixelRatio = 1;
global.confirm = () => false;
global.ResizeObserver = class { observe() {} disconnect() {} };

const order = [
  'assets/js/icons.js', 'assets/js/db.js', 'assets/js/restore-data.js',
  'assets/js/components.js', 'assets/js/viz.js', 'assets/js/viz3d.js',
  'assets/js/interact.js',
  'assets/js/data/bank.js', 'assets/js/data/definitions.js', 'assets/js/data/meta.js',
  'assets/js/data/evals.js', 'assets/js/data/courses.js', 'assets/js/data/practical.js', 'assets/js/data/eval-practical.js',
  'assets/js/data/course-gates.js', 'assets/js/data/course-deepening-a.js', 'assets/js/data/course-deepening-b.js', 'assets/js/data/equations.js',
  'assets/js/data/hardcore.js', 'assets/js/data/visuals.js', 'assets/js/data/symdetail.js',
  'assets/js/views/home.js', 'assets/js/views/courses.js', 'assets/js/views/course.js',
  'assets/js/views/evals.js', 'assets/js/views/challenges.js', 'assets/js/views/practice.js', 'assets/js/views/focus.js',
  'assets/js/views/palace.js', 'assets/js/views/stats.js', 'assets/js/views/definitions.js',
  'assets/js/views/meta.js', 'assets/js/views/hardcore.js', 'assets/js/views/visuals.js',
];
let bad = 0;
for (const f of order) {
  try { eval(fs.readFileSync(path.join(root, f), 'utf8')); }
  catch (e) { bad++; console.log('LOAD FAIL', f, '→', e.message); }
}
/* sanity: exercise the DB API end-to-end on the stub store */
try {
  const DB = QML.DB;
  const m = DB.mmrRank();
  console.log(`MMR ${m.value} → ${m.rank.label} (next ${m.next ? m.next.label : '—'})`);
  DB.recordConfidence('m001', 90, false);
  console.log('confQueue:', DB.confQueue());
  DB.recordHardcore('havl19', 'e3', 100);
  console.log('hardcore:', DB.hardcoreTotals());
  DB.recordConfidence('x', 10, true);
  const snaps = DB.snapshots();
  console.log('snapshots:', snaps);
  console.log('ladder len:', DB.ladder().length, '| last:', DB.ladder().slice(-1)[0].label);
  console.log('mmr after activity:', DB.mmr());
} catch (e) { bad++; console.log('DB API FAIL →', e.stack.slice(0, 400)); }

/* views should at least be functions */
['home','courses','course','evals','challenges','practice','focus','palace','stats','definitions','meta','hardcore','visuals']
  .forEach(v => { if (typeof QML.views[v] !== 'function') { bad++; console.log('MISSING VIEW', v); } });

console.log(bad ? `FAIL ${bad}` : 'SMOKE OK');
