/* Validate applied track: every eq tex renders (trust), every @{key}
   has a symbols entry, options render, eval/bank schema sane, MMR bonus fires. */
const fs = require('fs');
const path = require('path');
const katex = require('./assets/vendor/katex/katex.js');

const store = {};
const localStorage = {
  getItem: k => (k in store ? store[k] : null),
  setItem: (k, v) => { store[k] = String(v); },
  removeItem: k => { delete store[k]; },
};
const window = { katex };
const load = f => eval(fs.readFileSync(path.join(__dirname, 'assets/js', f), 'utf8'));
load('db.js');
load('eq.js');
load('data/courses.js');
load('data/course-gates.js');
load('data/course-deepening-a.js');
load('data/course-deepening-b.js');
load('data/evals.js');
load('data/bank.js');
load('data/applied-courses.js');
load('data/applied-bank.js');
load('data/applied-walk.js');
globalThis.QML = window.QML;
globalThis.QML_COURSES = window.QML_COURSES;
const DB = QML.DB;

let errs = 0, warns = 0;
const err = (...a) => { errs++; console.log('ERR ', ...a); };
const warn = (...a) => { warns++; console.log('warn', ...a); };

function checkTex(tex, where) {
  const expanded = QML.eq.expand(tex);
  try {
    katex.renderToString(expanded, { displayMode: true, throwOnError: true, strict: 'ignore', trust: true });
  } catch (e) { err('KaTeX fail', where, '|', e.message.slice(0, 100)); }
  /* symbol coverage */
  const keys = [...tex.matchAll(/@\{([A-Za-z0-9_]+)\}/g)].map(m => m[1]);
  return keys;
}

function checkSpec(spec, where) {
  if (!spec.tex) return err('eqx missing tex', where);
  const keys = checkTex(spec.tex, where);
  const syms = spec.symbols || {};
  keys.forEach(k => {
    if (!syms[k]) warn(`tex @key '${k}' has no symbols entry — card will show meta only`, where);
    else if (!Array.isArray(syms[k]) || syms[k].length < 2) err(`symbols['${k}'] malformed`, where);
  });
  Object.keys(syms).forEach(k => { if (!keys.includes(k)) warn(`symbols['${k}'] unused in tex`, where); });
  ['what', 'limits'].forEach(f => { if (!spec[f]) warn(`missing meta '${f}'`, where); });
}

/* ---- courses ---- */
let eqxCount = 0;
const appliedCourses = (window.QML_COURSES || []).filter(c => c.track === 'applied');
console.log('applied courses:', appliedCourses.map(c => `${c.id} (${(c.lessons || []).length} lessons)`).join(', '));
appliedCourses.forEach(c => {
  if (!c.id || !c.title || !Array.isArray(c.lessons) || !c.lessons.length) err('bad course', c.id);
  c.lessons.forEach(l => {
    if (!l.id || !l.title) err('bad lesson', c.id, l.id);
    (l.sections || []).forEach((s, i) => {
      const where = `${c.id}/${l.id}/sec${i}`;
      if (s.type === 'eqx') { eqxCount++; checkSpec(s, where); }
      else if (s.type === 'predict') {
        (s.options || []).forEach(o => (o.match(/\$([^$]+)\$/g) || []).forEach(m =>
          checkTex(m.slice(1, -1), where + ':predict')));
        if (s.reveal) (s.reveal.match(/\$([^$]+)\$/g) || []).forEach(m =>
          checkTex(m.slice(1, -1), where + ':reveal'));
      }
      else if (s.type === 'quiz' && s.question) {
        if (!Array.isArray(s.question.options) || !Number.isInteger(s.question.answer)) err('quiz malformed', where);
      }
      else if (!['text', 'points', 'reflect', 'steps', 'symbols'].includes(s.type)) warn('unknown section type ' + s.type, where);
    });
  });
});
console.log('eqx blocks:', eqxCount);

/* ---- bank ---- */
const bankQ = window.QML_APPLIED_BANK || [];
console.log('applied bank:', bankQ.length, 'questions');
const ids = new Set();
bankQ.forEach(q => {
  const where = 'bank:' + q.id;
  if (ids.has(q.id)) err('dup id', q.id); ids.add(q.id);
  if (q.topic !== 'applied') err('topic not applied', q.id);
  if (!q.eq) return err('no eq', q.id);
  checkSpec(q.eq, where + ':eq');
  if (typeof q.prompt !== 'string' || !q.prompt) err('prompt', q.id);
  if (!Array.isArray(q.options) || q.options.length !== 4) err('options!=4', q.id);
  else q.options.forEach((o, k) => {
    try { katex.renderToString(o.t, { displayMode: true, throwOnError: true, strict: 'ignore' }); }
    catch (e) { err(`option ${k} KaTeX`, q.id, e.message.slice(0, 80)); }
    if (/@\{/.test(o.t)) warn('option contains @marker (tips must stay off)', q.id);
  });
  if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer > 3) err('answer idx', q.id);
  /* prompt $..$ check */
  (q.prompt.match(/\$([^$]+)\$/g) || []).forEach(m => {
    try { katex.renderToString(m.slice(1, -1), { throwOnError: true, strict: 'ignore' }); }
    catch (e) { err('prompt tex', q.id, m.slice(0, 40), e.message.slice(0, 60)); }
  });
});

/* ---- evals ---- */
const courseIds = new Set(appliedCourses.map(c => c.id));
const appliedEvals = (window.QML_EVALS || []).filter(e => courseIds.has(e.courseId));
console.log('applied evals:', appliedEvals.map(e => e.id).join(', '));
appliedEvals.forEach(e => {
  (e.questions || []).forEach(q => {
    if (!q.prompt || !Array.isArray(q.options) || !Number.isInteger(q.answer)) err('eval q malformed', e.id, q.id);
    (q.prompt.match(/\$([^$]+)\$/g) || []).forEach(m => {
      try { katex.renderToString(m.slice(1, -1), { throwOnError: true, strict: 'ignore' }); }
      catch (e2) { err('eval prompt tex', q.id, e2.message.slice(0, 60)); }
    });
    q.options.forEach(o => (String(o).match(/\$([^$]+)\$/g) || []).forEach(m => {
      try { katex.renderToString(m.slice(1, -1), { throwOnError: true, strict: 'ignore' }); }
      catch (e2) { err('eval opt tex', q.id, e2.message.slice(0, 60)); }
    }));
  });
});

/* ---- walkthroughs ---- */
const SCENES = new Set(['bloch','state','gate','cnot','pair','matrix','complex','levels','overlap','winding','outer','sum','evolve','dims','norm','bars','swap','decay','dataset','measure','encode','landscape','fourier','grover','spins','entangle']);
const walk = window.QML_APPLIED_WALK || {};
bankQ.forEach(q => {
  const w = walk[q.id];
  if (!w) return err('missing walkthrough', q.id);
  if (!w.viz || !SCENES.has(w.viz.scene)) err('bad viz scene', q.id, w.viz && w.viz.scene);
  if (!Array.isArray(w.steps) || !w.steps.length) return err('no steps', q.id);
  w.steps.forEach((s, i) => {
    const where = `walk:${q.id}/step${i}`;
    if (!s.h) err('step missing heading', where);
    [s.t].concat(s.eq ? [s.eq] : []).forEach(txt => {
      if (!txt) return;
      (String(txt).match(/\$([^$]+)\$/g) || []).forEach(m => {
        try { katex.renderToString(m.slice(1, -1), { throwOnError: true, strict: 'ignore' }); }
        catch (e) { err('walk tex', where, m.slice(0, 50), e.message.slice(0, 60)); }
      });
    });
    if (s.eq) {
      try { katex.renderToString(s.eq, { displayMode: true, throwOnError: true, strict: 'ignore' }); }
      catch (e) { err('walk display eq', where, e.message.slice(0, 80)); }
    }
  });
});
console.log('walkthroughs:', Object.keys(walk).length);

/* ---- MMR: applied answers must pay ---- */
DB.reset();
const base = DB.mmr();
for (let i = 0; i < 10; i++) DB.recordAnswer('ax00' + (i % 9 + 1), 'applied', true);
const after = DB.mmr();
const a = DB.state().applied;
const appliedPts = DB.stats().applied.mmr;
console.log(`MMR check: base ${base} -> ${after} | applied bucket ${JSON.stringify(a)} | stats.applied.mmr ${appliedPts}`);
if (appliedPts !== 120) err('applied MMR term wrong', appliedPts);
if (after - base < 120) err('total MMR delta too small', after - base);
if (a.correct !== 10 || a.total !== 10) err('applied bucket wrong');

console.log(`\n=== ${errs} errors, ${warns} warnings ===`);
process.exit(errs ? 1 : 0);
